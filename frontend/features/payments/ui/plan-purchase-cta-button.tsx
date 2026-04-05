"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMe } from "@/features/auth/queries";
import { useCreateCheckoutSession } from "@/features/payments/model/use-create-checkout-session";
import { cn } from "@/lib/utils";
import type { PlanPurchaseAction } from "@/shared/lib/plans-display";

type PlanPurchaseCtaButtonProps = {
  label: string;
  action: PlanPurchaseAction;
  isYearly: boolean;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
};

function resolveCheckoutPlanId(
  action: Extract<PlanPurchaseAction, { kind: "checkout" }>,
  isYearly: boolean,
): number | null {
  if (isYearly) {
    return action.yearPlanId ?? action.monthPlanId ?? null;
  }
  return action.monthPlanId ?? action.yearPlanId ?? null;
}

export function PlanPurchaseCtaButton({
  label,
  action,
  isYearly,
  className,
  variant = "default",
}: PlanPurchaseCtaButtonProps) {
  const pathname = usePathname();
  const { data: me, isLoading: meLoading } = useMe();
  const { mutate: startCheckout, isPending: checkoutPending } =
    useCreateCheckoutSession();

  const returnPath = pathname || "/";
  const signInWithRedirect = `/auth/sign-in?redirect=${encodeURIComponent(returnPath)}`;

  if (action.kind === "link") {
    const href =
      action.href === "/auth/sign-in" ? signInWithRedirect : action.href;
    return (
      <Button asChild className={cn(className)} variant={variant}>
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  const planId = resolveCheckoutPlanId(action, isYearly);

  if (planId == null) {
    return (
      <Button asChild className={cn(className)} variant={variant}>
        <Link href={signInWithRedirect}>{label}</Link>
      </Button>
    );
  }

  if (meLoading) {
    return (
      <Button className={cn(className)} disabled variant={variant}>
        <Spinner />
        {label}
      </Button>
    );
  }

  if (!me) {
    return (
      <Button asChild className={cn(className)} variant={variant}>
        <Link href={signInWithRedirect}>{label}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn(className)}
      disabled={checkoutPending}
      variant={variant}
      type="button"
      onClick={() => startCheckout(planId)}
    >
      {checkoutPending ? <Spinner /> : null}
      {label}
    </Button>
  );
}
