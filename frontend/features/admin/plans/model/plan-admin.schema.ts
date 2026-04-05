import { z } from "zod";

const planKeys = ["STARTER", "PRO", "PREMIUM"] as const;
const billingIntervals = ["MONTH", "YEAR"] as const;

export const planAdminFormSchema = z.object({
  key: z.enum(planKeys),
  interval: z.enum(billingIntervals),
  trialDays: z.number().int().min(0).max(3660).optional(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  price: z.coerce.number().int().min(0),
  currency: z.string().max(8).optional(),
  featuresText: z.string(),
  permissionsText: z.string(),
  stripePriceId: z.string().optional(),
  stripeProductId: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

export type PlanAdminFormValues = z.infer<typeof planAdminFormSchema>;

export function linesToList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToLines(items: string[]): string {
  return items.join("\n");
}
