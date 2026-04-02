"use client";

import gsap from "gsap";
import Image, { type StaticImageData } from "next/image";
import { useLayoutEffect, useRef } from "react";

import NextLogo from "@/assets/logo/nextjs.svg";
import NodejsLogo from "@/assets/logo/nodejs.svg";
import PrismaLogo from "@/assets/logo/prisma.svg";
import ReactLogo from "@/assets/logo/react-logo.svg";
import RedisLogo from "@/assets/logo/redis.svg";
import TailwindLogo from "@/assets/logo/tailwind.svg";
import TypescriptLogo from "@/assets/logo/typescript.svg";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

type LogoItem = {
  src: StaticImageData;
  label: string;
  alt: string;
  imgClassName?: string;
};

const LOGOS: LogoItem[] = [
  { src: ReactLogo, label: "React", alt: "React" },
  {
    src: NextLogo,
    label: "Next.js",
    alt: "Next.js",
    imgClassName: "dark:invert",
  },
  { src: TypescriptLogo, label: "TypeScript", alt: "TypeScript" },
  { src: TailwindLogo, label: "Tailwind CSS", alt: "Tailwind CSS" },
  { src: NodejsLogo, label: "Node.js", alt: "Node.js" },
  { src: RedisLogo, label: "Redis", alt: "Redis" },
  { src: PrismaLogo, label: "Prisma", alt: "Prisma" },
];

const LogoMarquee = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-2">
      <div
        ref={trackRef}
        className="flex w-max flex-row flex-nowrap items-center gap-6 md:gap-10"
      >
        {[0, 1].flatMap((copyIndex) =>
          LOGOS.map((logo, i) => (
            <div
              key={`${copyIndex}-${logo.label}-${i}`}
              className="flex shrink-0 items-center gap-3 px-5 py-3"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={44}
                height={44}
                className={["shrink-0", logo.imgClassName]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span className="text-base font-medium whitespace-nowrap md:text-lg">
                {logo.label}
              </span>
            </div>
          )),
        )}
      </div>
    </div>
  );
};

const BuiltWithSection = () => {
  return (
    <SectionScrollReveal
      intensity="expressive"
      className="w-full bg-background py-12 sm:py-16"
    >
      <div className="mx-auto mb-8 flex max-w-xl flex-col gap-2 px-4 text-center">
        <h2 data-reveal className="text-2xl font-bold tracking-tight">
          Built with
        </h2>
        <p
          data-reveal
          className="text-muted-foreground text-pretty text-sm sm:text-base"
        >
          We use the latest and greatest technologies to power our app.
        </p>
      </div>

      <div data-reveal className="w-full">
        <LogoMarquee />
      </div>
    </SectionScrollReveal>
  );
};

export default BuiltWithSection;
