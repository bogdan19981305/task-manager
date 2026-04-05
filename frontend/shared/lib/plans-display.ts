import type { PublicPlan } from "@/shared/types/plans";

export function formatPriceMinorUnits(
  amountMinor: number,
  currency: string,
): string {
  const code = (currency ?? "usd").trim() || "usd";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${code.toUpperCase()}`;
  }
}

/** ~2 months off vs paying 12× monthly (matches previous marketing copy). */
export function estimatedYearlyMinorFromMonthly(monthlyMinor: number): number {
  return Math.round(monthlyMinor * 10);
}

export type LandingPricingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: { text: string }[];
  button: { text: string; url: string };
  highlighted: boolean;
  showStarterUpsellLine: boolean;
};

export function mapPublicPlansToLandingCards(
  plans: PublicPlan[],
): LandingPricingPlan[] {
  return plans.map((p) => ({
    id: p.key,
    name: p.name,
    description: p.description ?? "",
    monthlyPrice: formatPriceMinorUnits(p.price, p.currency),
    yearlyPrice: formatPriceMinorUnits(
      estimatedYearlyMinorFromMonthly(p.price),
      p.currency,
    ),
    features: p.features.map((text) => ({ text })),
    button: {
      text: p.key === "PREMIUM" ? "Contact sales" : "Get started",
      url: p.key === "PREMIUM" ? "/contact" : "/auth/sign-up",
    },
    highlighted: p.key === "PRO",
    showStarterUpsellLine: p.key === "PRO",
  }));
}

export type ComparisonPlanCard = {
  id: string;
  key: PublicPlan["key"];
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  href: string;
  cta: string;
  highlighted: boolean;
  featureBullets: string[];
};

export function mapPublicPlansToComparisonCards(
  plans: PublicPlan[],
): ComparisonPlanCard[] {
  return plans.map((p) => ({
    id: p.key,
    key: p.key,
    name: p.name,
    description: p.description ?? "",
    monthlyPrice: formatPriceMinorUnits(p.price, p.currency),
    yearlyPrice: formatPriceMinorUnits(
      estimatedYearlyMinorFromMonthly(p.price),
      p.currency,
    ),
    href: p.key === "PREMIUM" ? "/contact" : "/auth/sign-up",
    cta: p.key === "PREMIUM" ? "Contact sales" : "Get started",
    highlighted: p.key === "PRO",
    featureBullets: p.features,
  }));
}

export type FeatureMatrixRow = {
  feature: string;
  included: boolean[];
};

export function buildFeatureMatrixFromPlans(
  plans: PublicPlan[],
): FeatureMatrixRow[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const plan of plans) {
    for (const f of plan.features) {
      if (!seen.has(f)) {
        seen.add(f);
        ordered.push(f);
      }
    }
  }
  return ordered.map((feature) => ({
    feature,
    included: plans.map((p) => p.features.includes(feature)),
  }));
}
