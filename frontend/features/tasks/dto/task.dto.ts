import { PaginatedResponse } from "@/shared/api/types";

export interface Task {
  id: string;
  title: string;
  content: string | null;
  status: (typeof TaskStatusValues)[keyof typeof TaskStatusValues];
  creator?: TaskUser;
  assignee?: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export const TaskStatusValues = {
  TODO: "TODO" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  DONE: "DONE" as const,
} as const;

export interface TaskUser {
  id: number;
  name: string;
}

export type TaskListResponse = PaginatedResponse<Task>;
