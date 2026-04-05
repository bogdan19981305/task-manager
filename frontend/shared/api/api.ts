"use client";

import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { api } from "./api-client";
import { API_PATHS } from "./paths";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_PATHS.auth.refresh) &&
      !originalRequest.url?.includes(API_PATHS.auth.login)
    ) {
      originalRequest._retry = true;
      try {
        await api.post(API_PATHS.auth.refresh);
        return api(originalRequest);
      } catch {
        const url = originalRequest.url ?? "";
        const wasAuthMe = url.includes(API_PATHS.auth.me);
        if (!wasAuthMe && !window.location.pathname.includes("/auth/sign-in")) {
          toast.error("Session expired. Please sign in again");
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
      }
    }
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        toast.error(
          "Network error or server is not responding. Please try again later.",
        );
        return Promise.reject(error);
      }
      const reqUrl = error.config?.url ?? "";
      const status = error.response.status;
      const silentGuestAuth =
        status === 401 &&
        (reqUrl.includes(API_PATHS.auth.me) ||
          reqUrl.includes(API_PATHS.auth.refresh));
      if (!silentGuestAuth) {
        toast.error(error.response?.data?.message);
      }
    }
    return Promise.reject(error);
  },
);

export { api };
