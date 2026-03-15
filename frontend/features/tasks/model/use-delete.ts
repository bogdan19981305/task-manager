import { useMutation } from "@tanstack/react-query";

import { api } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";

import { Task, TaskListResponse } from "../dto/task.dto";

type UseDeleteTaskOptions = {
  onSuccess?: (data: Task) => void;
  onError?: (error: Error, taskId: string, context: unknown) => void;
};

export function useDeleteTask(options?: UseDeleteTaskOptions) {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueriesData<TaskListResponse[]>({
        queryKey: ["tasks"],
      });
      queryClient.setQueriesData(
        { queryKey: ["tasks"] },
        (old: TaskListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.filter((task) => task.id !== taskId),
          };
        },
      );
      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      context?.previousTasks?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options?.onError?.(_error, _taskId, context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
