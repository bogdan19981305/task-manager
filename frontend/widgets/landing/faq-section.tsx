"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const FAQ_ITEMS = [
  {
    id: "what-is",
    question: "What is this dashboard for?",
    answer:
      "It brings tasks, deadlines, and owners into one board so your team sees what is urgent, in progress, and done—without chasing updates across chats and spreadsheets.",
  },
  {
    id: "invite",
    question: "How do I add people to my workspace?",
    answer:
      "After you sign up, invite teammates by email from your workspace settings. They get access to the same boards and can be assigned to tasks in a few clicks.",
  },
  {
    id: "devices",
    question: "Does it work on phone and tablet?",
    answer:
      "Yes. The interface is responsive, so you can review and update tasks from a browser on desktop, tablet, or phone.",
  },
  {
    id: "data",
    question: "How is my data handled?",
    answer:
      "We use industry-standard practices for transport and storage. For Enterprise plans we can align with your security and compliance questions—contact sales for details.",
  },
  {
    id: "export",
    question: "Can I export my tasks?",
    answer:
      "Team and Enterprise plans include exports so you can back up or report on work outside the app. Exact formats may evolve—check the in-app help when you upgrade.",
  },
  {
    id: "billing",
    question: "Can I change or cancel my plan?",
    answer:
      "You can switch between monthly and yearly billing and upgrade or downgrade from billing settings. Cancellation stops renewal at the end of the current period.",
  },
] as const;

interface FaqSectionProps {
  className?: string;
}

const FaqSection = ({ className }: FaqSectionProps) => {
  return (
    <SectionScrollReveal
      id="faq"
      intensity="expressive"
      className={cn("bg-background py-16 sm:py-24", className)}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:gap-4">
          <div data-reveal>
            <Badge variant="secondary" className="rounded-full px-3">
              FAQ
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            <span data-reveal className="block">
              Common questions
            </span>
          </h2>
          <p
            data-reveal
            className="text-muted-foreground text-pretty text-sm sm:text-base"
          >
            Quick answers about the task dashboard, teams, and plans. Reach out
            if you need something that is not listed here.
          </p>
        </div>

        <div
          data-reveal
          className="mt-10 w-full sm:mt-14"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-border bg-card px-2 sm:px-4"
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="px-2">
                <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline sm:py-5 sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionScrollReveal>
  );
};

export default FaqSection;
