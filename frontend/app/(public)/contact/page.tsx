import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContactForm from "@/widgets/public/contact-form";

const ContactPage = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-16">
          <div>
            <Badge variant="secondary" className="rounded-full px-3">
              Contact
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Let&apos;s talk
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed text-pretty">
              Questions about the product, billing, or security? Send us a
              message—we read every note and reply by email.
            </p>

            <div className="mt-10 space-y-6 text-sm sm:text-base">
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-muted-foreground mt-1">
                  <a
                    href="mailto:hello@example.com"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    hello@example.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Response time</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  We aim to respond within one to two business days. For urgent
                  production issues, mention it in the subject line.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/about">About us</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>

          <ContactForm className="lg:sticky lg:top-24" />
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
