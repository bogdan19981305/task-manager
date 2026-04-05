"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useMe } from "@/features/auth/queries";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: me, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && (isError || !me)) {
      router.replace("/auth/sign-in");
      return;
    }
    if (!isLoading && me && me.role !== "ADMIN") {
      toast.error("You need administrator access to view this page.");
      router.replace("/dashboard");
    }
  }, [isLoading, isError, me, router]);

  if (isLoading) return null;
  if (!me || me.role !== "ADMIN") return null;

  return <>{children}</>;
}
