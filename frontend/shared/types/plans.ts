export type PlanKey = "STARTER" | "PRO" | "PREMIUM";

export type BillingInterval = "MONTH" | "YEAR";

/** Public catalog row from GET /plans (marketing / pricing). */
export type PublicPlan = {
  id: number;
  key: PlanKey;
  interval: BillingInterval;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  sortOrder: number;
  trialDays: number | null;
};
