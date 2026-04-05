import type { BillingInterval, PlanKey } from "@/shared/types/plans";

export type { BillingInterval, PlanKey };

export type PlanDto = {
  id: number;
  key: PlanKey;
  interval: BillingInterval;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  permissions: string[];
  stripePriceId: string | null;
  stripeProductId: string | null;
  isActive: boolean;
  sortOrder: number;
  trialDays: number | null;
  createdAt: string;
  updatedAt: string;
};

export type PlanCreatePayload = {
  key: PlanKey;
  interval?: BillingInterval;
  trialDays?: number | null;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  features: string[];
  permissions: string[];
  stripePriceId?: string;
  stripeProductId?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type PlanUpdatePayload = Partial<PlanCreatePayload>;
