import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/features/auth/queries";
import useUsers from "@/features/users/model/use-users";
import { cn } from "@/lib/utils";

import {
  TaskCreateSchema,
  taskCreateSchema,
} from "../model/schema/task-create.schema";
import useCreateTask from "../model/use-create-task";
import useTaskById from "../model/use-task";
import { useUpdateTask } from "../model/use-update-task";
import { TaskAiGenerateButton } from "./task-ai-generate-button";

type TaskDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  taskId: string | null;
};

const TaskDrawer = ({ open, setOpen, mode, taskId }: TaskDrawerProps) => {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: taskData, isLoading } = useTaskById(taskId);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TaskCreateSchema>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
      content: null,
      assigneeId: null,
    },
  });

  const handleClose = () => {
    if (mode === "edit") {
      router.push("/tasks");
    } else {
      setOpen(false);
    }
    reset();
  };
  const { data: usersData } = useUsers();
  const users =
    usersData?.map((user) => ({
      label: user.name ?? user.email,
      value: user.id,
    })) ?? [];
  const { mutate: handleCreateTaskMutation, isPending } = useCreateTask({
    onSuccess: () => {
      toast.success("Task created successfully");
      handleClose();
    },
    onError: () => {
      toast.error("Failed to create task");
    },
    onSettled: () => {
      reset();
    },
  });
  const { mutate: handleUpdateTaskMutation, isPending: isUpdating } =
    useUpdateTask({
      onSuccess: () => {
        toast.success("Task updated successfully");
        handleClose();
      },
      onError: () => {
        toast.error("Failed to update task");
      },
    });
  const handleCreateTask = async (data: TaskCreateSchema) => {
    if (mode === "create") {
      handleCreateTaskMutation(data);
    } else {
      handleUpdateTaskMutation({
        id: taskId ?? "",
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
          ...(data.assigneeId && { assigneeId: data.assigneeId }),
        },
      });
    }
  };

  useEffect(() => {
    if (taskData && mode === "edit") {
      reset({
        title: taskData.data.title,
        content: taskData.data.content ?? null,
        assigneeId: taskData.data.assignee?.id ?? null,
      });
    }
  }, [taskData?.data, mode, taskData, reset]);

  const titleValue = useWatch({ control, name: "title", defaultValue: "" });
  const hasTitleForAi =
    typeof titleValue === "string" && titleValue.trim().length > 0;
  const showAiButton = hasTitleForAi && me?.role === "ADMIN";

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction="right"
      onClose={handleClose}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <DrawerContent className="px-4 h-full d-flex">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              {mode === "create" ? "Create Task" : "Edit Task"}
            </DrawerTitle>
            {mode === "create" && (
              <DrawerDescription>
                Please provide the details of the task to be created.
              </DrawerDescription>
            )}
            {mode === "edit" && (
              <DrawerDescription>
                Please provide the details of the task to be edited.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <form onSubmit={handleSubmit(handleCreateTask)}>
            <div className="grid grid-cols-12 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-start gap-2 col-span-12">
                <Field>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Task Title"
                    size={20}
                    required
                    aria-invalid={!!errors.title}
                    {...register("title")}
                  />
                  {errors.title && (
                    <FieldError errors={[errors.title]}>
                      {errors.title.message ?? "Title is required"}
                    </FieldError>
                  )}
                </Field>
              </div>
              <div className="flex flex-col items-start gap-2 col-span-12">
                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <Label>Assignee</Label>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString() ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.value}
                              value={user.value.toString()}
                            >
                              {user.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
              <div className="flex flex-col items-stretch gap-2 col-span-12">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="content" className="mb-0">
                    Content
                  </Label>
                  <TaskAiGenerateButton
                    visible={showAiButton}
                    title={
                      typeof titleValue === "string" ? titleValue : ""
                    }
                    setContent={(value) =>
                      setValue("content", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                <Textarea
                  id="content"
                  placeholder="Task Description"
                  {...register("content")}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                className={cn(
                  "cursor-pointer",
                  "bg-primary",
                  "text-primary-foreground",
                  "hover:bg-transparent",
                  "hover:text-primary",
                  "hover:border-primary",
                )}
                type="submit"
                disabled={isPending || isUpdating}
              >
                {mode === "create" ? (
                  <IconPlus className="size-4" />
                ) : (
                  <IconEdit className="size-4" />
                )}
                {mode === "create" ? "Create Task" : "Edit Task"}
              </Button>
            </div>
          </form>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default TaskDrawer;
