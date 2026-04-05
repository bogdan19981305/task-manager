"use client";

import {
  Bell,
  CalendarClock,
  Check,
  CreditCard,
  Crown,
  KeyRound,
  Laptop,
  MapPin,
  MonitorSmartphone,
  QrCode,
  Receipt,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCircle,
  Zap,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMe } from "@/features/auth/queries";
import { cn } from "@/lib/utils";

/** Demo-only: replace with billing API when wired. */
const MOCK_PLAN = {
  name: "Pro",
  tagline: "For growing teams",
  priceLabel: "$29 / month",
  renewsOn: "May 3, 2026",
  status: "active" as const,
  limits: [
    { label: "Active projects", used: 12, max: 25 },
    { label: "Seats", used: 5, max: 10 },
    { label: "Storage", used: 18, max: 50, unit: "GB" },
  ],
  perks: [
    "Priority support",
    "Advanced analytics",
    "SSO-ready workspace",
    "Audit log (90 days)",
  ],
} as const;

const MOCK_PAYMENTS = [
  {
    id: "inv_9K2m",
    date: "Apr 3, 2026",
    amount: "$29.00",
    method: "Visa •••• 4242",
    status: "Paid" as const,
  },
  {
    id: "inv_8Jp1",
    date: "Mar 3, 2026",
    amount: "$29.00",
    method: "Visa •••• 4242",
    status: "Paid" as const,
  },
  {
    id: "inv_7Hn0",
    date: "Feb 3, 2026",
    amount: "$29.00",
    method: "Visa •••• 4242",
    status: "Paid" as const,
  },
  {
    id: "inv_6Gm9",
    date: "Jan 3, 2026",
    amount: "$29.00",
    method: "Visa •••• 4242",
    status: "Refunded" as const,
  },
] as const;

/** Security & access — demo rows. */
const MOCK_TOTP = {
  enabled: true,
  appName: "Authenticator app",
  addedAt: "Mar 12, 2026",
  backupCodesLeft: 6,
  lastVerified: "2 hours ago",
} as const;

const MOCK_SESSIONS = [
  {
    id: "sess_1",
    label: "This Mac · Chrome",
    detail: "San Francisco, CA · 192.168.0.12",
    lastActive: "Active now",
    current: true,
    icon: Laptop,
  },
  {
    id: "sess_2",
    label: "iPhone · Safari",
    detail: "Berlin, DE · 10.0.0.44",
    lastActive: "Yesterday",
    current: false,
    icon: Smartphone,
  },
  {
    id: "sess_3",
    label: "Work laptop · Arc",
    detail: "Remote · VPN",
    lastActive: "Apr 1, 2026",
    current: false,
    icon: MonitorSmartphone,
  },
] as const;

const MOCK_API_KEYS = [
  {
    id: "key_1",
    name: "CI deploy",
    prefix: "tm_live_",
    suffix: "…8f3a",
    created: "Jan 8, 2026",
    lastUsed: "Apr 4, 2026",
    scopes: ["tasks:write", "webhooks"],
  },
  {
    id: "key_2",
    name: "Personal scripts",
    prefix: "tm_live_",
    suffix: "…c21d",
    created: "Feb 22, 2026",
    lastUsed: "Mar 30, 2026",
    scopes: ["tasks:read"],
  },
] as const;

const MOCK_NOTIFICATIONS = [
  {
    id: "notif_security",
    title: "Security alerts",
    description: "New logins, 2FA changes, and password resets.",
    defaultChecked: true,
  },
  {
    id: "notif_billing",
    title: "Billing & invoices",
    description: "Receipts, failed payments, and renewal reminders.",
    defaultChecked: true,
  },
  {
    id: "notif_product",
    title: "Product updates",
    description: "Release notes and tips (max once a week).",
    defaultChecked: false,
  },
  {
    id: "notif_mentions",
    title: "Mentions & assignments",
    description: "When someone @mentions you or assigns a task.",
    defaultChecked: true,
  },
] as const;

function displayName(name: string | null, email: string) {
  return (name?.trim() || email.split("@")[0]) ?? "Member";
}

function initials(name: string | null, email: string) {
  const base = name?.trim();
  if (base) {
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return base.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function paymentStatusVariant(
  status: (typeof MOCK_PAYMENTS)[number]["status"],
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Paid":
      return "secondary";
    case "Refunded":
      return "outline";
    default:
      return "outline";
  }
}

export default function AccountPage() {
  const { data: me } = useMe();

  if (!me) return null;

  const title = displayName(me.name, me.email);
  const monogram = initials(me.name, me.email);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-10 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="size-4 shrink-0" aria-hidden />
            <span className="text-sm">Profile & billing</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Account
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Profile, billing, security, and preferences — mock data for layout
            preview until APIs are wired.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0 gap-2">
          <Link href="/pricing">
            <Sparkles className="size-4" aria-hidden />
            Compare plans
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border bg-linear-to-br from-card via-card to-muted/40 shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className={cn(
                "flex size-16 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold tracking-tight",
                "bg-primary/15 text-primary ring-2 ring-primary/20",
              )}
              aria-hidden
            >
              {monogram}
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-semibold tracking-tight">
                  {title}
                </h2>
                <Badge variant={me.role === "ADMIN" ? "default" : "secondary"}>
                  {me.role === "ADMIN" ? "Admin" : "Member"}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {me.email}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border bg-background/60 px-2 py-1 font-mono tabular-nums">
                  User ID {me.id}
                </span>
                <span className="rounded-md border bg-background/60 px-2 py-1">
                  Member since Jan 2026 (demo)
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4 shrink-0" aria-hidden />
              <span>Last sign-in: today (demo)</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              disabled
            >
              Edit profile (soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="border shadow-sm lg:col-span-3">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="size-5 text-chart-4" aria-hidden />
                  Current plan
                </CardTitle>
                <CardDescription>
                  {MOCK_PLAN.tagline} — mock subscription state
                </CardDescription>
              </div>
              <Badge className="gap-1 capitalize">{MOCK_PLAN.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">You are on</p>
                <p className="text-3xl font-semibold tracking-tight">
                  {MOCK_PLAN.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {MOCK_PLAN.priceLabel}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                <p className="text-muted-foreground">Renews on</p>
                <p className="font-medium tabular-nums">{MOCK_PLAN.renewsOn}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Included
                </p>
                <ul className="grid gap-2 text-sm">
                  {MOCK_PLAN.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-chart-2" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Zap className="size-3.5" aria-hidden />
                  Usage (demo)
                </p>
                <ul className="grid gap-4">
                  {MOCK_PLAN.limits.map((row) => {
                    const pct = Math.round((row.used / row.max) * 100);
                    return (
                      <li key={row.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {row.label}
                          </span>
                          <span className="tabular-nums font-medium">
                            {row.used}
                            {"unit" in row && row.unit
                              ? ` ${row.unit} / ${row.max} ${row.unit}`
                              : ` / ${row.max}`}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-chart-1 to-chart-2"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Payment method on file: Visa •••• 4242 (demo)
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button size="sm" variant="outline" disabled>
                Manage subscription
              </Button>
              <Button size="sm" asChild>
                <Link href="/pricing">Upgrade</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="size-5 text-chart-1" aria-hidden />
              Billing snapshot
            </CardTitle>
            <CardDescription>At-a-glance (placeholder)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            <div className="rounded-xl border bg-linear-to-br from-primary/10 via-transparent to-chart-3/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Next charge
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">$29.00</p>
              <p className="text-sm text-muted-foreground">
                Scheduled for May 3, 2026
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium tabular-nums">$0.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-medium tabular-nums">−$0.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <span className="font-medium">Balance due</span>
                <span className="font-semibold tabular-nums">$0.00</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t text-xs text-muted-foreground">
            In production, this panel can show tax IDs, billing email, and
            download links for invoices.
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Security & access
        </h2>
        <p className="text-sm text-muted-foreground">
          Typical account controls — TOTP, sessions, API keys, and notification
          toggles (non-functional demo).
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="size-5 text-chart-2" aria-hidden />
                  Two-factor authentication
                </CardTitle>
                <CardDescription>
                  TOTP via an authenticator app (demo state)
                </CardDescription>
              </div>
              <Badge
                variant={MOCK_TOTP.enabled ? "secondary" : "outline"}
                className="gap-1 shrink-0"
              >
                {MOCK_TOTP.enabled ? "Enabled" : "Off"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div
                className={cn(
                  "flex aspect-square w-full max-w-[140px] shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30",
                )}
                aria-hidden
              >
                <QrCode className="size-14 text-muted-foreground/60" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm font-medium">{MOCK_TOTP.appName}</p>
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  <li className="flex flex-wrap gap-x-2 gap-y-0.5">
                    <span className="text-foreground/80">Linked on</span>
                    <span className="tabular-nums">{MOCK_TOTP.addedAt}</span>
                  </li>
                  <li className="flex flex-wrap gap-x-2 gap-y-0.5">
                    <span className="text-foreground/80">Last verified</span>
                    <span>{MOCK_TOTP.lastVerified}</span>
                  </li>
                  <li className="flex flex-wrap gap-x-2 gap-y-0.5">
                    <span className="text-foreground/80">Backup codes</span>
                    <span className="font-medium tabular-nums text-foreground">
                      {MOCK_TOTP.backupCodesLeft} remaining
                    </span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  In production, scanning this QR registers your device; here it
                  is decorative only.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button size="sm" variant="outline" disabled>
                View setup key
              </Button>
              <Button size="sm" variant="outline" disabled>
                Regenerate backup codes
              </Button>
              <Button size="sm" variant="destructive" disabled>
                Disable 2FA
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/15 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <KeyRound className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                Add a security key (WebAuthn) next — common upgrade path after
                TOTP.
              </span>
            </div>
            <Button size="sm" disabled>
              Register passkey
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-4">
          <Card className="border shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MonitorSmartphone
                  className="size-5 text-chart-1"
                  aria-hidden
                />
                Active sessions
              </CardTitle>
              <CardDescription>
                Devices that can access your workspace (mock)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pt-4">
              {MOCK_SESSIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                      s.current && "border-primary/35 bg-primary/5",
                    )}
                  >
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                          s.current
                            ? "bg-chart-1/15 text-chart-1 ring-chart-1/25"
                            : "bg-muted/50 text-muted-foreground ring-border",
                        )}
                      >
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium leading-tight">{s.label}</p>
                          {s.current ? (
                            <Badge variant="secondary" className="text-[10px]">
                              This device
                            </Badge>
                          ) : null}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" aria-hidden />
                          <span className="truncate">{s.detail}</span>
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {s.lastActive}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="shrink-0 sm:ml-2"
                    >
                      {s.current ? "Current" : "Sign out"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="border-t text-xs text-muted-foreground">
              “Sign out everywhere” often lives here — wire to your session API.
            </CardFooter>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <KeyRound className="size-5 text-chart-3" aria-hidden />
                    API keys
                  </CardTitle>
                  <CardDescription>
                    Programmatic access — masked secrets (demo)
                  </CardDescription>
                </div>
                <Button size="sm" disabled>
                  Create key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-4">
              {MOCK_API_KEYS.map((k) => (
                <div
                  key={k.id}
                  className="rounded-xl border bg-muted/15 p-4 transition-colors hover:bg-muted/25"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium">{k.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {k.prefix}
                        <span className="select-none">••••••••</span>
                        {k.suffix}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="ghost" disabled>
                        Rotate
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {k.scopes.map((scope) => (
                      <Badge
                        key={scope}
                        variant="outline"
                        className="font-mono text-[10px] font-normal"
                      >
                        {scope}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Created {k.created} · Last used {k.lastUsed}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="size-5 text-chart-4" aria-hidden />
            Notification preferences
          </CardTitle>
          <CardDescription>
            Email channels — switches are read-only in this preview
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-0 pt-2">
          {MOCK_NOTIFICATIONS.map((n, i) => (
            <div key={n.id}>
              {i > 0 ? <Separator className="my-1" /> : null}
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0 space-y-1 pr-2">
                  <Label
                    htmlFor={n.id}
                    className="text-sm font-medium leading-none"
                  >
                    {n.title}
                  </Label>
                  <p
                    id={`${n.id}-desc`}
                    className="text-xs text-muted-foreground"
                  >
                    {n.description}
                  </p>
                </div>
                <Switch
                  id={n.id}
                  size="sm"
                  defaultChecked={n.defaultChecked}
                  disabled
                  aria-describedby={`${n.id}-desc`}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t text-xs text-muted-foreground">
          Mobile push and Slack mirrors often ship as separate toggles in the
          same panel.
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="size-5 text-muted-foreground" aria-hidden />
                Payment history
              </CardTitle>
              <CardDescription>
                Mock invoices — swap for `/payments` or provider webhooks
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" disabled>
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Method</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PAYMENTS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.id}</TableCell>
                  <TableCell className="tabular-nums">{row.date}</TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {row.amount}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {row.method}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={paymentStatusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-between border-t text-xs text-muted-foreground">
          <span>Showing last {MOCK_PAYMENTS.length} transactions (demo)</span>
          <Button variant="link" className="h-auto p-0 text-xs" disabled>
            View all in portal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
