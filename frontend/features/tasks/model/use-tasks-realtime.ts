"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { api } from "@/shared/api/api";
import { API_BASE_URL } from "@/shared/config/public-env";

const TASKS_NAMESPACE = "/tasks";

export const TASKS_WS_EVENTS = {
  created: "task:created",
  updated: "task:updated",
  deleted: "task:deleted",
} as const;

export type TasksSocketConnectionStatus =
  | "idle"
  | "connecting"
  | "reconnecting"
  | "connected"
  | "disconnected"
  | "unavailable";

export function useTasksRealtime(enabled = true) {
  const queryClient = useQueryClient();
  const queryClientRef = useRef(queryClient);
  const [liveStatus, setLiveStatus] = useState<
    Exclude<TasksSocketConnectionStatus, "idle">
  >("connecting");

  const connectionStatus: TasksSocketConnectionStatus = enabled
    ? liveStatus
    : "idle";

  useEffect(() => {
    queryClientRef.current = queryClient;
  });

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let socket: Socket | null = null;

    const safeSet = (
      next: Exclude<TasksSocketConnectionStatus, "idle">,
    ) => {
      if (!cancelled) setLiveStatus(next);
    };

    void (async () => {
      safeSet("connecting");
      try {
        const { data } = await api.get<{ token: string }>("/auth/socket-token");
        if (cancelled) return;

        const s = io(`${API_BASE_URL}${TASKS_NAMESPACE}`, {
          withCredentials: true,
          auth: { token: data.token },
          transports: ["websocket", "polling"],
        });
        socket = s;

        const invalidateTasks = () => {
          void queryClientRef.current.invalidateQueries({ queryKey: ["tasks"] });
        };

        s.on("connect", () => {
          safeSet("connected");
        });

        s.on("disconnect", (reason) => {
          if (cancelled) return;
          if (reason === "io client disconnect") return;
          if (s.active) safeSet("reconnecting");
          else safeSet("disconnected");
        });

        s.on("connect_error", () => {
          if (cancelled) return;
          if (s.active) safeSet("reconnecting");
          else safeSet("disconnected");
        });

        s.on(TASKS_WS_EVENTS.created, invalidateTasks);
        s.on(TASKS_WS_EVENTS.updated, invalidateTasks);
        s.on(TASKS_WS_EVENTS.deleted, invalidateTasks);
      } catch {
        safeSet("unavailable");
      }
    })();

    return () => {
      cancelled = true;
      queueMicrotask(() => {
        socket?.off(TASKS_WS_EVENTS.created);
        socket?.off(TASKS_WS_EVENTS.updated);
        socket?.off(TASKS_WS_EVENTS.deleted);
        socket?.off("connect");
        socket?.off("disconnect");
        socket?.off("connect_error");
        socket?.disconnect();
      });
    };
  }, [enabled]);

  return { connectionStatus };
}
