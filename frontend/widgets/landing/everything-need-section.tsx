import {
  Accessibility,
  Languages,
  MonitorSmartphone,
  Palette,
  Rocket,
  SquarePen,
  SunMoon,
  Zap,
} from "lucide-react";

import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const FEATURES = [
  {
    icon: Accessibility,
    title: "Accessible dashboard",
    description:
      "Keyboard navigation and assistive tech support so everyone can manage tasks.",
  },
  {
    icon: MonitorSmartphone,
    title: "Board on any device",
    description:
      "Plan and review tasks on desktop, tablet, or phone without losing context.",
  },
  {
    icon: SunMoon,
    title: "Light and dark mode",
    description:
      "Comfortable themes for long planning sessions or late-night standups.",
  },
  {
    icon: Palette,
    title: "Your view, your rules",
    description:
      "Filters, statuses, and priorities tuned to how your team actually works.",
  },
  {
    icon: Zap,
    title: "Snappy and smooth",
    description:
      "Lists and updates stay fast as your backlog grows—no sluggish board.",
  },
  {
    icon: Rocket,
    title: "Ready for real work",
    description:
      "Built for daily use: deadlines, handoffs, and real teams—not toy demos.",
  },
  {
    icon: Languages,
    title: "Teams everywhere",
    description:
      "Interface ready for multiple languages so distributed teams stay aligned.",
  },
  {
    icon: SquarePen,
    title: "Tasks with context",
    description:
      "Deadlines, assignees, and notes in one place—edit without leaving the dashboard.",
  },
] as const;

const EverythingNeedSection = () => {
  return (
    <SectionScrollReveal
      intensity="expressive"
      className="w-full bg-black py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:mb-16 sm:text-4xl md:text-5xl">
          <span data-reveal className="block">
            Everything you need to run tasks.
          </span>
          <span data-reveal className="mt-1 block">
            Nothing in the way.
          </span>
        </h2>

        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} data-reveal className="flex gap-3">
              <div className="shrink-0 pt-0.5">
                <Icon
                  aria-hidden
                  className="size-6 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold leading-snug">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionScrollReveal>
  );
};

export default EverythingNeedSection;
