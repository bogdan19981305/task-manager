import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
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
import useUsers from "@/features/users/model/use-users";
import { cn } from "@/lib/utils";

import {
  TaskCreateSchema,
  taskCreateSchema,
} from "../model/schema/task-create.schema";
import useCreateTask from "../model/use-create-task";

type TaskCreateDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TaskCreateDrawer = ({ open, setOpen }: TaskCreateDrawerProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskCreateSchema>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
      content: null,
      assigneeId: null,
    },
  });
  const { data: usersData } = useUsers();
  const users =
    usersData?.map((user) => ({
      label: user.name ?? user.email,
      value: user.id,
    })) ?? [];
  const { mutate: handleCreateTaskMutation, isPending } = useCreateTask({
    onSuccess: () => {
      toast.success("Task created successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create task");
    },
    onSettled: () => {
      reset();
    },
  });
  const handleCreateTask = async (data: TaskCreateSchema) => {
    handleCreateTaskMutation(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="px-4 h-full d-flex">
        <DrawerHeader className="px-0">
          <DrawerTitle>Create Task</DrawerTitle>
          <DrawerDescription>
            Please provide the details of the task to be created.
          </DrawerDescription>
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
            <div className="flex flex-col items-start gap-2 col-span-12">
              <Label htmlFor="content">Content</Label>
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
              disabled={isPending}
            >
              <IconPlus className="size-4" />
              Create Task
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskCreateDrawer;
