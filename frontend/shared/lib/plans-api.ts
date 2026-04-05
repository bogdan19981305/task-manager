import { API_PATHS } from "@/shared/api/paths";
import { apiUrl } from "@/shared/config/public-env";
import type { PublicPlan } from "@/shared/types/plans";

export type { PublicPlan };

const FETCH_REVALIDATE = 60;

export async function fetchPublicPlans(): Promise<PublicPlan[] | null> {
  try {
    const res = await fetch(apiUrl(API_PATHS.plans.publicList), {
      next: { revalidate: FETCH_REVALIDATE },
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as PublicPlan[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}
