"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "./queries";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && isError) {
      const next = encodeURIComponent(pathname ?? "/");
      router.replace(`/auth/sign-in?next=${next}`);
    }
  }, [isLoading, isError, router, pathname]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!data) return null;

  return <>{children}</>;
}
