import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  blogAuthorLabel,
  fetchBlogPostsPage,
  formatBlogDate,
} from "@/shared/lib/blog-api";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on tasks, teams, and the dashboard—workflows, habits, and product updates.",
};

const PAGE_SIZE = 10;

function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(v ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

type BlogIndexPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

const BlogPage = async ({ searchParams }: BlogIndexPageProps) => {
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const data = await fetchBlogPostsPage(page, PAGE_SIZE);
  const posts = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasPrev = page > 1;
  const hasNext = totalPages > 0 && page < totalPages;

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Badge variant="secondary" className="rounded-full px-3">
          Blog
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Blog
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
          Ideas on running tasks, deadlines, and team workflows.
        </p>

        {!data ? (
          <p className="text-muted-foreground mt-12 text-sm">
            Could not load posts. Please try again later.
          </p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">
            No published posts yet. Check back soon.
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-8 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                >
                  <article className="space-y-3 p-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{blogAuthorLabel(post.author)}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.createdAt}>
                        {formatBlogDate(post.createdAt)}
                      </time>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-balance text-foreground">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="text-muted-foreground text-pretty text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <span className="inline-block text-sm font-medium text-foreground underline-offset-4">
                      Read post →
                    </span>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {data && totalPages > 1 ? (
          <nav
            className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8"
            aria-label="Pagination"
          >
            <div className="text-muted-foreground text-sm">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              {hasPrev ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}>
                    Previous
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
              )}
              {hasNext ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blog?page=${page + 1}`}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              )}
            </div>
          </nav>
        ) : null}
      </div>
    </main>
  );
};

export default BlogPage;
