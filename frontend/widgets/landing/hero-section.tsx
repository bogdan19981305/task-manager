import { IconSparkles } from "@tabler/icons-react";
import Image from "next/image";

import heroImage from "@/assets/landing/hero.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const HeroSection = () => {
  return (
    <SectionScrollReveal
      start="top 92%"
      className={[
        "flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 bg-background",
        "overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24",
      ].join(" ")}
    >
      <div
        className={
          "mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center " +
          "sm:px-6 lg:px-8"
        }
      >
        <div
          data-reveal
          className={
            "flex w-full max-w-md flex-col items-center gap-2.5 rounded-2xl border " +
            "bg-muted/90 px-4 py-3.5 text-center shadow-sm backdrop-blur-sm " +
            "sm:max-w-none sm:w-auto sm:flex-row sm:gap-3 sm:rounded-full sm:px-3 sm:py-2 " +
            "sm:text-left"
          }
        >
          <Badge className="flex shrink-0 items-center gap-1.5">
            <IconSparkles aria-hidden className="opacity-90" />
            Task dashboard
          </Badge>
          <span className="text-muted-foreground text-sm leading-snug text-balance sm:text-base">
            For teams that care about clarity and deadlines
          </span>
        </div>

        <h1 className="text-2xl leading-tight font-bold text-balance sm:text-3xl sm:leading-[1.29167] md:text-4xl lg:text-5xl">
          <span data-reveal className="block">
            All your tasks in one place.
          </span>
          <span data-reveal className="mt-1 block sm:mt-1.5">
            <span className="relative">Simply</span> plan, delegate, and ship
            work
          </span>
        </h1>

        <p
          data-reveal
          className="text-muted-foreground max-w-2xl text-sm text-balance sm:text-base"
        >
          Bring tasks, deadlines, and priorities together on one screen—without
          chaos in chats and spreadsheets. See what&apos;s urgent, in progress,
          and done.
        </p>

        <div data-reveal>
          <Button size="lg" asChild>
            <a href="/tasks">Open dashboard</a>
          </Button>
        </div>

        <div
          data-reveal
          className={
            "relative mt-10 aspect-16/10 w-full max-w-4xl overflow-hidden rounded-xl " +
            "border border-primary/25 bg-muted/30 shadow-[0_0_40px_-12px] shadow-primary/35 " +
            "ring-1 ring-primary/20"
          }
        >
          <Image
            src={heroImage}
            alt="Task management dashboard illustration"
            fill
            className="object-contain p-4"
            priority
          />
          <div
            aria-hidden
            className={
              "pointer-events-none absolute inset-0 rounded-[inherit] " +
              "bg-primary/10 mix-blend-soft-light dark:bg-primary/18 dark:mix-blend-overlay"
            }
          />
        </div>
      </div>
    </SectionScrollReveal>
  );
};

export default HeroSection;
