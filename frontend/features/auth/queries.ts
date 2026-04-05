import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/api";
import { API_PATHS } from "@/shared/api/paths";

import { MeDto } from "./dto/me.dto";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<MeDto>(API_PATHS.auth.me);
      return res.data;
    },
    retry: false,
    staleTime: 60_000,
  });
}
