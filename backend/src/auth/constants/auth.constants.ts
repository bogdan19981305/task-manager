export const AUTH_COOKIES = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;

export const ACCESS_TTL_MS = 15 * 60 * 1000; // 15 min
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60;
export const REDIS_REFRESH_KEY = (userId: number) => `refresh_token:${userId}`;

export function buildCookieOptions(maxAge: number, path: string = '/') {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ('none' as const)
        : ('lax' as const),
    path,
    maxAge,
  };
}
