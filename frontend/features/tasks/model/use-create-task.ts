import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { Task } from "../dto/task.dto";
import { TaskCreateDto } from "../dto/task-create.dto";

type UseCreateTaskOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

const useCreateTask = (options: UseCreateTaskOptions) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: TaskCreateDto) => {
      const res = await api.post<Task>("/tasks", dto);
      return res.data as Task;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
    onSettled: () => {
      options?.onSettled?.();
    },
  });
};

export default useCreateTask;
