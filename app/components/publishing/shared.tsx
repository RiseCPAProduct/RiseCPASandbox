"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Badge, MessageBar, MessageBarBody, Tab, TabList, type BadgeProps } from "@fluentui/react-components";
import type { FirmConfig } from "@/lib/firm-config";
import { formatDayMonth } from "@/lib/format-date";
import type { Role } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import type { AiStatus } from "@/lib/publishing/http";
import { STATUS_LABELS, type Submission, type SubmissionStatus } from "@/lib/publishing/types";
import { useDemoRole } from "../demo-role";

export type ConfigState = { config: FirmConfig; ai: AiStatus; clientAi: AiStatus } | null;

// The firm's rules and AI availability, loaded once per page.
export function useFirmConfig(): [ConfigState, () => void] {
  const [state, setState] = useState<ConfigState>(null);
  const load = useCallback(() => {
    apiFetch<NonNullable<ConfigState>>("/api/config", "staff").then(setState, () => setState(null));
  }, []);
  useEffect(load, [load]);
  return [state, load];
}

// Loads a list for the current role, and reloads when the role changes.
export function useSubmissions(scope: string, role: Role) {
  const [data, setData] = useState<{ role: Role; scope: string; items: Submission[]; error?: string } | null>(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let cancelled = false;
    apiFetch<{ submissions: Submission[] }>(`/api/submissions?scope=${scope}`, role).then(
      (res) => !cancelled && setData({ role, scope, items: res.submissions }),
      (err: Error) => !cancelled && setData({ role, scope, items: [], error: err.message }),
    );
    return () => {
      cancelled = true;
    };
  }, [scope, role, version]);
  const current = data?.role === role && data.scope === scope ? data : null;
  return { loading: !current, items: current?.items ?? [], error: current?.error, reload: () => setVersion((v) => v + 1) };
}

const STATUS_COLORS: Record<SubmissionStatus, BadgeProps["color"]> = {
  submitted: "informative",
  under_review: "warning",
  changes_requested: "severe",
  rejected: "danger",
  approved: "success",
  published: "brand",
  superseded: "subtle",
  unpublished: "subtle",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <Badge appearance="tint" color={STATUS_COLORS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// Who did what and when, with any comments: the accountability record.
export function HistoryList({ submission }: { submission: Submission }) {
  return (
    <ol className="mt-2 space-y-1 border-l-2 border-zinc-200 pl-3 text-sm">
      {submission.history.map((h, i) => (
        <li key={i}>
          <span className="font-semibold">{STATUS_LABELS[h.status]}</span> by {h.by}, {formatDayMonth(h.at.slice(0, 10))}
          {h.note && <span className="block text-zinc-600">&ldquo;{h.note}&rdquo;</span>}
        </li>
      ))}
    </ol>
  );
}

export function ErrorBar({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <MessageBar intent="error">
      <MessageBarBody>{message}</MessageBarBody>
    </MessageBar>
  );
}

export function AiNote({ ai }: { ai: AiStatus | undefined }) {
  if (!ai || ai.available) return null;
  return (
    <MessageBar intent="info">
      <MessageBarBody>AI suggestions are off: {ai.reason} Every field can still be filled by hand.</MessageBarBody>
    </MessageBar>
  );
}

const SUB_TABS: { href: string; label: string; roles: Role[] }[] = [
  { href: "/publishing", label: "Submit & track", roles: ["staff", "manager", "partner"] },
  { href: "/publishing/review", label: "Review queue", roles: ["partner"] },
  { href: "/publishing/publish", label: "Publish queue", roles: ["manager"] },
  { href: "/publishing/file", label: "Smart File (client)", roles: ["staff", "manager", "partner"] },
  { href: "/publishing/settings", label: "Settings", roles: ["partner"] },
];

// Sub-navigation inside the Publishing tab, routed like the header tabs.
// Queues a role can't use are not shown at all.
export function PublishingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useDemoRole();
  const tabs = SUB_TABS.filter((t) => t.roles.includes(role));
  return (
    <nav aria-label="Publishing" className="overflow-x-auto">
      <TabList size="small" selectedValue={pathname} onTabSelect={(_, data) => router.push(String(data.value))}>
        {tabs.map((t) => (
          <Tab key={t.href} value={t.href}>
            {t.label}
          </Tab>
        ))}
      </TabList>
    </nav>
  );
}

// Shown on a queue page when the current role can't use it.
export function RoleGate({ allowed, children, message }: { allowed: Role[]; children: ReactNode; message: string }) {
  const { role } = useDemoRole();
  if (!allowed.includes(role)) {
    return (
      <MessageBar intent="info">
        <MessageBarBody>{message}</MessageBarBody>
      </MessageBar>
    );
  }
  return <>{children}</>;
}
