import {
  CheckIcon,
  Layers2,
  ShoppingBagIcon,
  SquareTerminalIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { TaskStatus, TaskStatusValues } from "../dto/task.dto";

interface TasksFilterProps {
  setStatus: (status: TaskStatus | null) => void;
  status: TaskStatus | null;
}

const TasksFilter = ({ setStatus, status }: TasksFilterProps) => {
  return (
    <div className="px-4 py-2 mt-2">
      <h4 className="text-md font-medium mb-4">Filter by status</h4>
      <Tabs defaultValue="preview" value={status ?? "all"}>
        <TabsList className="d-flex gap-2">
          <TabsTrigger
            value="all"
            className={cn(
              "cursor-pointer",
              status === null ? "!text-foreground" : "!text-primary",
            )}
            onClick={() => setStatus(null)}
          >
            <Layers2 />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger
            value={TaskStatusValues.TODO}
            className={cn(
              "cursor-pointer",
              status === TaskStatusValues.TODO
                ? "!text-yellow-300"
                : "!text-yellow-800",
            )}
            onClick={() => setStatus(TaskStatusValues.TODO)}
          >
            <ShoppingBagIcon />
            <span>To Do</span>
          </TabsTrigger>
          <TabsTrigger
            value={TaskStatusValues.IN_PROGRESS}
            className={cn(
              "cursor-pointer",
              status === TaskStatusValues.IN_PROGRESS
                ? "!text-blue-300"
                : "!text-blue-800",
            )}
            onClick={() => setStatus(TaskStatusValues.IN_PROGRESS)}
          >
            <SquareTerminalIcon />
            <span>In Progress</span>
          </TabsTrigger>
          <TabsTrigger
            value={TaskStatusValues.DONE}
            className={cn(
              "cursor-pointer",
              status === TaskStatusValues.DONE
                ? "!text-green-300"
                : "!text-green-800",
            )}
            onClick={() => setStatus(TaskStatusValues.DONE)}
          >
            <CheckIcon />
            <span>Done</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TasksFilter;
