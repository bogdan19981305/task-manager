"use client";

import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanPurchaseCtaButton } from "@/features/payments/ui/plan-purchase-cta-button";
import { cn } from "@/lib/utils";
import {
  buildFeatureMatrixFromPlans,
  type ComparisonPlanCard,
  mapPublicPlansToComparisonCards,
} from "@/shared/lib/plans-display";
import type { PublicPlan } from "@/shared/types/plans";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

type Cell = boolean | string;

const STATIC_COMPARISON_CARDS: ComparisonPlanCard[] = [
  {
    id: "starter",
    key: "STARTER",
    name: "Starter",
    description: "For solo builders and small teams getting organized",
    monthlyPrice: "$19",
    yearlyPrice: "$179",
    cta: "Get started",
    purchaseAction: { kind: "link", href: "/auth/sign-in" },
    highlighted: false,
    featureBullets: [
      "Up to 5 teammates",
      "Unlimited tasks and priorities",
      "Community support",
    ],
  },
  {
    id: "team",
    key: "PRO",
    name: "Team",
    description: "For teams that ship together every week",
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    cta: "Get started",
    purchaseAction: { kind: "link", href: "/auth/sign-in" },
    highlighted: true,
    featureBullets: [
      "Everything in Starter",
      "Unlimited members",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    key: "PREMIUM",
    name: "Enterprise",
    description: "Security, scale, and support for whole organizations",
    monthlyPrice: "$99",
    yearlyPrice: "$899",
    cta: "Contact sales",
    purchaseAction: { kind: "link", href: "/contact" },
    highlighted: false,
    featureBullets: [
      "Everything in Team",
      "SSO and audit-friendly controls",
      "Custom SLA and onboarding",
    ],
  },
];

const STATIC_COMPARISON: {
  feature: string;
  starter: Cell;
  team: Cell;
  enterprise: Cell;
}[] = [
  {
    feature: "Teammates per workspace",
    starter: "Up to 5",
    team: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "Tasks, statuses, and priorities",
    starter: true,
    team: true,
    enterprise: true,
  },
  {
    feature: "Due dates, filters, and assignments",
    starter: true,
    team: true,
    enterprise: true,
  },
  {
    feature: "Saved views and bulk actions",
    starter: false,
    team: true,
    enterprise: true,
  },
  {
    feature: "Exports and activity history",
    starter: "Basic",
    team: "Extended (1 year)",
    enterprise: "Custom retention",
  },
  {
    feature: "Support",
    starter: "Community",
    team: "Priority email",
    enterprise: "Dedicated contact",
  },
  {
    feature: "SSO and org-wide policies",
    starter: false,
    team: false,
    enterprise: true,
  },
  {
    feature: "Custom SLA and procurement terms",
    starter: false,
    team: false,
    enterprise: true,
  },
];

function ComparisonCell({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex justify-center">
        <Check
          className="text-primary size-4"
          strokeWidth={2.5}
          aria-label="Included"
        />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex justify-center">
        <Minus
          className="text-muted-foreground/70 size-4"
          aria-label="Not included"
        />
      </span>
    );
  }
  return (
    <span className="text-muted-foreground text-center font-normal">
      {value}
    </span>
  );
}

type PricingComparisonProps = {
  /** When set and non-empty, cards and the feature matrix come from the API. */
  dbPlans?: PublicPlan[] | null;
};

export function PricingComparison({ dbPlans = null }: PricingComparisonProps) {
  const [isYearly, setIsYearly] = useState(false);

  const useDb = Boolean(dbPlans && dbPlans.length > 0);

  const cards = useMemo(() => {
    if (useDb && dbPlans) {
      return mapPublicPlansToComparisonCards(dbPlans);
    }
    return STATIC_COMPARISON_CARDS;
  }, [dbPlans, useDb]);

  const matrixRows = useMemo(() => {
    if (useDb && dbPlans) {
      return buildFeatureMatrixFromPlans(dbPlans);
    }
    return null;
  }, [dbPlans, useDb]);

  const popularIndex = useMemo(
    () => cards.findIndex((c) => c.highlighted),
    [cards],
  );

  return (
    <>
      <SectionScrollReveal
        intensity="subtle"
        className="border-border border-b bg-background py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p
              data-reveal
              className="text-muted-foreground text-sm sm:text-base"
            >
              Simple billing. Switch between monthly and yearly anytime—yearly
              saves about two months.
            </p>
            <div
              data-reveal
              className="flex items-center gap-3 text-base font-medium"
            >
              <span
                className={cn(
                  !isYearly ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                aria-label="Toggle yearly billing"
              />
              <span
                className={cn(
                  isYearly ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Yearly
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cards.map((plan) => (
              <Card
                key={plan.id}
                data-reveal
                className={cn(
                  "relative flex h-full flex-col text-left shadow-none transition-shadow",
                  plan.highlighted
                    ? "ring-primary/25 shadow-md ring-2"
                    : "ring-border ring-1",
                )}
              >
                {plan.highlighted ? (
                  <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2">
                    <Badge className="rounded-full px-3 shadow-sm">
                      Most popular
                    </Badge>
                  </div>
                ) : null}
                <CardHeader className="gap-2 pb-2 pt-9">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground line-clamp-3 min-h-18 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-0.5 pt-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground pb-1 text-lg font-medium">
                      {isYearly ? "/yr" : "/mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-6">
                  <Separator className="mb-6" />
                  <ul className="text-muted-foreground space-y-2.5 text-sm">
                    {plan.featureBullets.map((line) => (
                      <li key={line} className="flex gap-2">
                        <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto border-t-0 bg-transparent p-4 pt-0">
                  <PlanPurchaseCtaButton
                    className="w-full rounded-lg"
                    label={plan.cta}
                    action={plan.purchaseAction}
                    isYearly={isYearly}
                    variant={plan.highlighted ? "default" : "outline"}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </SectionScrollReveal>

      <SectionScrollReveal
        intensity="subtle"
        className="bg-muted/30 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              data-reveal
              className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            >
              Compare plans in detail
            </h2>
            <p
              data-reveal
              className="text-muted-foreground mt-3 text-sm sm:text-base"
            >
              {useDb
                ? "Feature checklist is built from your current plan definitions."
                : "Same numbers as above—laid out feature by feature so procurement and your team can decide quickly."}
            </p>
          </div>

          <div
            data-reveal
            className="border-border mt-10 overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground min-w-[10rem] pl-4 sm:pl-6">
                    Feature
                  </TableHead>
                  {cards.map((plan, colIndex) => (
                    <TableHead
                      key={plan.id}
                      className={cn(
                        "text-foreground text-center",
                        colIndex === popularIndex && popularIndex >= 0
                          ? "bg-primary/5"
                          : "",
                      )}
                    >
                      {plan.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrixRows && matrixRows.length > 0
                  ? matrixRows.map((row) => (
                      <TableRow key={row.feature} className="border-border">
                        <TableCell className="text-foreground max-w-[14rem] pl-4 font-medium whitespace-normal sm:pl-6">
                          {row.feature}
                        </TableCell>
                        {row.included.map((inc, colIndex) => (
                          <TableCell
                            key={`${row.feature}-${colIndex}`}
                            className={cn(
                              "text-center",
                              colIndex === popularIndex && popularIndex >= 0
                                ? "bg-primary/5"
                                : "",
                            )}
                          >
                            <ComparisonCell value={inc} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : STATIC_COMPARISON.map((row) => (
                      <TableRow key={row.feature} className="border-border">
                        <TableCell className="text-foreground max-w-[14rem] pl-4 font-medium whitespace-normal sm:pl-6">
                          {row.feature}
                        </TableCell>
                        <TableCell className="text-center">
                          <ComparisonCell value={row.starter} />
                        </TableCell>
                        <TableCell className="bg-primary/5 text-center">
                          <ComparisonCell value={row.team} />
                        </TableCell>
                        <TableCell className="text-center">
                          <ComparisonCell value={row.enterprise} />
                        </TableCell>
                      </TableRow>
                    ))}
                {useDb && matrixRows?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={cards.length + 1}
                      className="text-muted-foreground py-10 text-center text-sm"
                    >
                      Add feature lines to each plan in the admin to show a
                      comparison matrix.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <p
            data-reveal
            className="text-muted-foreground mx-auto mt-8 max-w-xl text-center text-xs sm:text-sm"
          >
            {useDb
              ? "Prices and features come from your catalog. "
              : "Prices shown are illustrative. "}
            Need a quote or a pilot?{" "}
            <Link
              href="/contact"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </SectionScrollReveal>
    </>
  );
}
