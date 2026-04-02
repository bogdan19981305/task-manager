import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  blogAuthorLabel,
  fetchBlogPostsPreview,
  formatBlogDate,
} from "@/shared/lib/blog-api";
import { SectionScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

export type { BlogPostListItem as BlogPostPreview } from "@/shared/lib/blog-api";

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

export function BlogSectionSkeleton() {
  return (
    <section className="bg-background py-8 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="mx-auto h-6 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto h-10 w-3/4 max-w-md animate-pulse rounded-md bg-muted" />
          <div className="mx-auto h-16 w-full animate-pulse rounded-md bg-muted" />
        </div>
        <Card className="mt-10 overflow-hidden rounded-2xl p-0 shadow-none ring-1 ring-border md:mt-14">
          <div className="flex flex-col md:flex-row md:items-stretch">
            <div className="min-h-[200px] w-full shrink-0 animate-pulse bg-muted md:min-h-[260px] md:w-[min(42%,320px)]" />
            <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="h-8 w-full animate-pulse rounded bg-muted" />
              <div className="h-20 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default async function BlogSection() {
  const posts = await fetchBlogPostsPreview(3);
  const [featured, ...rest] = posts;

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

        {featured ? (
          <>
            <Card
              data-reveal
              className="mt-10 overflow-hidden rounded-2xl p-0 shadow-none ring-1 ring-border md:mt-14"
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                <PostThumbnailPlaceholder className="w-full shrink-0 md:w-[min(42%,320px)] md:rounded-none" />
                <div className="flex flex-col justify-center gap-4 p-6 text-left sm:p-8 md:flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="rounded-md font-normal">
                      Blog
                    </Badge>
                    <span className="hidden sm:inline" aria-hidden>
                      ·
                    </span>
                    <span>{blogAuthorLabel(featured.author)}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={featured.createdAt}>
                      {formatBlogDate(featured.createdAt)}
                    </time>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty text-sm leading-relaxed sm:text-base">
                    {featured.excerpt?.trim() ||
                      "Read the full post for more details."}
                  </p>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Read more
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </Card>

            {rest.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {rest.map((post) => (
                  <Card
                    key={post.id}
                    data-reveal
                    className="flex flex-col gap-3 rounded-2xl p-6 shadow-none ring-1 ring-border"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="rounded-md text-xs font-normal"
                      >
                        Blog
                      </Badge>
                      <span aria-hidden>·</span>
                      <span>{blogAuthorLabel(post.author)}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.createdAt}>
                        {formatBlogDate(post.createdAt)}
                      </time>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-balance">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 text-pretty text-sm leading-relaxed">
                      {post.excerpt?.trim() ||
                        "Read the full post for more details."}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                    >
                      Read more
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Card>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p
            data-reveal
            className="text-muted-foreground mt-10 text-center text-sm md:mt-14"
          >
            No published posts yet—check back soon.
          </p>
        )}
      </div>
    </SectionScrollReveal>
  );
}
