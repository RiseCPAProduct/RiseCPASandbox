"use client";

import { useEffect, useState } from "react";
import { Button } from "@fluentui/react-components";
import { ChevronLeft20Regular, ChevronRight20Regular, Dismiss20Regular } from "@fluentui/react-icons";
import { latestNews, mockNews, NEWS_TYPE_LABELS, nextIndex, prevIndex } from "@/lib/mock-news";
import { useStoredValue } from "../hooks/use-stored-value";
import { usePrefersReducedMotion } from "../hooks/use-reduced-motion";

const STORAGE_KEY = "rise-news-banner-dismissed";
const ROTATE_MS = 6000;
const posts = latestNews(mockNews, 3);

const ICON_BUTTON = "text-white! hover:bg-white/20! min-w-0!";

// Rotates through the three latest posts (Meeting 4, section 3). Closing it
// stores the newest post's id, so it stays hidden until something newer exists.
export default function NewsBanner() {
  const [dismissedId, setDismissedId] = useStoredValue(STORAGE_KEY);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const paused = hovered || focused || reducedMotion;
  const hidden = posts.length === 0 || dismissedId === undefined || dismissedId === posts[0].id;

  useEffect(() => {
    if (paused || hidden) return;
    const timer = setInterval(() => setIndex((i) => nextIndex(i, posts.length)), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, hidden]);

  // undefined = storage not checked yet; render nothing to avoid a flash.
  if (hidden) return null;
  const post = posts[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Latest announcements"
      className="rounded-lg bg-brand-green text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="flex items-center gap-1 px-2 py-2 text-sm sm:gap-2">
        <Button appearance="transparent" size="small" className={ICON_BUTTON} icon={<ChevronLeft20Regular />} aria-label="Previous announcement" onClick={() => setIndex((i) => prevIndex(i, posts.length))} />
        <div className="min-w-0 flex-1" aria-live={paused ? "polite" : "off"} aria-roledescription="slide" aria-label={`${index + 1} of ${posts.length}`}>
          <span className="mr-2 rounded bg-white/20 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
            {NEWS_TYPE_LABELS[post.type]}
          </span>
          <span className="font-medium">{post.title}</span>
          <a href="#news" className="ml-2 whitespace-nowrap underline underline-offset-2 hover:no-underline">
            Read more
          </a>
        </div>
        <span className="shrink-0 text-xs text-white/90">
          {index + 1} of {posts.length}
        </span>
        <Button appearance="transparent" size="small" className={ICON_BUTTON} icon={<ChevronRight20Regular />} aria-label="Next announcement" onClick={() => setIndex((i) => nextIndex(i, posts.length))} />
        <Button appearance="transparent" size="small" className={ICON_BUTTON} icon={<Dismiss20Regular />} aria-label="Dismiss announcements" onClick={() => setDismissedId(posts[0].id)} />
      </div>
    </section>
  );
}
