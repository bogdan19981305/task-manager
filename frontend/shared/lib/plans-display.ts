import type { PublicPlan } from "@/shared/types/plans";

type PlanTierGroup = {
  key: PublicPlan["key"];
  rows: PublicPlan[];
  sortOrder: number;
};

/** One marketing column per plan key; rows may include MONTH and YEAR prices. */
function groupPublicPlansByTier(plans: PublicPlan[]): PlanTierGroup[] {
  const map = new Map<PublicPlan["key"], PublicPlan[]>();
  for (const p of plans) {
    const list = map.get(p.key) ?? [];
    list.push(p);
    map.set(p.key, list);
  }
  return [...map.entries()]
    .map(([key, rows]) => ({
      key,
      rows,
      sortOrder: Math.min(...rows.map((r) => r.sortOrder)),
    }))
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.key.localeCompare(b.key);
    });
}

function primaryRowForTier(tier: PlanTierGroup): PublicPlan {
  return (
    tier.rows.find((r) => r.interval === "MONTH") ??
    tier.rows.find((r) => r.interval === "YEAR") ??
    tier.rows[0]!
  );
}

function pricesForTier(tier: PlanTierGroup): {
  monthlyPrice: string;
  yearlyPrice: string;
} {
  const monthly = tier.rows.find((r) => r.interval === "MONTH");
  const yearly = tier.rows.find((r) => r.interval === "YEAR");
  const primary = primaryRowForTier(tier);

  const monthlyPrice = monthly
    ? formatPriceMinorUnits(monthly.price, monthly.currency)
    : yearly
      ? formatPriceMinorUnits(Math.round(yearly.price / 12), yearly.currency)
      : formatPriceMinorUnits(primary.price, primary.currency);

  const yearlyPrice = yearly
    ? formatPriceMinorUnits(yearly.price, yearly.currency)
    : monthly
      ? formatPriceMinorUnits(
          estimatedYearlyMinorFromMonthly(monthly.price),
          monthly.currency,
        )
      : formatPriceMinorUnits(
          estimatedYearlyMinorFromMonthly(primary.price),
          primary.currency,
        );

  return { monthlyPrice, yearlyPrice };
}

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
  const tiers = groupPublicPlansByTier(plans);
  return tiers.map((tier) => {
    const primary = primaryRowForTier(tier);
    const { monthlyPrice, yearlyPrice } = pricesForTier(tier);
    const { key } = tier;
    return {
      id: key,
      name: primary.name,
      description: primary.description ?? "",
      monthlyPrice,
      yearlyPrice,
      features: primary.features.map((text) => ({ text })),
      button: {
        text: key === "PREMIUM" ? "Contact sales" : "Get started",
        url: key === "PREMIUM" ? "/contact" : "/auth/sign-up",
      },
      highlighted: key === "PRO",
      showStarterUpsellLine: key === "PRO",
    };
  });
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
  const tiers = groupPublicPlansByTier(plans);
  return tiers.map((tier) => {
    const primary = primaryRowForTier(tier);
    const { monthlyPrice, yearlyPrice } = pricesForTier(tier);
    const { key } = tier;
    return {
      id: key,
      key,
      name: primary.name,
      description: primary.description ?? "",
      monthlyPrice,
      yearlyPrice,
      href: key === "PREMIUM" ? "/contact" : "/auth/sign-up",
      cta: key === "PREMIUM" ? "Contact sales" : "Get started",
      highlighted: key === "PRO",
      featureBullets: primary.features,
    };
  });
}

export type FeatureMatrixRow = {
  feature: string;
  included: boolean[];
};

export function buildFeatureMatrixFromPlans(
  plans: PublicPlan[],
): FeatureMatrixRow[] {
  const tiers = groupPublicPlansByTier(plans);
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const tier of tiers) {
    for (const f of primaryRowForTier(tier).features) {
      if (!seen.has(f)) {
        seen.add(f);
        ordered.push(f);
      }
    }
  }
  return ordered.map((feature) => ({
    feature,
    included: tiers.map((tier) =>
      primaryRowForTier(tier).features.includes(feature),
    ),
  }));
}
