import { api } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";
import { TaskListResponse } from "../dto/task.dto";

export type UseTasksProps = {
  page: number;
  limit: number;
};

export function useTasks({ page, limit }: UseTasksProps) {
  return useQuery({
    queryKey: ["tasks", page, limit],
    queryFn: async () => {
      const res = await api.get<TaskListResponse>("/tasks", {
        params: {
          page,
          limit,
        },
      });
      return res.data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 30_000,
  });
}
