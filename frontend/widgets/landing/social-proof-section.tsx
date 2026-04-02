import Image from "next/image";

import SocialProofImage from "@/assets/landing/social-proof-1.webp";
import SocialProofImageDark from "@/assets/landing/social-proof-dark.webp";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const SocialProofSection = () => {
  return (
    <SectionScrollReveal
      intensity="expressive"
      className="bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-20 max-lg:flex-col">
          <div>
            <div className="space-y-4">
              <p
                data-reveal
                className="text-primary text-sm font-medium uppercase"
              >
                Social Proof
              </p>
              <h2
                data-reveal
                className="text-2xl font-semibold md:text-3xl lg:text-4xl"
              >
                Create Impactful White Label Reports
              </h2>
              <p data-reveal className="text-muted-foreground text-lg">
                Craft customizable reports that showcase your campaign&apos;s
                success, align with your brand, and simplify sharing insights
                with stakeholders while enabling data export and ROI analysis.
              </p>
            </div>
          </div>

          <div data-reveal className="shrink-0">
            <Image
              src={SocialProofImage}
              alt="Social Proof Image"
              className="w-142 object-contain dark:hidden"
            />
            <Image
              src={SocialProofImageDark}
              alt="Social Proof Image Dark"
              className="hidden w-142 object-contain dark:inline-block"
            />
          </div>
        </div>
      </div>
    </SectionScrollReveal>
  );
};

export default SocialProofSection;
