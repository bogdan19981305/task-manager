import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import useTaskById from "../model/use-task";

interface TaskViewDrawerProps {
  taskId: string | null;
}

const TaskViewDrawer = ({ taskId }: TaskViewDrawerProps) => {
  const { data: taskData, isLoading } = useTaskById(taskId);
  const router = useRouter();
  return (
    <Drawer
      open={!!taskId}
      onClose={() => router.push("/tasks")}
      direction="right"
    >
      {!isLoading && (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Task Details</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Title</span>
              <span className="text-sm font-medium">
                {taskData?.data?.title}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Assignee</span>
              <span className="text-sm font-medium">
                {taskData?.data?.assignee?.name}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Status</span>
              <span className="text-sm font-medium">
                {taskData?.data?.status}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Content</span>
              <span className="text-sm font-medium">
                {taskData?.data?.content}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Created At</span>
              <span className="text-sm font-medium">
                {new Date(taskData?.data?.createdAt ?? "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Updated At</span>
              <span className="text-sm font-medium">
                {new Date(taskData?.data?.updatedAt ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default TaskViewDrawer;
