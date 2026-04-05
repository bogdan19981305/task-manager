export type PlanKey = "STARTER" | "PRO" | "PREMIUM";

/** Public catalog row from GET /plans (marketing / pricing). */
export type PublicPlan = {
  id: number;
  key: PlanKey;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  sortOrder: number;
};
