"use client";

import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGINATION_PAGE_SIZE_DEFAULT } from "@/config/global";
import { useTasks } from "@/features/tasks/model/use-tasks";
import { useTasksRealtime } from "@/features/tasks/model/use-tasks-realtime";
import { cn } from "@/lib/utils";
import { Pagination } from "@/shared/components";

import { TaskStatus, TaskStatusValues } from "../dto/task.dto";
import { useDeleteTask } from "../model/use-delete";
import { useUpdateTask } from "../model/use-update-task";
import TaskDrawer from "./task-drawer";
import TaskViewDrawer from "./task-view-drawer";
import TasksFilter from "./tasks-filter";
import { TasksRealtimeStatus } from "./tasks-realtime-status";
import TasksRow from "./tasks-row";

export default function TasksTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION_PAGE_SIZE_DEFAULT);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const { data: tasksData, isLoading } = useTasks({ page, limit, status });
  const { connectionStatus } = useTasksRealtime();

  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const viewId = searchParams.get("viewId");

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

  const changeStatus = (status: TaskStatus | null) => {
    setStatus(status);
    setPage(1);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center gap-4 p-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <TasksRealtimeStatus status={connectionStatus} />
        </div>
        <Button
          className={cn(
            "cursor-pointer",
            "bg-primary",
            "text-primary-foreground",
            "hover:bg-transparent",
            "hover:text-primary",
            "hover:border-primary",
          )}
          variant="default"
          onClick={() => setOpenCreateDrawer(true)}
        >
          <PlusIcon className="size-4" />
          Create task
        </Button>
      </div>
      <div className="rounded-sm border bg-card w-[98%] mx-auto mt-10">
        <TasksFilter setStatus={changeStatus} status={status} />
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
      <TaskDrawer
        open={openCreateDrawer}
        setOpen={setOpenCreateDrawer}
        mode="create"
        taskId={null}
      />
      <TaskDrawer
        open={!!editId}
        setOpen={() => {}}
        mode="edit"
        taskId={editId}
      />
      <TaskViewDrawer taskId={viewId} />
    </div>
  );
}
