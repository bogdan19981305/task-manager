"use client";

import {
  AtSign,
  Bell,
  CreditCard,
  Inbox,
  ListTodo,
  Settings2,
} from "lucide-react";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type NotifKind = "mention" | "task" | "billing";

const MOCK_ITEMS: {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
}[] = [
  {
    id: "n1",
    kind: "mention",
    title: "Anna mentioned you",
    body: "On “Payment integration” — can you review the webhook payload?",
    time: "12 min ago",
    read: false,
  },
  {
    id: "n2",
    kind: "task",
    title: "Task assigned",
    body: "“API documentation” was assigned to you by Max.",
    time: "1 h ago",
    read: false,
  },
  {
    id: "n3",
    kind: "billing",
    title: "Invoice paid",
    body: "Receipt for $29.00 — Pro plan renewal.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    kind: "task",
    title: "Due soon",
    body: "3 tasks due today across Product and Billing.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    kind: "mention",
    title: "Comment thread",
    body: "Design left feedback on “Onboarding redesign”.",
    time: "Apr 2, 2026",
    read: true,
  },
];

const kindMeta: Record<
  NotifKind,
  { icon: typeof Bell; label: string; accent: string }
> = {
  mention: {
    icon: AtSign,
    label: "Mention",
    accent: "bg-chart-4/15 text-chart-4 ring-chart-4/20",
  },
  task: {
    icon: ListTodo,
    label: "Task",
    accent: "bg-chart-1/15 text-chart-1 ring-chart-1/20",
  },
  billing: {
    icon: CreditCard,
    label: "Billing",
    accent: "bg-chart-3/15 text-chart-3 ring-chart-3/20",
  },
};

function NotificationList({ items }: { items: typeof MOCK_ITEMS }) {
  if (items.length === 0) {
    return (
      <li className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
        Nothing here for this filter.
      </li>
    );
  }
  return (
    <>
      {items.map((n) => {
        const meta = kindMeta[n.kind];
        const Icon = meta.icon;
        return (
          <li key={n.id}>
            <button
              type="button"
              disabled
              className={cn(
                "flex w-full gap-4 rounded-xl border p-4 text-left transition-colors",
                n.read
                  ? "bg-card hover:bg-muted/30"
                  : "border-primary/25 bg-primary/5 hover:bg-primary/10",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                  meta.accent,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium leading-snug">{n.title}</p>
                  {!n.read ? (
                    <span className="size-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {meta.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {n.time}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");

  const unreadCount = MOCK_ITEMS.filter((n) => !n.read).length;
  const mentionCount = MOCK_ITEMS.filter((n) => n.kind === "mention").length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Inbox className="size-4 shrink-0" aria-hidden />
            <span className="text-sm">Inbox</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Notifications
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Center for mentions, tasks, and billing events — mock feed; hook to
            real-time or polling later.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" disabled className="gap-2">
            <Settings2 className="size-4" aria-hidden />
            Preferences
          </Button>
          <Button size="sm" disabled>
            Mark all read
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Your feed</CardTitle>
              <CardDescription>Filter by tab (client-side demo)</CardDescription>
            </div>
            <Badge variant="secondary" className="tabular-nums">
              {unreadCount} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="line" className="mb-4 w-full justify-start sm:w-auto">
              <TabsTrigger value="all" className="gap-1.5">
                All
                <span className="text-muted-foreground tabular-nums">
                  ({MOCK_ITEMS.length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-1.5">
                Unread
                <span className="text-muted-foreground tabular-nums">
                  ({unreadCount})
                </span>
              </TabsTrigger>
              <TabsTrigger value="mentions" className="gap-1.5">
                Mentions
                <span className="text-muted-foreground tabular-nums">
                  ({mentionCount})
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <ul className="grid gap-2">
                <NotificationList items={MOCK_ITEMS} />
              </ul>
            </TabsContent>
            <TabsContent value="unread" className="mt-0">
              <ul className="grid gap-2">
                <NotificationList
                  items={MOCK_ITEMS.filter((n) => !n.read)}
                />
              </ul>
            </TabsContent>
            <TabsContent value="mentions" className="mt-0">
              <ul className="grid gap-2">
                <NotificationList
                  items={MOCK_ITEMS.filter((n) => n.kind === "mention")}
                />
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t text-xs text-muted-foreground">
          Push, email digests, and per-workspace muting are common extensions of
          this screen.
        </CardFooter>
      </Card>
    </div>
  );
}
