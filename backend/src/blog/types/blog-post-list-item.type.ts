export type BlogPostListItem = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    email: string | null;
    name: string | null;
  };
};
