"use client";

import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

type Cell = boolean | string;

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "For solo builders and small teams getting organized",
    monthlyPrice: "$19",
    yearlyPrice: "$179",
    href: "/auth/sign-up",
    cta: "Get started",
    highlighted: false,
  },
  {
    id: "team",
    name: "Team",
    description: "For teams that ship together every week",
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    href: "/auth/sign-up",
    cta: "Get started",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Security, scale, and support for whole organizations",
    monthlyPrice: "$99",
    yearlyPrice: "$899",
    href: "/contact",
    cta: "Contact sales",
    highlighted: false,
  },
] as const;

const COMPARISON: {
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
          className="size-4 text-primary"
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
          className="size-4 text-muted-foreground/70"
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

export function PricingComparison() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      <SectionScrollReveal
        intensity="subtle"
        className="border-b border-border bg-background py-12 sm:py-16"
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
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                data-reveal
                className={cn(
                  "relative flex h-full flex-col text-left shadow-none transition-shadow",
                  plan.highlighted
                    ? "ring-2 ring-primary/25 shadow-md"
                    : "ring-1 ring-border",
                )}
              >
                {plan.id === "team" ? (
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
                    {plan.id === "starter" && (
                      <>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Up to 5 teammates</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Unlimited tasks and priorities</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Community support</span>
                        </li>
                      </>
                    )}
                    {plan.id === "team" && (
                      <>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Everything in Starter</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Unlimited members</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Priority support</span>
                        </li>
                      </>
                    )}
                    {plan.id === "enterprise" && (
                      <>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Everything in Team</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>SSO and audit-friendly controls</span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                          <span>Custom SLA and onboarding</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto border-t-0 bg-transparent p-4 pt-0">
                  <Button
                    asChild
                    className="w-full rounded-lg"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
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
              Same numbers as above—laid out feature by feature so procurement
              and your team can decide quickly.
            </p>
          </div>

          <div
            data-reveal
            className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground min-w-[10rem] pl-4 sm:pl-6">
                    Feature
                  </TableHead>
                  <TableHead className="text-foreground text-center">
                    Starter
                  </TableHead>
                  <TableHead className="text-foreground bg-primary/5 text-center">
                    Team
                  </TableHead>
                  <TableHead className="text-foreground text-center">
                    Enterprise
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
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
              </TableBody>
            </Table>
          </div>

          <p
            data-reveal
            className="text-muted-foreground mx-auto mt-8 max-w-xl text-center text-xs sm:text-sm"
          >
            Prices shown are illustrative. Need a quote or a pilot?{" "}
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
