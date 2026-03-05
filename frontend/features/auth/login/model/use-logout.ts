"use client";

import { api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
