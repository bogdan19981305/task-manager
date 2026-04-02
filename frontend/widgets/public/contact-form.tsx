"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z
    .string()
    .min(20, "Tell us a bit more (at least 20 characters)")
    .max(4000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const TOAST_DURATION_MS = 5000;

type ContactFormProps = {
  className?: string;
  idPrefix?: string;
  variant?: "default" | "footer";
};

const ContactForm = ({
  className,
  idPrefix = "",
  variant = "default",
}: ContactFormProps) => {
  const idBase = idPrefix ? `${idPrefix}contact` : "contact";
  const nameId = `${idBase}-name`;
  const emailId = `${idBase}-email`;
  const messageId = `${idBase}-message`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (_data: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 450));
    toast.success("Message sent", {
      description:
        "Thanks for reaching out. We’ll read your note and reply by email.",
      duration: TOAST_DURATION_MS,
    });
    reset();
  };

  const isFooter = variant === "footer";

  return (
    <Card
      className={cn(
        "shadow-none ring-1",
        isFooter
          ? "border-zinc-800 bg-zinc-950 text-zinc-50 ring-zinc-800 [&_[data-slot=field-label]]:text-zinc-200"
          : "ring-border",
        className,
      )}
    >
      <CardHeader className={cn(isFooter && "space-y-1.5 pb-4")}>
        <CardTitle className={cn(isFooter && "text-lg text-zinc-50")}>
          {isFooter ? "Send us a message" : "Send a message"}
        </CardTitle>
        <CardDescription className={cn(isFooter && "text-sm text-zinc-400")}>
          {isFooter
            ? "Questions or feedback? We read every note."
            : "Share what you need—product questions, partnerships, or support."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={nameId}>Name</FieldLabel>
              <Input
                id={nameId}
                autoComplete="name"
                aria-invalid={!!errors.name}
                placeholder="Jane Doe"
                className={cn(
                  isFooter &&
                    "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600",
                )}
                {...register("name")}
              />
              {errors.name ? <FieldError errors={[errors.name]} /> : null}
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor={emailId}>Email</FieldLabel>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                placeholder="you@company.com"
                className={cn(
                  isFooter &&
                    "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600",
                )}
                {...register("email")}
              />
              {errors.email ? <FieldError errors={[errors.email]} /> : null}
            </Field>
            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor={messageId}>Message</FieldLabel>
              <Textarea
                id={messageId}
                rows={isFooter ? 4 : 6}
                aria-invalid={!!errors.message}
                placeholder="How can we help?"
                className={cn(
                  isFooter &&
                    "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600",
                )}
                {...register("message")}
              />
              {errors.message ? <FieldError errors={[errors.message]} /> : null}
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className={cn(
              "mt-6 w-full sm:w-auto",
              isFooter && "bg-white text-black hover:bg-zinc-200",
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
