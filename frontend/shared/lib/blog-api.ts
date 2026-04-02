import type { PaginatedResponse } from "@/shared/api/types";

export const BLOG_API_BASE = process.env.NEXT_PUBLIC_API_URL;

export type BlogPostAuthor = {
  id: number;
  email: string | null;
  name: string | null;
};

export type BlogPostListItem = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  author: BlogPostAuthor;
};

export type BlogPostDetail = BlogPostListItem & {
  content: string | null;
  status: string;
};

const FETCH_REVALIDATE = 60;

export async function fetchBlogPostsPreview(
  limit: number,
): Promise<BlogPostListItem[]> {
  const result = await fetchBlogPostsPage(1, limit);
  return result?.content ?? [];
}

export async function fetchBlogPostsPage(
  page: number,
  limit: number,
): Promise<PaginatedResponse<BlogPostListItem> | null> {
  try {
    const url = new URL("/blog/posts", BLOG_API_BASE);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      next: { revalidate: FETCH_REVALIDATE },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as PaginatedResponse<BlogPostListItem>;
  } catch {
    return null;
  }
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  try {
    const url = `${BLOG_API_BASE}/blog/posts/${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
      next: { revalidate: FETCH_REVALIDATE },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as BlogPostDetail;
  } catch {
    return null;
  }
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

export function blogAuthorLabel(author: BlogPostAuthor): string {
  return author.name?.trim() || author.email?.trim() || "Team";
}
