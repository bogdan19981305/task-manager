"use client";

import {
  Calendar,
  Github,
  Mail,
  MessageSquare,
  Plug,
  Webhook,
  Zap,
} from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const MOCK_APPS = [
  {
    id: "slack",
    name: "Slack",
    description: "Post task updates and mentions to channels.",
    icon: MessageSquare,
    status: "connected" as const,
    detail: "Workspace: Acme HQ",
    accent: "bg-[#4A154B]/15 text-[#4A154B] ring-[#4A154B]/20",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link repos, sync issues and pull requests.",
    icon: Github,
    status: "connected" as const,
    detail: "org/acme-product",
    accent: "bg-foreground/10 text-foreground ring-border",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    description: "Show due dates and sprint milestones on your calendar.",
    icon: Calendar,
    status: "available" as const,
    detail: null,
    accent: "bg-chart-3/15 text-chart-3 ring-chart-3/20",
  },
  {
    id: "email",
    name: "Email ingest",
    description: "Create tasks from a dedicated inbox address.",
    icon: Mail,
    status: "available" as const,
    detail: null,
    accent: "bg-chart-1/15 text-chart-1 ring-chart-1/20",
  },
] as const;

const MOCK_WEBHOOKS = [
  {
    id: "wh_1",
    url: "https://api.acme.test/hooks/tasks",
    events: ["task.created", "task.completed"],
    lastDelivery: "Apr 4, 2026 · 200",
    status: "ok" as const,
  },
  {
    id: "wh_2",
    url: "https://staging.partner.io/webhook",
    events: ["comment.added"],
    lastDelivery: "Apr 3, 2026 · 502",
    status: "error" as const,
  },
] as const;

export default function IntegrationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plug className="size-4 shrink-0" aria-hidden />
            <span className="text-sm">Connections</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Integrations
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Third-party apps and outbound webhooks — mock cards and endpoints
            for layout only.
          </p>
        </div>
        <Button variant="outline" size="sm" disabled className="gap-2 shrink-0">
          <Webhook className="size-4" aria-hidden />
          New webhook
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_APPS.map((app) => {
          const Icon = app.icon;
          const connected = app.status === "connected";
          return (
            <Card key={app.id} className="border shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1",
                      app.accent,
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <Badge variant={connected ? "secondary" : "outline"}>
                        {connected ? "Connected" : "Available"}
                      </Badge>
                    </div>
                    <CardDescription>{app.description}</CardDescription>
                    {app.detail ? (
                      <p className="text-xs text-muted-foreground">{app.detail}</p>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/10">
                {connected ? (
                  <>
                    <Button size="sm" variant="outline" disabled>
                      Configure
                    </Button>
                    <Button size="sm" variant="ghost" disabled>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" disabled>
                    Connect
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Webhook className="size-5 text-chart-4" aria-hidden />
                Webhooks
              </CardTitle>
              <CardDescription>
                Outbound HTTP callbacks (demo delivery log)
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 font-normal">
              <Zap className="size-3" aria-hidden />
              Signing secret rotated (demo)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Endpoint</TableHead>
                <TableHead className="hidden lg:table-cell">Events</TableHead>
                <TableHead className="hidden sm:table-cell">Last delivery</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_WEBHOOKS.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <p className="max-w-[220px] truncate font-mono text-xs md:max-w-md">
                      {w.url}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-1 lg:hidden">
                      {w.events.map((e) => (
                        <Badge
                          key={e}
                          variant="outline"
                          className="font-mono text-[10px] font-normal"
                        >
                          {e}
                        </Badge>
                      ))}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {w.events.map((e) => (
                        <Badge
                          key={e}
                          variant="outline"
                          className="font-mono text-[10px] font-normal"
                        >
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell text-sm">
                    {w.lastDelivery}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={w.status === "ok" ? "secondary" : "destructive"}
                    >
                      {w.status === "ok" ? "Healthy" : "Failing"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t text-xs text-muted-foreground">
          Retry policies, DLQ, and HMAC verification UI typically follow this
          table.
        </CardFooter>
      </Card>
    </div>
  );
}
