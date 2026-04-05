/**
 * Public env values available on client and server (inlined at build time).
 * Single source of truth for the backend origin — do not read
 * `process.env.NEXT_PUBLIC_API_URL` elsewhere.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** Build an absolute backend URL. `path` must start with `/`. */
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
