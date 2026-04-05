import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your payment was completed successfully.",
  robots: { index: false, follow: false },
};

const PaymentSuccessPage = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="items-center text-center">
            <Badge variant="secondary" className="rounded-full px-3">
              Billing
            </Badge>
            <div className="mt-6 flex justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-8" aria-hidden />
              </span>
            </div>
            <CardTitle className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Payment successful
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Thank you. Your payment went through and your plan will update
              shortly. If anything looks off, check your email for a receipt or
              reach out to support.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 text-center text-sm text-muted-foreground">
            <p>
              You can continue in the app while we finish syncing your
              subscription.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button className="w-full rounded-lg sm:w-auto" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg sm:w-auto"
              asChild
            >
              <Link href="/pricing">View plans</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
