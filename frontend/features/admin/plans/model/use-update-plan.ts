import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { PlanDto, PlanUpdatePayload } from "../dto/plan.dto";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useUpdatePlan(options: Options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: PlanUpdatePayload;
    }) => {
      const res = await api.patch<PlanDto>(`/admin/plans/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      options.onSuccess?.();
    },
    onError: (error: Error) => options.onError?.(error),
  });
}
