import { Suspense } from "react";

import { fetchPublicPlans } from "@/shared/lib/plans-api";
import BlogSection, {
  BlogSectionSkeleton,
} from "@/widgets/landing/blog-section";
import BuiltWithSection from "@/widgets/landing/built-with-section";
import EverythingNeedSection from "@/widgets/landing/everything-need-section";
import FaqSection from "@/widgets/landing/faq-section";
import HeroSection from "@/widgets/landing/hero-section";
import PricingBlock from "@/widgets/landing/pricing-block";
import SocialProofSection from "@/widgets/landing/social-proof-section";

const PublicPage = async () => {
  const plans = await fetchPublicPlans();

  return (
    <main className="flex flex-col">
      <HeroSection />
      <BuiltWithSection />
      <EverythingNeedSection />
      <SocialProofSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSection />
      </Suspense>
      <PricingBlock dbPlans={plans} />
      <FaqSection />
    </main>
  );
};

export default PublicPage;
