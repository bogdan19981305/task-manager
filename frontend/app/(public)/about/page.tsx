import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VALUES = [
  {
    title: "Clarity over noise",
    description:
      "Tasks, owners, and deadlines should live in one place—not scattered across chats and spreadsheets.",
  },
  {
    title: "Teams first",
    description:
      "We design for people who coordinate real work: standups, handoffs, and shipping under pressure.",
  },
  {
    title: "Respect for focus",
    description:
      "Fast lists, sensible defaults, and interfaces that stay out of the way when you need to move.",
  },
] as const;

const AboutPage = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Badge variant="secondary" className="rounded-full px-3">
          About
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          A task dashboard for teams who care about deadlines
        </h1>
        <p className="text-muted-foreground mt-5 text-lg leading-relaxed text-pretty">
          We built this product because planning work shouldn&apos;t feel like
          archaeology. You deserve a single board where priorities are obvious,
          ownership is clear, and nothing important slips through the cracks.
        </p>

        <section className="mt-14 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            What we&apos;re building
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A focused workspace for capturing tasks, assigning owners, setting
            due dates, and tracking status—from first idea to done. Whether
            you&apos;re a small crew or a growing org, the goal is the same:
            less context switching, more predictable delivery.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            How we think about product
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-1">
            {VALUES.map((item) => (
              <li key={item.title}>
                <Card className="shadow-none ring-1 ring-border">
                  <CardHeader className="gap-1">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-muted/40 px-6 py-8 sm:px-8">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Want to try it?
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Create an account and open your dashboard in minutes. If you have
            questions first,{" "}
            <Link
              href="/contact"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              contact us
            </Link>
            .
          </p>
          <Button className="mt-6" asChild>
            <Link href="/auth/sign-up">Get started</Link>
          </Button>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
