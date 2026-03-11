"use client";
import { Badge } from "@/components/ui/badge";
import { Task } from "../dto/task.dto";

const TasksBadgeTask = ({ status }: { status: Task["status"] }) => {
  switch (status) {
    case "TODO":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-blue-400 dark:text-blue-50 dark:hover:bg-blue-700 border-0 cursor-pointer"
        >
          {status}
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border-0"
        >
          {status}
        </Badge>
      );
    case "DONE":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 border-0"
        >
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default TasksBadgeTask;
