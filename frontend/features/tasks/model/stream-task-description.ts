import axios, { CanceledError } from "axios";

import { api } from "@/shared/api/api";
import { API_PATHS } from "@/shared/api/paths";

export type StreamTaskDescriptionErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "FAILED"
  | "ABORTED";

export class StreamTaskDescriptionError extends Error {
  constructor(
    message: string,
    readonly code: StreamTaskDescriptionErrorCode,
  ) {
    super(message);
    this.name = "StreamTaskDescriptionError";
  }
}

function isReadableStream(value: unknown): value is ReadableStream<Uint8Array> {
  return (
    !!value &&
    typeof value === "object" &&
    "getReader" in value &&
    typeof (value as ReadableStream<Uint8Array>).getReader === "function"
  );
}

export async function streamTaskDescription(
  title: string,
  onDelta: (accumulated: string) => void,
  options?: { signal?: AbortSignal },
): Promise<void> {
  try {
    const response = await api.post<ReadableStream<Uint8Array> | undefined>(
      API_PATHS.tasks.generateDescription,
      { title },
      {
        adapter: "fetch",
        responseType: "stream",
        signal: options?.signal,
        headers: {
          Accept: "text/plain",
        },
      },
    );

    const stream = response.data;
    if (!isReadableStream(stream)) {
      throw new StreamTaskDescriptionError("No response stream", "FAILED");
    }

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      onDelta(accumulated);
    }
    accumulated += decoder.decode();
    onDelta(accumulated);
  } catch (e) {
    if (e instanceof CanceledError) {
      throw new StreamTaskDescriptionError("Aborted", "ABORTED");
    }
    if (options?.signal?.aborted) {
      throw new StreamTaskDescriptionError("Aborted", "ABORTED");
    }
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      if (status === 401) {
        throw new StreamTaskDescriptionError("Unauthorized", "UNAUTHORIZED");
      }
      if (status === 403) {
        throw new StreamTaskDescriptionError("Forbidden", "FORBIDDEN");
      }
    }
    if (e instanceof StreamTaskDescriptionError) {
      throw e;
    }
    throw new StreamTaskDescriptionError("Request failed", "FAILED");
  }
}
