import { API_PATHS } from "@/shared/api/paths";
import { apiUrl } from "@/shared/config/public-env";

export type OAuthProvider = "google" | "github";

const paths: Record<OAuthProvider, string> = {
  google: API_PATHS.auth.google,
  github: API_PATHS.auth.github,
};

/** Full URL to start OAuth on the API (redirect in browser). */
export function oauthLoginUrl(provider: OAuthProvider): string {
  return apiUrl(paths[provider]);
}
