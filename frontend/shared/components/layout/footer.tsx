"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FooterScrollReveal } from "@/widgets/landing/animations/scroll-reveal";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "/contact" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Status", href: "#" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Security", href: "#" },
      { label: "Enterprise", href: "/contact" },
    ],
  },
] as const;

type FooterProps = {
  className?: string;
};

const Footer = ({ className }: FooterProps) => {
  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <FooterScrollReveal className={cn("bg-black text-white", className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div
          data-reveal
          className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-10 text-center sm:px-10 sm:py-12"
        >
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl md:text-4xl">
            Open your dashboard today. Deadlines won&apos;t wait.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm text-pretty sm:text-base">
            Join teams who keep tasks, owners, and priorities on one board—so
            shipping stays predictable.
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-full bg-white px-6 text-black hover:bg-zinc-200"
            asChild
          >
            <Link href="/auth/sign-up" className="gap-2">
              Get started free
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div
          data-reveal
          className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2 md:items-end md:gap-12"
        >
          <div className="max-w-md">
            <h3 className="text-lg font-semibold tracking-tight">
              Stay connected
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
              Subscribe for product updates, tips on running a task board, and
              occasional release notes.
            </p>
          </div>
          <form
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={handleNewsletterSubmit}
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Your email address"
              autoComplete="email"
              className="h-11 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 sm:min-w-0 sm:flex-1"
            />
            <Button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-white px-6 text-black hover:bg-zinc-200 sm:w-auto"
            >
              Subscribe
            </Button>
          </form>
        </div>

        <div
          data-reveal
          className="mt-12 border-t border-zinc-800 pt-12"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold tracking-wide text-zinc-200">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p
          data-reveal
          className="mt-12 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-500"
        >
          © {new Date().getFullYear()} Task dashboard. All rights reserved.
        </p>
      </div>
    </FooterScrollReveal>
  );
};

export default Footer;
