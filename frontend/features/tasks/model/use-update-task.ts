import { useMutation } from "@tanstack/react-query";

import { api } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";

import { Task, TaskListResponse } from "../dto/task.dto";
import { TaskUpdateDto } from "../dto/task-update.dto";

type UseUpdateTaskOptions = {
  onSuccess?: (data: Task) => void;
  onError?: (error: Error, taskId: string, context: unknown) => void;
};

export function useUpdateTask(options?: UseUpdateTaskOptions) {
  return useMutation({
    mutationFn: async (taskUpdateDto: TaskUpdateDto) => {
      const res = await api.patch(
        `/tasks/${taskUpdateDto.id}`,
        taskUpdateDto.data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onMutate: async (taskUpdateDto) => {
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
            content: old.content.map((task) =>
              task.id === taskUpdateDto.id
                ? { ...task, ...taskUpdateDto.data }
                : task,
            ),
          };
        },
      );
      return { previousTasks };
    },
    onError: (_error, _taskUpdateDto, context) => {
      context?.previousTasks?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options?.onError?.(_error, _taskUpdateDto.id, context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
