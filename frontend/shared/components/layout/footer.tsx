"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FooterScrollReveal } from "@/widgets/landing/animations/scroll-reveal";
import ContactForm from "@/widgets/public/contact-form";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Pricing", href: "/pricing" },
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
  return (
    <FooterScrollReveal
      className={cn("bg-background text-foreground", className)}
    >
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
          className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2 md:items-start md:gap-12"
        >
          <div className="max-w-md">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
              Get in touch
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Same form as on our contact page—name, email, and message—with
              validation. We&apos;ll reply by email.
            </p>
            <Button
              variant="link"
              className="mt-4 h-auto p-0 text-zinc-300 underline-offset-4 hover:text-white"
              asChild
            >
              <Link href="/contact">Full contact page →</Link>
            </Button>
          </div>
          <ContactForm
            idPrefix="footer-"
            variant="footer"
            className="w-full md:max-w-none"
          />
        </div>

        <div data-reveal className="mt-12 border-t border-zinc-800 pt-12">
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
