import Link from "next/link";

import { Button } from "@/components/ui/button";

const BlogPostNotFound = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="text-muted-foreground text-sm font-medium">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Post not found
        </h1>
        <p className="text-muted-foreground mt-3 text-pretty text-sm leading-relaxed">
          This post may have been removed or the link is incorrect.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/blog">Back to blog</Link>
        </Button>
      </div>
    </main>
  );
};

export default BlogPostNotFound;
