import { PaginatedResponse } from "@/shared/api/types";

export interface Task {
  id: string;
  title: string;
  content: string | null;
  status: TaskStatus;
  creator?: TaskUser;
  assignee?: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskUser {
  id: number;
  name: string;
}

export type TaskListResponse = PaginatedResponse<Task>;
