import { z } from "zod";

export const registerDtoSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(32, "Maximum 32 characters"),
    passwordConfirmation: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(32, "Maximum 32 characters"),
    name: z.string().min(1, "Name is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });

export type RegisterDto = z.infer<typeof registerDtoSchema>;

export const registerDtoValidator = registerDtoSchema.safeParse;
