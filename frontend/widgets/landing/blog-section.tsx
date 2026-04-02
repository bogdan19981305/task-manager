import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const PLACEHOLDER_POSTS = [
  {
    slug: "getting-started-task-dashboard",
    category: "Tutorial",
    author: "Sarah Chen",
    date: "1 Jan 2026",
    title: "Getting started with your task dashboard",
    excerpt:
      "Learn how to set up boards, priorities, and deadlines so your team sees one clear picture of work in progress—without living in chat threads and spreadsheets.",
    href: "/blog",
  },
] as const;

function PostThumbnailPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] items-center justify-center bg-muted md:min-h-[260px]",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 120 120"
        className="size-24 text-foreground/80 md:size-28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 20L95 40V80L60 100L25 80V40L60 20Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M25 40L60 60L95 40M60 60V100"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M60 60L40 72V52L60 40L80 52V72L60 60Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

const BlogSection = () => {
  const [post] = PLACEHOLDER_POSTS;

  return (
    <SectionScrollReveal
      intensity="expressive"
      className="bg-background py-8 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:gap-4">
          <div data-reveal>
            <Badge variant="secondary" className="rounded-full px-3">
              Latest updates
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            <span data-reveal className="block">
              Blog posts
            </span>
          </h2>
          <p
            data-reveal
            className="text-muted-foreground text-pretty text-sm sm:text-base"
          >
            Ideas on running tasks, deadlines, and team workflows—from how we
            build the dashboard to habits that keep delivery predictable.
          </p>
        </div>

        <Card
          data-reveal
          className="mt-10 overflow-hidden rounded-2xl p-0 shadow-none ring-1 ring-border md:mt-14"
        >
          <div className="flex flex-col md:flex-row md:items-stretch">
            <PostThumbnailPlaceholder className="w-full shrink-0 md:w-[min(42%,320px)] md:rounded-none" />
            <div className="flex flex-col justify-center gap-4 p-6 text-left sm:p-8 md:flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="rounded-md font-normal">
                  {post.category}
                </Badge>
                <span className="hidden sm:inline" aria-hidden>
                  ·
                </span>
                <span>{post.author}</span>
                <span aria-hidden>·</span>
                <time dateTime="2026-01-01">{post.date}</time>
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-pretty text-sm leading-relaxed sm:text-base">
                {post.excerpt}
              </p>
              <Link
                href={post.href}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                Read more
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </SectionScrollReveal>
  );
};

export default BlogSection;
