import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { TaskListResponse, TaskStatus } from "../dto/task.dto";

export type UseTasksProps = {
  page: number;
  limit: number;
  status?: TaskStatus | null;
};

export function useTasks({ page, limit, status }: UseTasksProps) {
  return useQuery({
    queryKey: ["tasks", page, limit, status],
    queryFn: async () => {
      const res = await api.get<TaskListResponse>("/tasks", {
        params: {
          page,
          limit,
          status,
        },
      });
      return res.data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 30_000,
  });
}
