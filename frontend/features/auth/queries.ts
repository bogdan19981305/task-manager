import { api } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";
import { MeDto } from "./dto/me.dto";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<MeDto>("/auth/me");
      return res.data;
    },
    retry: false,
  });
}
