"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flame,
  ListTodo,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statCards = [
  {
    title: "Completed this week",
    value: "34",
    hint: "+12% vs last week",
    positive: true,
    icon: CheckCircle2,
    accent: "bg-chart-2/15 text-chart-2 ring-chart-2/20",
  },
  {
    title: "In progress",
    value: "18",
    hint: "5 due today",
    positive: null,
    icon: CircleDashed,
    accent: "bg-chart-4/15 text-chart-4 ring-chart-4/20",
  },
  {
    title: "Overdue",
    value: "3",
    hint: "−2 this week",
    positive: true,
    icon: Clock3,
    accent: "bg-destructive/10 text-destructive ring-destructive/20",
  },
  {
    title: "Team online",
    value: "7 / 9",
    hint: "Avg. utilization 68%",
    positive: null,
    icon: Users,
    accent: "bg-chart-1/15 text-chart-1 ring-chart-1/20",
  },
] as const;

const weekActivity = [
  { label: "Mon", value: 42, color: "bg-chart-1" },
  { label: "Tue", value: 58, color: "bg-chart-1" },
  { label: "Wed", value: 35, color: "bg-chart-2" },
  { label: "Thu", value: 71, color: "bg-chart-2" },
  { label: "Fri", value: 49, color: "bg-chart-3" },
  { label: "Sat", value: 22, color: "bg-muted-foreground/40" },
  { label: "Sun", value: 18, color: "bg-muted-foreground/40" },
] as const;

const recentTasks = [
  {
    title: "Onboarding redesign",
    project: "Product",
    status: "In progress" as const,
    due: "Today",
  },
  {
    title: "Payment integration",
    project: "Billing",
    status: "In review" as const,
    due: "Tomorrow",
  },
  {
    title: "Notification fix",
    project: "Mobile",
    status: "Done" as const,
    due: "Yesterday",
  },
  {
    title: "API documentation",
    project: "DevEx",
    status: "Backlog" as const,
    due: "Apr 12",
  },
] as const;

const activityFeed = [
  {
    user: "Anna K.",
    action: "closed task",
    target: "QA checklist for v2.4 release",
    time: "12 min ago",
  },
  {
    user: "Max P.",
    action: "commented on",
    target: "Notifications spec",
    time: "1 h ago",
  },
  {
    user: "System",
    action: "reminder:",
    target: "Sprint planning at 3:00 PM",
    time: "2 h ago",
  },
] as const;

const prioritySpotlight = [
  { label: "Blockers", count: 2, emoji: "🧱" },
  { label: "Awaiting review", count: 6, emoji: "👀" },
  { label: "Unassigned", count: 1, emoji: "❔" },
] as const;

function statusBadgeVariant(
  status: (typeof recentTasks)[number]["status"],
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Done":
      return "secondary";
    case "In progress":
      return "default";
    case "In review":
      return "outline";
    default:
      return "outline";
  }
}

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const maxBar = Math.max(...weekActivity.map((d) => d.value));

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            <span className="text-sm capitalize">{today}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Workspace overview
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            A snapshot of tasks and activity — mock data so you can preview the
            UI quickly.
          </p>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link href="/tasks">
            <ListTodo className="size-4" aria-hidden />
            Go to tasks
            <ArrowUpRight className="size-4 opacity-70" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} size="sm" className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-2 border-b pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.title}
                </CardTitle>
                <div className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
                  {s.value}
                </div>
              </div>
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                  s.accent,
                )}
              >
                <s.icon className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <p
                className={cn(
                  "text-xs font-medium",
                  s.positive === true && "text-chart-2",
                  s.positive === null && "text-muted-foreground",
                )}
              >
                {s.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle>Weekly activity</CardTitle>
                <CardDescription>
                  Mock completions and updates by day
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1 font-normal">
                <TrendingUp className="size-3" aria-hidden />
                Peak on Thursday
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className="flex h-44 items-end justify-between gap-2 px-1"
              role="img"
              aria-label="Bar chart of activity by weekday"
            >
              {weekActivity.map((d) => (
                <div
                  key={d.label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-36 w-full max-w-10 flex-col justify-end">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        d.color,
                      )}
                      style={{
                        height: `${Math.max(8, (d.value / maxBar) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Placeholder data — swap for analytics when the API is ready.
          </CardFooter>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-4 text-chart-1" aria-hidden />
              Focus
            </CardTitle>
            <CardDescription>Where to look first</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-4">
            {prioritySpotlight.map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span aria-hidden>{p.emoji}</span>
                  {p.label}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {p.count}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t bg-muted/30">
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-chart-4" />
              Tip: pin the Blockers widget on the team board.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Recent tasks</CardTitle>
            <CardDescription>Mock list for table preview</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <div className="divide-y">
              {recentTasks.map((t) => (
                <div
                  key={t.title}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.project}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge variant={statusBadgeVariant(t.status)}>
                      {t.status}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {t.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href="/tasks">All tasks</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Activity</CardTitle>
            <CardDescription>Latest events (demo)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4">
            {activityFeed.map((item) => (
              <div
                key={`${item.user}-${item.time}`}
                className="relative border-l-2 border-muted pl-4"
              >
                <div className="absolute top-1.5 -left-[5px] size-2 rounded-full bg-primary" />
                <p className="text-sm leading-snug">
                  <span className="font-medium">{item.user}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span className="font-medium">{item.target}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
