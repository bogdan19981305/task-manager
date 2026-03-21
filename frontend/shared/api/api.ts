"use client";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        if (!window.location.pathname.includes("/auth/sign-in")) {
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
      toast.error(error.response?.data?.message);
    }
    return Promise.reject(error);
  },
);
