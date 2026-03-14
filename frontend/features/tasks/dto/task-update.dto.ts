import { type Task } from "./task.dto";

export interface TaskUpdateDto {
  id: string;
  data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "creator">>;
}
