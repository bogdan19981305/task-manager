"use client";

import {
  Building2,
  Crown,
  Mail,
  MoreHorizontal,
  Shield,
  UserPlus,
  Users,
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
import { useMe } from "@/features/auth/queries";

const MOCK_WORKSPACE = {
  name: "Acme Product",
  slug: "acme-product",
  plan: "Pro",
  created: "Jan 15, 2026",
  seats: { used: 5, total: 10 },
} as const;

const MOCK_MEMBERS = [
  {
    id: "m1",
    name: "You",
    email: "owner@acme.test",
    role: "Owner" as const,
    status: "Active" as const,
    lastActive: "Now",
  },
  {
    id: "m2",
    name: "Anna Kovaleva",
    email: "anna@acme.test",
    role: "Admin" as const,
    status: "Active" as const,
    lastActive: "2h ago",
  },
  {
    id: "m3",
    name: "Max Petrov",
    email: "max@acme.test",
    role: "Member" as const,
    status: "Active" as const,
    lastActive: "Yesterday",
  },
  {
    id: "m4",
    name: "Invited user",
    email: "contractor@external.io",
    role: "Guest" as const,
    status: "Pending" as const,
    lastActive: "—",
  },
] as const;

const MOCK_INVITES = [
  { email: "design@partner.studio", sent: "Apr 2, 2026", role: "Member" },
  { email: "finance@acme.test", sent: "Mar 28, 2026", role: "Admin" },
] as const;

function roleBadgeVariant(
  role: (typeof MOCK_MEMBERS)[number]["role"],
): "default" | "secondary" | "outline" {
  switch (role) {
    case "Owner":
      return "default";
    case "Admin":
      return "secondary";
    default:
      return "outline";
  }
}

function statusBadgeVariant(
  status: (typeof MOCK_MEMBERS)[number]["status"],
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Active":
      return "secondary";
    case "Pending":
      return "outline";
    default:
      return "outline";
  }
}

export default function WorkspacePage() {
  const { data: me } = useMe();
  if (!me) return null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="size-4 shrink-0" aria-hidden />
            <span className="text-sm">Team & workspace</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Workspace
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Members, roles, and invites — mock data for UI; wire to your org
            API later.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" disabled className="gap-2">
            <UserPlus className="size-4" aria-hidden />
            Invite people
          </Button>
          <Button size="sm" disabled className="gap-2">
            Workspace settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border shadow-sm sm:col-span-2">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{MOCK_WORKSPACE.name}</CardTitle>
                <CardDescription className="font-mono text-xs">
                  {MOCK_WORKSPACE.slug}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Crown className="size-3" aria-hidden />
                {MOCK_WORKSPACE.plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Created
              </p>
              <p className="mt-1 font-medium tabular-nums">
                {MOCK_WORKSPACE.created}
              </p>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Seats
              </p>
              <p className="mt-1 font-medium tabular-nums">
                {MOCK_WORKSPACE.seats.used} / {MOCK_WORKSPACE.seats.total}{" "}
                used
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-linear-to-r from-chart-1 to-chart-2"
                  style={{
                    width: `${(MOCK_WORKSPACE.seats.used / MOCK_WORKSPACE.seats.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t text-xs text-muted-foreground">
            Signed in as <span className="font-medium">{me.email}</span> — IDs
            and slugs usually map 1:1 to backend tenants.
          </CardFooter>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-chart-1" aria-hidden />
              Quick stats
            </CardTitle>
            <CardDescription>Placeholder KPIs</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-4 text-sm">
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Open tasks</span>
              <span className="font-semibold tabular-nums">47</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Projects</span>
              <span className="font-semibold tabular-nums">6</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Automation runs</span>
              <span className="font-semibold tabular-nums">1.2k / mo</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Members</CardTitle>
              <CardDescription>
                Roles and activity (demo — actions disabled)
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" disabled>
              Export roster
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Last active</TableHead>
                <TableHead className="text-right w-[80px]"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MEMBERS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={roleBadgeVariant(m.role)}
                      className="gap-1 font-normal"
                    >
                      {m.role === "Admin" ? (
                        <Shield className="size-3" aria-hidden />
                      ) : null}
                      {m.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(m.status)}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell tabular-nums text-sm">
                    {m.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      disabled
                      aria-label="Member actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="size-5 text-muted-foreground" aria-hidden />
            Pending invitations
          </CardTitle>
          <CardDescription>Resend and revoke when API exists</CardDescription>
        </CardHeader>
        <CardContent className="divide-y px-0 pt-0">
          {MOCK_INVITES.map((inv) => (
            <div
              key={inv.email}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium">{inv.email}</p>
                <p className="text-xs text-muted-foreground">
                  Sent {inv.sent} · Role{" "}
                  <span className="font-medium text-foreground">{inv.role}</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" disabled>
                  Resend
                </Button>
                <Button size="sm" variant="ghost" disabled>
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t text-xs text-muted-foreground">
          SSO domain verification and default role policies often live on this
          screen in larger orgs.
        </CardFooter>
      </Card>
    </div>
  );
}
