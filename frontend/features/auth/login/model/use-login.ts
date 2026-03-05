import { api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type LoginDto } from "./schema";

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const res = await api.post("/auth/login", dto);
      return res.data;
    },
    onSuccess: async (data) => {
      await qc.setQueryData(["me"], data);
      await qc.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    },
  });
}
