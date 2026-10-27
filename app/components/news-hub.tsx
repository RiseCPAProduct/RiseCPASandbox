"use client";

import { Badge, Button } from "@fluentui/react-components";
import { formatMonthYear } from "@/lib/format-date";
import { mockNews, NEWS_TYPE_LABELS, sortNewest, type NewsType } from "@/lib/mock-news";
import { useDemoRole } from "./demo-role";

const TYPE_COLORS: Record<NewsType, "warning" | "danger" | "success"> = {
  anniversary: "warning",
  birthday: "danger",
  blog: "success",
};

// News cards with who posted each one. Only managers and partners see the
// (disabled) Post button, to show who can post.
export default function NewsHub({ limit = 6 }: { limit?: number }) {
  const { role } = useDemoRole();
  const news = sortNewest(mockNews, limit);

  return (
    <div>
      {role !== "staff" && (
        <div className="mb-3 flex justify-end">
          <Button appearance="primary" size="small" disabled>
            Post news (demo)
          </Button>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <li key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Badge appearance="tint" color={TYPE_COLORS[item.type]}>
                {NEWS_TYPE_LABELS[item.type]}
              </Badge>
              <time dateTime={item.date} className="text-xs text-zinc-500">
                {formatMonthYear(item.date)}
              </time>
            </div>
            <h3 className="mt-2 font-medium text-zinc-900">{item.title}</h3>
            <p className="mt-1 text-sm text-brand-charcoal">{item.summary}</p>
            <p className="mt-2 text-xs text-zinc-500">Posted by {item.postedBy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
