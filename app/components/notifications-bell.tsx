"use client";

import Link from "next/link";
import { Button, CounterBadge, Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import { Alert20Regular } from "@fluentui/react-icons";
import { formatDayMonth } from "@/lib/format-date";
import { useStoredValue } from "../hooks/use-stored-value";
import { useDemoRole } from "./demo-role";

const SEEN_KEY = "rise-notifications-seen";

// In-app notice of each publish, replacing the firm-wide email (Rise/Folio
// MVP, section 7). Only publishes the role may see are listed. "Seen" is
// stored per browser; a real version stores it per user.
export default function NotificationsBell() {
  const { notifications } = useDemoRole();
  const [seen, setSeen] = useStoredValue(SEEN_KEY);
  const unread = seen === undefined ? 0 : notifications.filter((n) => !seen || n.at > seen).length;

  return (
    <Popover
      withArrow
      positioning="below-end"
      onOpenChange={(_, data) => {
        if (!data.open && notifications[0]) setSeen(notifications[0].at);
      }}
    >
      <PopoverTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          size="small"
          aria-label={unread ? `Notifications, ${unread} new` : "Notifications"}
          icon={
            <span className="relative inline-flex">
              <Alert20Regular />
              {unread > 0 && <CounterBadge count={unread} size="small" color="danger" className="absolute! -right-2 -top-2" />}
            </span>
          }
        />
      </PopoverTrigger>
      <PopoverSurface aria-label="Notifications" className="w-80 max-w-[90vw]">
        <p className="text-sm font-semibold text-zinc-900">Newly published</p>
        {notifications.length === 0 ? (
          <p className="mt-2 text-sm text-brand-charcoal">Nothing yet.</p>
        ) : (
          <ul className="mt-2 grid max-h-80 gap-2 overflow-y-auto">
            {notifications.slice(0, 8).map((n) => (
              <li key={n.id} className="text-sm">
                <Link
                  href={`/search?${new URLSearchParams({ q: n.fileName })}`}
                  className="font-semibold text-brand-green-dark underline-offset-2 hover:underline"
                >
                  {n.title}
                </Link>
                <span className="block text-zinc-600">
                  {n.department} · {formatDayMonth(n.at.slice(0, 10))}
                  {(!seen || n.at > seen) && " · new"}
                </span>
                {n.changeNote && <span className="block">{n.changeNote}</span>}
              </li>
            ))}
          </ul>
        )}
      </PopoverSurface>
    </Popover>
  );
}
