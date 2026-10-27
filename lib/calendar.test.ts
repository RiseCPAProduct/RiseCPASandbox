import { describe, expect, it } from "vitest";
import { addDays, addMonths, buildMonthGrid, daysBetween, eventsOn, upcomingEvents } from "./calendar";
import type { CalendarEvent } from "./mock-events";

describe("buildMonthGrid", () => {
  it("starts weeks on Sunday", () => {
    // 1 November 2026 is a Sunday, so the grid starts on it.
    const grid = buildMonthGrid(2026, 11);
    expect(grid[0][0]).toEqual({ date: "2026-11-01", day: 1, inMonth: true });
  });

  it("fills leading and trailing days from neighbouring months", () => {
    // 1 October 2026 is a Thursday.
    const grid = buildMonthGrid(2026, 10);
    expect(grid[0].slice(0, 4).map((d) => d.date)).toEqual(["2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30"]);
    expect(grid[0][0].inMonth).toBe(false);
    expect(grid[0][4]).toEqual({ date: "2026-10-01", day: 1, inMonth: true });
    // 30 November 2026 is a Monday, so the last week runs to 5 December.
    const last = buildMonthGrid(2026, 11).at(-1)!;
    expect(last[1]).toEqual({ date: "2026-11-30", day: 30, inMonth: true });
    expect(last.at(-1)).toEqual({ date: "2026-12-05", day: 5, inMonth: false });
  });

  it("always has full weeks of 7 days", () => {
    for (const grid of [buildMonthGrid(2026, 10), buildMonthGrid(2026, 11), buildMonthGrid(2027, 2)]) {
      for (const week of grid) expect(week).toHaveLength(7);
    }
  });

  it("includes 29 February in a leap year", () => {
    const days = buildMonthGrid(2028, 2).flat().filter((d) => d.inMonth);
    expect(days).toHaveLength(29);
    expect(days.at(-1)?.date).toBe("2028-02-29");
    // 1 February 2028 is a Tuesday, so the grid starts on Sunday 30 January.
    expect(buildMonthGrid(2028, 2)[0][0].date).toBe("2028-01-30");
  });
});

describe("addMonths", () => {
  it("wraps across years", () => {
    expect(addMonths(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe("daysBetween", () => {
  it("counts whole days, including across months", () => {
    expect(daysBetween("2026-10-01", "2026-10-31")).toBe(30);
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
    expect(daysBetween("2026-10-01", "2026-10-01")).toBe(0);
  });
});

function event(id: string, date: string): CalendarEvent {
  return { id, title: id, date, type: "social" };
}

describe("eventsOn", () => {
  it("returns the events on that day, including non-padded dates", () => {
    const events = [event("a", "2026-11-05"), event("b", "2026-11-5"), event("c", "2026-11-06")];
    expect(eventsOn(events, "2026-11-05").map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("returns nothing on a day without events", () => {
    expect(eventsOn([event("a", "2026-11-05")], "2026-11-04")).toEqual([]);
  });
});

describe("upcomingEvents", () => {
  it("lists events from today onward, soonest first, limited", () => {
    const events = [event("late", "2026-11-20"), event("past", "2026-09-30"), event("today", "2026-10-01"), event("soon", "2026-10-15")];
    expect(upcomingEvents(events, "2026-10-01", 2).map((e) => e.id)).toEqual(["today", "soon"]);
  });
});

describe("addDays", () => {
  it("moves across month and year ends", () => {
    expect(addDays("2026-10-31", -30)).toBe("2026-10-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});
