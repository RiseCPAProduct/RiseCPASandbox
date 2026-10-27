import { describe, expect, it } from "vitest";
import { getLatestNews, latestNews, mockNews, nextIndex, prevIndex, sortNewest, type NewsItem } from "./mock-news";

function news(id: string, date: string): NewsItem {
  return { id, type: "blog", title: id, date, summary: "", postedBy: "Partner" };
}

describe("latestNews", () => {
  it("returns the newest items, newest first", () => {
    const items = [news("a", "2026-01-01"), news("b", "2026-05-01"), news("c", "2026-03-01"), news("d", "2026-04-01")];
    expect(latestNews(items, 3).map((n) => n.id)).toEqual(["b", "d", "c"]);
  });

  it("returns fewer when there are fewer items", () => {
    expect(latestNews([news("a", "2026-01-01")], 3)).toHaveLength(1);
  });
});

describe("nextIndex and prevIndex", () => {
  it("move one step", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(prevIndex(2, 3)).toBe(1);
  });

  it("wrap around both ends", () => {
    expect(nextIndex(2, 3)).toBe(0);
    expect(prevIndex(0, 3)).toBe(2);
  });

  it("stay at 0 for an empty list", () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(prevIndex(0, 0)).toBe(0);
  });
});

describe("mock news", () => {
  it("says who posted every item", () => {
    for (const item of mockNews) expect(item.postedBy, item.id).toBeTruthy();
  });

  it("includes the CRA PST change blog post", () => {
    expect(mockNews.some((n) => n.type === "blog" && /PST/.test(n.title))).toBe(true);
  });
});

describe("sortNewest", () => {
  it("sorts newest first, including dates without zero-padding", () => {
    const items = [news("a", "2026-09-30"), news("b", "2026-10-2"), news("c", "2025-12-31")];
    expect(sortNewest(items).map((n) => n.id)).toEqual(["b", "a", "c"]);
  });

  it("limits the count", () => {
    const items = [news("a", "2026-01-01"), news("b", "2026-02-01"), news("c", "2026-03-01")];
    expect(sortNewest(items, 2).map((n) => n.id)).toEqual(["c", "b"]);
  });

  it("does not mutate the input", () => {
    const items = [news("a", "2026-01-01"), news("b", "2026-02-01")];
    sortNewest(items);
    expect(items.map((n) => n.id)).toEqual(["a", "b"]);
  });
});

describe("getLatestNews", () => {
  it("returns the single newest item", () => {
    expect(getLatestNews([news("a", "2026-01-01"), news("b", "2026-05-01")])?.id).toBe("b");
  });

  it("returns undefined when there is no news", () => {
    expect(getLatestNews([])).toBeUndefined();
  });

  it("has mock news covering every type", () => {
    expect(new Set(mockNews.map((n) => n.type))).toEqual(new Set(["anniversary", "birthday", "blog"]));
  });
});
