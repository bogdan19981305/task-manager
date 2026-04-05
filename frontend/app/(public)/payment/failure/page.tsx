import { XCircle } from "lucide-react";
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
  title: "Payment unsuccessful",
  description: "Your payment could not be completed.",
  robots: { index: false, follow: false },
};

const PaymentFailurePage = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="items-center text-center">
            <Badge variant="secondary" className="rounded-full px-3">
              Billing
            </Badge>
            <div className="mt-6 flex justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="size-8" aria-hidden />
              </span>
            </div>
            <CardTitle className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Payment didn&apos;t go through
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              We couldn&apos;t complete the charge. Your card may have been
              declined, the session may have expired, or the payment was
              cancelled. No money was taken for this attempt.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 text-center text-sm text-muted-foreground">
            <p>
              Try again with another card or contact your bank. If the problem
              persists, we&apos;re happy to help via{" "}
              <Link
                href="/contact"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                contact
              </Link>
              .
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button className="w-full rounded-lg sm:w-auto" asChild>
              <Link href="/pricing">Back to pricing</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg sm:w-auto"
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default PaymentFailurePage;
