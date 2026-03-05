"use client";

import { useMe } from "@/features/auth/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
