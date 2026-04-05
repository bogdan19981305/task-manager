import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { PlanCreatePayload, PlanDto } from "../dto/plan.dto";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useCreatePlan(options: Options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlanCreatePayload) => {
      const res = await api.post<PlanDto>("/admin/plans", payload);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      options.onSuccess?.();
    },
    onError: (error: Error) => options.onError?.(error),
  });
}
