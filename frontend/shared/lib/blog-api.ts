import axios from "axios";
import { unstable_cache } from "next/cache";

import { api } from "@/shared/api/api-client";
import { API_PATHS } from "@/shared/api/paths";
import type {
  BlogPostAuthor,
  BlogPostDetail,
  BlogPostListItem,
} from "@/shared/types/blog";
import type { PaginatedResponse } from "@/shared/types/pagination";

export type { BlogPostAuthor, BlogPostDetail, BlogPostListItem };

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
  return unstable_cache(
    async () => {
      try {
        const { data } = await api.get<PaginatedResponse<BlogPostListItem>>(
          API_PATHS.blog.posts,
          { params: { page, limit } },
        );
        return data;
      } catch {
        return null;
      }
    },
    ["blog-posts-page", String(page), String(limit)],
    { revalidate: FETCH_REVALIDATE },
  )();
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  return unstable_cache(
    async () => {
      try {
        const { data } = await api.get<BlogPostDetail>(
          API_PATHS.blog.postBySlug(slug),
        );
        return data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          return null;
        }
        return null;
      }
    },
    ["blog-post-detail", slug],
    { revalidate: FETCH_REVALIDATE },
  )();
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

export function blogAuthorLabel(author: BlogPostAuthor): string {
  return author.name?.trim() || author.email?.trim() || "Team";
}
