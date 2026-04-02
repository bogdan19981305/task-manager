import { Suspense } from "react";

import BlogSection, {
  BlogSectionSkeleton,
} from "@/widgets/landing/blog-section";
import BuiltWithSection from "@/widgets/landing/built-with-section";
import EverythingNeedSection from "@/widgets/landing/everything-need-section";
import FaqSection from "@/widgets/landing/faq-section";
import HeroSection from "@/widgets/landing/hero-section";
import PricingBlock from "@/widgets/landing/pricing-block";
import SocialProofSection from "@/widgets/landing/social-proof-section";

const PublicPage = () => {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <BuiltWithSection />
      <EverythingNeedSection />
      <SocialProofSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSection />
      </Suspense>
      <PricingBlock />
      <FaqSection />
    </main>
  );
};

export default PublicPage;
