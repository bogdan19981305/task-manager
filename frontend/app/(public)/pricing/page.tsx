import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingComparison } from "@/widgets/public/pricing-comparison";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Plans for every team size—Starter, Team, and Enterprise. Compare features and choose monthly or yearly billing.",
};

const PricingPage = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-4 pt-14 pb-10 text-center sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
        <Badge variant="secondary" className="rounded-full px-3">
          Pricing
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Plans that scale with your team
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
          One workspace for tasks and deadlines. Pick where you are today—move
          up when you need more seats, history, or support.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/#faq">Read FAQ</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>

      <PricingComparison />

      <section className="border-t border-border bg-background px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/40 px-6 py-8 text-center sm:px-10 sm:py-10">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Not sure which plan fits?
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Start on Starter or Team and upgrade when your board gets busy. For
            compliance, SSO, or custom terms, we&apos;ll walk you through
            Enterprise.
          </p>
          <Button className="mt-6 rounded-lg" asChild>
            <Link href="/auth/sign-up">Create free account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;
