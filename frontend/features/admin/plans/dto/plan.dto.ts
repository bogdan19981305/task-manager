import type { PlanKey } from "@/shared/types/plans";

export type { PlanKey };

export type PlanDto = {
  id: number;
  key: PlanKey;
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
  createdAt: string;
  updatedAt: string;
};

export type PlanCreatePayload = {
  key: PlanKey;
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
