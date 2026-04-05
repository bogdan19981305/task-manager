"use client";

import { CircleCheck } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PlanPurchaseCtaButton } from "@/features/payments/ui/plan-purchase-cta-button";
import { cn } from "@/lib/utils";
import {
  type LandingPricingPlan,
  mapPublicPlansToLandingCards,
} from "@/shared/lib/plans-display";
import type { PublicPlan } from "@/shared/types/plans";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

interface PricingBlockProps {
  heading?: string;
  description?: string;
  /** When set and non-empty, replaces default static plans (from API /plans). */
  dbPlans?: PublicPlan[] | null;
  className?: string;
}

const FALLBACK_PLANS: LandingPricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For solo builders and small teams getting organized",
    monthlyPrice: "$19",
    yearlyPrice: "$179",
    features: [
      { text: "Up to 5 teammates on one workspace" },
      { text: "Unlimited tasks, statuses, and priorities" },
      { text: "Due dates and filters so nothing slips" },
      { text: "Community support" },
    ],
    button: { text: "Get started" },
    purchaseAction: { kind: "link", href: "/auth/sign-in" },
    highlighted: false,
    showStarterUpsellLine: false,
  },
  {
    id: "team",
    name: "Team",
    description: "For teams that ship together every week",
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    features: [
      { text: "Unlimited members in your workspace" },
      { text: "Saved views, bulk actions, and deeper filters" },
      { text: "Priority support when the board is critical" },
      { text: "Exports and longer activity history" },
    ],
    button: { text: "Get started" },
    purchaseAction: { kind: "link", href: "/auth/sign-in" },
    highlighted: true,
    showStarterUpsellLine: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Security, scale, and support for whole organizations",
    monthlyPrice: "$99",
    yearlyPrice: "$899",
    features: [
      { text: "Org-wide roles, policies, and audit-friendly controls" },
      { text: "SSO and advanced security reviews (on request)" },
      { text: "Dedicated onboarding and a named contact" },
      { text: "Custom SLA and terms for your procurement" },
    ],
    button: { text: "Contact sales" },
    purchaseAction: { kind: "link", href: "/contact" },
    highlighted: false,
    showStarterUpsellLine: false,
  },
];

const PricingBlock = ({
  heading = "Pricing that fits your workflow",
  description = "One dashboard for tasks and deadlines. Pick a plan for your team size. Change or cancel anytime.",
  dbPlans = null,
  className,
}: PricingBlockProps) => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = useMemo(() => {
    if (dbPlans && dbPlans.length > 0) {
      return mapPublicPlansToLandingCards(dbPlans);
    }
    return FALLBACK_PLANS;
  }, [dbPlans]);

  return (
    <SectionScrollReveal
      id="pricing"
      intensity="expressive"
      className={cn("bg-background py-8 sm:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2
            data-reveal
            className="text-4xl font-semibold text-pretty lg:text-6xl"
          >
            {heading}
          </h2>
          <p data-reveal className="text-muted-foreground lg:text-xl">
            {description}
          </p>
          <div data-reveal className="flex items-center gap-3 text-lg">
            Monthly
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Yearly
          </div>
          <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                data-reveal
                className={cn(
                  "flex w-80 flex-col justify-between text-left transition-shadow",
                  plan.highlighted && "ring-primary/25 shadow-md ring-2",
                )}
              >
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-semibold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground text-2xl font-semibold">
                      {isYearly ? "/yr" : "/mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.showStarterUpsellLine ? (
                    <p className="mb-3 font-semibold">
                      Everything in Starter, and:
                    </p>
                  ) : null}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4 shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <PlanPurchaseCtaButton
                    className="w-full"
                    label={plan.button.text}
                    action={plan.purchaseAction}
                    isYearly={isYearly}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SectionScrollReveal>
  );
};

export default PricingBlock;
