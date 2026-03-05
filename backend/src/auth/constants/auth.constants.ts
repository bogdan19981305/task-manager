export const AUTH_COOKIES = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;

export const ACCESS_TTL_MS = 15 * 60 * 1000; // 15 min
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
