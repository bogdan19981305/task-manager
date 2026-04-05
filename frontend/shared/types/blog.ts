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
