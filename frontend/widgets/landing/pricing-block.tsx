"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

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
import { cn } from "@/lib/utils";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface PricingBlockProps {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
  className?: string;
}

const PricingBlock = ({
  heading = "Pricing that fits your workflow",
  description = "One dashboard for tasks and deadlines. Pick a plan for your team size. Change or cancel anytime.",
  plans = [
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
      button: {
        text: "Get started",
        url: "/auth/sign-up",
      },
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
      button: {
        text: "Get started",
        url: "/auth/sign-up",
      },
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
      button: {
        text: "Contact sales",
        url: "/contact",
      },
    },
  ],
  className,
}: PricingBlockProps) => {
  const [isYearly, setIsYearly] = useState(false);
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
          <div
            data-reveal
            className="flex items-center gap-3 text-lg"
          >
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
                className="flex w-80 flex-col justify-between text-left"
              >
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-semibold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {isYearly ? "/yr" : "/mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "team" && (
                    <p className="mb-3 font-semibold">
                      Everything in Starter, and:
                    </p>
                  )}
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
                  <Button asChild className="w-full">
                    <a href={plan.button.url} target="_blank">
                      {plan.button.text}
                    </a>
                  </Button>
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
