"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useMe } from "@/features/auth/queries";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: me, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && (isError || !me)) {
      router.replace("/auth/sign-in");
    }
  }, [isLoading, isError, me, router]);

  if (isLoading) return null;
  if (!me) return null;

  return <>{children}</>;
}
