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

type ContactFormProps = {
  className?: string;
};

const ContactForm = ({ className }: ContactFormProps) => {
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
    });
    reset();
  };

  return (
    <Card className={cn("shadow-none ring-1 ring-border", className)}>
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
        <CardDescription>
          Share what you need—product questions, partnerships, or support.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input
                id="contact-name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                placeholder="Jane Doe"
                {...register("name")}
              />
              {errors.name ? (
                <FieldError errors={[errors.name]} />
              ) : null}
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                placeholder="you@company.com"
                {...register("email")}
              />
              {errors.email ? (
                <FieldError errors={[errors.email]} />
              ) : null}
            </Field>
            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                id="contact-message"
                rows={6}
                aria-invalid={!!errors.message}
                placeholder="How can we help?"
                {...register("message")}
              />
              {errors.message ? (
                <FieldError errors={[errors.message]} />
              ) : null}
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="mt-6 w-full sm:w-auto"
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
