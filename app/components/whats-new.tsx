"use client";

import Link from "next/link";
import { Card } from "@fluentui/react-components";
import { formatDayMonth } from "@/lib/format-date";
import { useDemoRole } from "./demo-role";

// The 3 latest publishes with their change notes (Rise/Folio MVP, section 7).
export default function WhatsNew() {
  const { notifications } = useDemoRole();
  if (notifications.length === 0) return <p className="text-sm text-zinc-600">Nothing published yet.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {notifications.slice(0, 3).map((n) => (
        <li key={n.id}>
          <Card className="h-full p-3!">
            <Link
              href={`/search?${new URLSearchParams({ q: n.fileName })}`}
              className="font-semibold text-brand-green-dark underline-offset-2 hover:underline"
            >
              {n.title}
            </Link>
            <p className="text-xs text-zinc-600">
              {n.department} · {formatDayMonth(n.at.slice(0, 10))}
            </p>
            {n.changeNote && <p className="text-sm">{n.changeNote}</p>}
          </Card>
        </li>
      ))}
    </ul>
  );
}
