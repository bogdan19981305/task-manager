import { z } from "zod";

export const loginDtoSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .max(32, "Maximum 32 characters"),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;

export const loginDtoValidator = loginDtoSchema.safeParse;
