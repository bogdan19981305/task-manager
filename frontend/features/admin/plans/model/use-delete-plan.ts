import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useDeletePlan(options: Options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/plans/${id}`);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      options.onSuccess?.();
    },
    onError: (error: Error) => options.onError?.(error),
  });
}
