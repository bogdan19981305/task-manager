/**
 * Returns a safe same-origin path for post-login redirects.
 * Rejects protocol-relative URLs and anything that does not start with a single `/`.
 */
export function safeInternalRedirectPath(
  raw: string | null | undefined,
): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  return trimmed;
}
