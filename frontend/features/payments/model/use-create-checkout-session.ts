import { useMutation } from "@tanstack/react-query";

import { api } from "@/shared/api/api";
import { API_PATHS } from "@/shared/api/paths";

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (planId: number) => {
      const res = await api.post<{ url: string }>(
        API_PATHS.payments.checkoutSession,
        { planId },
      );
      return res.data;
    },
    onSuccess: (data) => {
      window.location.assign(data.url);
    },
  });
}
