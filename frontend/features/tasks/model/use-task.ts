import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { Task } from "../dto/task.dto";

const useTaskById = (id: string | null) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["tasks", id],
    queryFn: () => api.get<Task>(`/tasks/${id}`),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export default useTaskById;
