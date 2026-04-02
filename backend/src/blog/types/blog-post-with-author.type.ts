import type { Prisma } from 'src/generated/prisma/client';

import type { BLOG_POST_AUTHOR_INCLUDE } from '../constants/blog-post-include.constant';

export type BlogPostWithAuthor = Prisma.BlogPostGetPayload<{
  include: typeof BLOG_POST_AUTHOR_INCLUDE;
}>;
