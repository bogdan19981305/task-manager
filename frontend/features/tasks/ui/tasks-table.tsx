"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTasks } from "@/features/tasks/model/use-tasks";
import { useState } from "react";
import TasksRow from "./tasks-row";
import { Pagination } from "@/shared/components";
import { PAGINATION_PAGE_SIZE_DEFAULT } from "@/config/global";
import { useDeleteTask } from "../model/use-delete";
import { toast } from "sonner";
import { useUpdateTask } from "../model/use-update-task";
import { TaskStatus, TaskStatusValues } from "../dto/task.dto";

export default function TasksTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION_PAGE_SIZE_DEFAULT);
  const { data: tasksData, isLoading } = useTasks({ page, limit });

  const { mutate: deleteTask } = useDeleteTask({
    onSuccess: () => {
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const { mutate: updateTask } = useUpdateTask({
    onSuccess: () => {
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  return (
    <div className="mb-10">
      <div className="rounded-sm border bg-card w-[98%] mx-auto mt-10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 px-4 font-medium">Title</TableHead>
              <TableHead className="h-12 px-4 font-medium">Assignee</TableHead>
              <TableHead className="h-12 px-4 font-medium w-[120px]">
                Status
              </TableHead>

              <TableHead className="h-12 px-4 font-medium">
                Date created
              </TableHead>
              <TableHead className="h-12 px-4 font-medium w-[180px]">
                Creator
              </TableHead>
              <TableHead className="h-12 px-4 font-medium w-[180px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              (tasksData?.content ?? []).map((task) => (
                <TasksRow
                  key={task.id}
                  task={task}
                  onDelete={() => deleteTask(task.id)}
                  onStart={() =>
                    updateTask({
                      id: task.id,
                      data: { status: TaskStatusValues.IN_PROGRESS },
                    })
                  }
                />
              ))}
            {isLoading &&
              [...Array(7)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="h-16 px-4 text-center">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        totalPages={tasksData?.totalPages ?? 0}
        onPageChange={setPage}
        onLimitChange={(limit) => {
          setLimit(Number(limit));
          setPage(1);
        }}
      />
    </div>
  );
}
