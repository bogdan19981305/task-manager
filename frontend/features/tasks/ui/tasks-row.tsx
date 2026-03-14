"use client";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileTextIcon, Loader2, PlayIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Task } from "../dto/task.dto";
import TasksBadgeTask from "./tasks-badge";

type TaskActionType = "start" | "pause" | "complete" | "delete" | "view";

const TasksRow = ({ task, onDelete }: { task: Task; onDelete: () => void }) => {
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: TaskActionType;
  } | null>(null);

  const isTaskActionPending = (action: TaskActionType, taskId: string) =>
    pendingAction?.id === taskId && pendingAction.type === action;

  const isTaskBusy = (taskId: string) => pendingAction?.id === taskId;

  const handleAction = async (task: Task, actionType: TaskActionType) => {
    setPendingAction({ id: task.id, type: actionType });
    if (actionType === "delete") {
      await onDelete();
      setPendingAction(null);
      return;
    }
  };

  const busy = isTaskBusy(task.id);
  const startPending = isTaskActionPending("start", task.id);
  const deletePending = isTaskActionPending("delete", task.id);

  return (
    <TableRow key={task.id} className="hover:bg-muted/50">
      <TableCell className="h-16 px-4 font-medium">{task.title}</TableCell>
      <TableCell className="h-16 px-4 text-sm text-muted-foreground">
        {task.assignee?.name}
      </TableCell>
      <TableCell className="h-16 px-4">
        <TasksBadgeTask status={task.status} />
      </TableCell>

      <TableCell className="h-16 px-4 text-sm text-muted-foreground">
        {new Date(task.createdAt).toLocaleString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell className="h-16 px-4 text-sm text-muted-foreground">
        {task.creator?.name}
      </TableCell>
      <TableCell className="h-16 px-4">
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {task.status === "TODO" && (
              <Tooltip>
                <TooltipTrigger asChild className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAction(task, "start")}
                    disabled={busy}
                    aria-label="Start"
                  >
                    {startPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <PlayIcon className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => handleAction(task, "delete")}
                  disabled={busy}
                  aria-label="Delete"
                >
                  {deletePending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleAction(task, "view")}
                  disabled={busy}
                  aria-label="View details"
                >
                  <FileTextIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

export default TasksRow;
