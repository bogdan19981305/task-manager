import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  blogAuthorLabel,
  fetchBlogPostBySlug,
  formatBlogDate,
} from "@/shared/lib/blog-api";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt?.trim() || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt?.trim() || undefined,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
  };
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-background">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-8" asChild>
          <Link href="/blog">← Back to blog</Link>
        </Button>

        <Badge variant="secondary" className="rounded-full px-3">
          Blog
        </Badge>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span>{blogAuthorLabel(post.author)}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.createdAt}>
            {formatBlogDate(post.createdAt)}
          </time>
        </div>

        {post.excerpt ? (
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed text-pretty">
            {post.excerpt}
          </p>
        ) : null}

        {post.content ? (
          <div
            className="mt-10 max-w-none font-sans text-base leading-relaxed text-foreground"
            data-slot="blog-content"
          >
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        ) : (
          <p className="text-muted-foreground mt-10 text-sm">
            This post has no body yet.
          </p>
        )}
      </article>
    </main>
  );
};

export default BlogPostPage;
