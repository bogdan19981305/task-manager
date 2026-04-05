import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { PlanDto } from "../dto/plan.dto";

export function useAdminPlans() {
  return useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      const res = await api.get<PlanDto[]>("/admin/plans");
      return res.data;
    },
  });
}
