"use client";

import {
  Download,
  Filter,
  ScrollText,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_EVENTS = [
  {
    id: "e1",
    at: "Apr 5, 2026 · 14:32",
    actor: "anna@acme.test",
    action: "updated",
    resource: "task “Payment integration”",
    meta: "status → In review",
    ip: "192.168.0.12",
    severity: "info" as const,
  },
  {
    id: "e2",
    at: "Apr 5, 2026 · 11:05",
    actor: "max@acme.test",
    action: "created",
    resource: "comment on “API documentation”",
    meta: "—",
    ip: "10.0.0.44",
    severity: "info" as const,
  },
  {
    id: "e3",
    at: "Apr 4, 2026 · 18:20",
    actor: "system",
    action: "webhook",
    resource: "delivery to api.acme.test",
    meta: "HTTP 200",
    ip: "—",
    severity: "info" as const,
  },
  {
    id: "e4",
    at: "Apr 4, 2026 · 09:12",
    actor: "owner@acme.test",
    action: "changed role",
    resource: "member max@acme.test",
    meta: "Member → Admin",
    ip: "203.0.113.8",
    severity: "warning" as const,
  },
  {
    id: "e5",
    at: "Apr 3, 2026 · 22:01",
    actor: "unknown",
    action: "failed login",
    resource: "account",
    meta: "wrong password ×3",
    ip: "198.51.100.2",
    severity: "critical" as const,
  },
  {
    id: "e6",
    at: "Apr 3, 2026 · 16:40",
    actor: "anna@acme.test",
    action: "exported",
    resource: "workspace tasks (CSV)",
    meta: "—",
    ip: "192.168.0.12",
    severity: "warning" as const,
  },
] as const;

function severityVariant(
  s: (typeof MOCK_EVENTS)[number]["severity"],
): "default" | "secondary" | "outline" | "destructive" {
  switch (s) {
    case "critical":
      return "destructive";
    case "warning":
      return "outline";
    default:
      return "secondary";
  }
}

export default function ActivityPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ScrollText className="size-4 shrink-0" aria-hidden />
            <span className="text-sm">Audit trail</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Activity
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Immutable-style event log (mock) — swap for Elasticsearch or your
            audit table.
          </p>
        </div>
        <Button variant="outline" size="sm" disabled className="gap-2 shrink-0">
          <Download className="size-4" aria-hidden />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-lg">Workspace events</CardTitle>
              <CardDescription>
                Actor, action, resource — demo rows
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <div className="relative flex-1 lg:min-w-[220px]">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  disabled
                  placeholder="Search (soon)"
                  className="pl-9"
                  aria-label="Search activity"
                />
              </div>
              <Button variant="secondary" disabled className="gap-2 shrink-0">
                <Filter className="size-4" aria-hidden />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="whitespace-nowrap">Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="hidden md:table-cell">Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead className="hidden xl:table-cell">Details</TableHead>
                <TableHead className="hidden lg:table-cell">IP</TableHead>
                <TableHead className="text-right">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EVENTS.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="align-top text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                    {e.at}
                  </TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    {e.actor}
                  </TableCell>
                  <TableCell className="hidden align-top md:table-cell">
                    <Badge variant="outline" className="font-normal">
                      {e.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top text-sm max-w-[200px] md:max-w-none">
                    <span className="md:hidden">
                      <Badge variant="outline" className="mb-1 font-normal">
                        {e.action}
                      </Badge>
                      <br />
                    </span>
                    {e.resource}
                  </TableCell>
                  <TableCell className="hidden align-top text-muted-foreground text-sm xl:table-cell">
                    {e.meta}
                  </TableCell>
                  <TableCell className="hidden align-top font-mono text-xs text-muted-foreground lg:table-cell">
                    {e.ip}
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <Badge variant={severityVariant(e.severity)} className="capitalize">
                      {e.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Retention: 90 days (demo policy banner).</span>
          <span className="hidden sm:inline">
            PagerDuty / SIEM forwarding hooks go here in enterprise tiers.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
