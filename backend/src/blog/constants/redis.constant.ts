import { BlogPostQueryDto } from '../dto/blog-post-query.dto';

export const BLOG_CACHE_PREFIX = 'blog';
export const ALL_BLOG_CACHE_KEY = `${BLOG_CACHE_PREFIX}:*`;

export const BLOG_TTL = 60;

export const GET_BLOG_OVERVIEW_CACHE_KEY = `${BLOG_CACHE_PREFIX}:overview`;

export const GET_BLOG_POSTS_CACHE_KEY = (query: BlogPostQueryDto) =>
  `${BLOG_CACHE_PREFIX}:posts:${JSON.stringify(query)}`;

export const GET_BLOG_POST_BY_SLUG_CACHE_KEY = (slug: string) =>
  `${BLOG_CACHE_PREFIX}:post:${slug}`;
