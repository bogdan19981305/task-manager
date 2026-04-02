"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export type ScrollIntensity = "subtle" | "expressive";

type ScrollRevealBase = {
  y?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string;
  intensity?: ScrollIntensity;
};

type SectionScrollRevealProps = ScrollRevealBase &
  ComponentPropsWithoutRef<"section">;

type FooterScrollRevealProps = ScrollRevealBase &
  ComponentPropsWithoutRef<"footer">;

const SUBTLE = {
  y: 28,
  duration: 1.05,
  stagger: 0.085,
  ease: "power3.out",
  start: "top 88%",
} as const;

const EXPRESSIVE = {
  y: 68,
  duration: 1.42,
  stagger: 0.14,
  ease: "power4.out",
  start: "top 82%",
  scale: 0.94,
  blurPx: 10,
} as const;

export function SectionScrollReveal({
  className,
  children,
  intensity = "subtle",
  y,
  stagger,
  duration,
  ease,
  start,
  ...rest
}: SectionScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const preset = intensity === "expressive" ? EXPRESSIVE : SUBTLE;
    const resolvedY = y ?? preset.y;
    const resolvedDuration = duration ?? preset.duration;
    const resolvedStagger = stagger ?? preset.stagger;
    const resolvedEase = ease ?? preset.ease;
    const resolvedStart = start ?? preset.start;

    const ctx = gsap.context(() => {
      const tween: gsap.TweenVars = {
        opacity: 0,
        y: resolvedY,
        duration: resolvedDuration,
        ease: resolvedEase,
        stagger: resolvedStagger,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: resolvedStart,
          toggleActions: "play none none none",
        },
      };

      if (intensity === "expressive") {
        tween.scale = EXPRESSIVE.scale;
        tween.filter = `blur(${EXPRESSIVE.blurPx}px)`;
      }

      gsap.from(targets, tween);
    }, el);

    return () => {
      ctx.revert();
    };
  }, [duration, ease, intensity, stagger, start, y]);

  return (
    <section ref={ref} className={cn(className)} {...rest}>
      {children}
    </section>
  );
}

export function FooterScrollReveal({
  className,
  children,
  y = 24,
  stagger = 0.08,
  duration = 1,
  ease = "power3.out",
  start = "top 90%",
  ...rest
}: FooterScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [duration, ease, stagger, y, start]);

  return (
    <footer ref={ref} className={cn(className)} {...rest}>
      {children}
    </footer>
  );
}
