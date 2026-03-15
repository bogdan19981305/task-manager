import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().nullable(),
  assigneeId: z.number().nullable(),
});

export type TaskCreateSchema = z.infer<typeof taskCreateSchema>;
