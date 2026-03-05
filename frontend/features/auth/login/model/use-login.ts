import { api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginDto } from "./schema";

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const res = await api.post("/auth/login", dto);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
