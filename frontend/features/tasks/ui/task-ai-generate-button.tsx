"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  streamTaskDescription,
  StreamTaskDescriptionError,
} from "../model/stream-task-description";

type TaskAiGenerateButtonProps = {
  visible: boolean;
  title: string;
  setContent: (value: string) => void;
};

export function TaskAiGenerateButton({
  visible,
  title,
  setContent,
}: TaskAiGenerateButtonProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  if (!visible) return null;

  const handleClick = async () => {
    const trimmed = title.trim();
    if (!trimmed || isStreaming) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsStreaming(true);
    setContent("");

    try {
      await streamTaskDescription(
        trimmed,
        (text) => {
          setContent(text);
        },
        { signal: ac.signal },
      );
      toast.success("Description generated");
    } catch (e) {
      if (e instanceof StreamTaskDescriptionError) {
        if (e.code === "ABORTED") return;
        if (e.code === "FORBIDDEN") {
          toast.error("Only admins can use AI generation");
          return;
        }
        if (e.code === "UNAUTHORIZED") {
          toast.error("Session expired — sign in again");
          return;
        }
      }
      toast.error("Could not generate description");
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <div
      className={cn(
        "shrink-0",
        "animate-in fade-in slide-in-from-top-2 zoom-in duration-300 ease-out fill-mode-both",
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isStreaming}
        className={cn(
          "relative overflow-hidden border-violet-500/25 bg-linear-to-br from-violet-500/7 via-fuchsia-500/5 to-sky-500/7",
          "hover:border-violet-500/45 hover:from-violet-500/12 hover:via-fuchsia-500/8 hover:to-sky-500/12",
          "shadow-sm hover:shadow-md motion-safe:transition-[box-shadow,background-color,border-color] motion-safe:duration-300",
          "dark:border-violet-400/20 dark:from-violet-400/10 dark:via-fuchsia-400/6 dark:to-sky-400/10",
          "dark:hover:border-violet-400/40",
        )}
        onClick={() => void handleClick()}
      >
        {isStreaming ? (
          <Loader2
            className="size-3.5 animate-spin text-violet-600 dark:text-violet-400"
            aria-hidden
          />
        ) : (
          <Sparkles
            className={cn(
              "size-3.5 text-violet-600 dark:text-violet-400",
              "motion-safe:transition-transform motion-safe:duration-300",
              "group-hover/button:scale-110 motion-reduce:group-hover/button:scale-100",
            )}
            aria-hidden
          />
        )}
        <span
          className={cn(
            "bg-linear-to-r from-violet-600 via-fuchsia-600 to-sky-600 bg-clip-text font-medium text-transparent",
            "dark:from-violet-400 dark:via-fuchsia-400 dark:to-sky-400",
          )}
        >
          {isStreaming ? "Generating…" : "Generate with AI"}
        </span>
      </Button>
    </div>
  );
}
