/** Relative paths on the API origin (use with `api` client or `apiUrl()`). */
export const API_PATHS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    google: "/auth/google",
    github: "/auth/github",
  },
  blog: {
    posts: "/blog/posts",
    postBySlug: (slug: string) => `/blog/posts/${encodeURIComponent(slug)}`,
  },
  plans: {
    publicList: "/plans",
  },
} as const;
