import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/shared/api/api";

import { RegisterDto } from "./schema";

export function useRegister() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const res = await api.post("/auth/register", dto);
      return res.data;
    },
    onSuccess: async (data) => {
      await qc.setQueryData(["me"], data);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Account created successfully");
      router.push("/dashboard");
    },
  });
}
