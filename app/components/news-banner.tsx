"use client";

import { getLatestNews, mockNews, NEWS_TYPE_LABELS } from "@/lib/mock-news";
import { useStoredValue } from "../hooks/use-stored-value";

const STORAGE_KEY = "rise-news-banner-dismissed";
const latest = getLatestNews(mockNews);

// Closable "sale banner" style strip for the newest firm news. Dismissal is
// remembered per item, so a newer item brings the banner back.
export default function NewsBanner() {
  const [dismissedId, setDismissedId] = useStoredValue(STORAGE_KEY);

  // undefined = storage not checked yet; render nothing to avoid a flash.
  if (!latest || dismissedId === undefined || dismissedId === latest.id) return null;

  return (
    <div className="bg-brand-green text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        <p className="min-w-0 flex-1">
          <span className="mr-2 rounded bg-white/20 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
            New {NEWS_TYPE_LABELS[latest.type]}
          </span>
          <span className="font-medium">{latest.title}</span>
          <a href="#news" className="ml-2 whitespace-nowrap underline underline-offset-2 hover:no-underline">
            Read more
          </a>
        </p>
        <button
          type="button"
          onClick={() => setDismissedId(latest.id)}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded p-1 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
