// Placeholder news for sandboxing only. Every person and post is fictional.

export type NewsType = "anniversary" | "birthday" | "blog";

export type NewsItem = {
  id: string;
  type: NewsType;
  title: string;
  // YYYY-MM-DD
  date: string;
  summary: string;
  // Partners and managers post firm news; delegated staff such as the
  // Social Committee post birthdays, anniversaries and events.
  postedBy: string;
};

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  anniversary: "Anniversary",
  birthday: "Birthday",
  blog: "Blog post",
};

export const mockNews: NewsItem[] = [
  {
    id: "news-1",
    type: "blog",
    title: "2026 Federal Budget: What It Means for Our Clients",
    date: "2026-02-03",
    summary: "A plain-language summary of the federal budget changes we sent to clients this week, so everyone gives the same answers.",
    postedBy: "Partner",
  },
  {
    id: "news-2",
    type: "anniversary",
    title: "Rebecca Kim celebrates 10 years at RISE CPA",
    date: "2026-03-07",
    summary: "Rebecca Kim joined as a co-op student in Accounting and now leads the audit team. Congratulations!",
    postedBy: "Manager",
  },
  {
    id: "news-3",
    type: "birthday",
    title: "Happy birthday, Marlon Chen",
    date: "2026-01-16",
    summary: "Wish Marlon from Tax a happy birthday. Cake in the kitchen at 3 pm.",
    postedBy: "Social Committee",
  },
  {
    id: "news-4",
    type: "anniversary",
    title: "Client milestone: Harbourview Bakery, 5 years with RISE CPA",
    date: "2026-01-23",
    summary: "One of our longest-standing advisory clients marks five years with the firm.",
    postedBy: "Partner",
  },
  {
    id: "news-5",
    type: "blog",
    title: "Provincial Budget Highlights for Small Businesses",
    date: "2026-07-20",
    summary: "Key provincial tax changes for owner-managed businesses, as summarized for clients.",
    postedBy: "Partner",
  },
  {
    id: "news-6",
    type: "blog",
    title: "CRA PST Change Announced, Then Postponed",
    date: "2026-09-18",
    summary: "The announced PST change for professional services has been postponed. Here is what to tell clients who already asked about it.",
    postedBy: "Partner",
  },
  {
    id: "news-7",
    type: "birthday",
    title: "Happy birthday, Aisha Rahman",
    date: "2026-09-25",
    summary: "Join the Social Committee in wishing Aisha from Advisory a happy birthday. Treats at the front desk.",
    postedBy: "Social Committee",
  },
];

// Numeric sort key so dates without zero-padding still compare correctly.
function dateKey(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return year * 10000 + month * 100 + day;
}

export function sortNewest(items: NewsItem[], limit?: number): NewsItem[] {
  const sorted = [...items].sort((a, b) => dateKey(b.date) - dateKey(a.date));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}

export function getLatestNews(items: NewsItem[]): NewsItem | undefined {
  return sortNewest(items, 1)[0];
}

// The banner rotates through these, newest first.
export function latestNews(items: NewsItem[], count: number): NewsItem[] {
  return sortNewest(items, count);
}

// Wrap-around steps for the rotating banner; 0 when the list is empty.
export function nextIndex(index: number, length: number): number {
  return length === 0 ? 0 : (index + 1) % length;
}

export function prevIndex(index: number, length: number): number {
  return length === 0 ? 0 : (index - 1 + length) % length;
}
