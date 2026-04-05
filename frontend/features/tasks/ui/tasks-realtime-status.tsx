"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { TasksSocketConnectionStatus } from "../model/use-tasks-realtime";

const MESSAGES: Record<
  Exclude<TasksSocketConnectionStatus, "idle">,
  { label: string; hint: string }
> = {
  connecting: {
    label: "Connecting…",
    hint: "Establishing a live connection for task updates.",
  },
  reconnecting: {
    label: "Reconnecting…",
    hint: "Connection dropped; trying again automatically.",
  },
  connected: {
    label: "Live",
    hint: "You receive task create, update, and delete events in real time.",
  },
  disconnected: {
    label: "Offline",
    hint: "Live updates are off. Refresh the page or check your network.",
  },
  unavailable: {
    label: "Unavailable",
    hint: "Could not start live updates (session or network). Tasks still load over HTTP.",
  },
};

type TasksRealtimeStatusProps = {
  status: TasksSocketConnectionStatus;
};

export function TasksRealtimeStatus({ status }: TasksRealtimeStatusProps) {
  if (status === "idle") return null;

  const meta = MESSAGES[status];
  const isLive = status === "connected";
  const isPending = status === "connecting" || status === "reconnecting";
  const isError =
    status === "disconnected" || status === "unavailable";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight transition-colors",
              "border-border/70 bg-card/80 backdrop-blur-sm shadow-sm",
              isLive && "border-emerald-500/25 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
              isPending && "border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300",
              isError && "border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400",
            )}
            role="status"
            aria-live="polite"
            aria-label={`Task updates: ${meta.label}`}
          >
            <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
              {isLive ? (
                <>
                  <span
                    className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-500/35 motion-safe:animate-ping"
                    aria-hidden
                  />
                  <span
                    className="relative z-10 block size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.55)]"
                    aria-hidden
                  />
                </>
              ) : (
                <span
                  className={cn(
                    "block size-2 rounded-full",
                    isPending && "bg-amber-500 motion-safe:animate-pulse",
                    isError && "bg-red-500",
                  )}
                  aria-hidden
                />
              )}
            </span>
            <span className="select-none">{meta.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-pretty">
          {meta.hint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
