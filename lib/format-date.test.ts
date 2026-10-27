import { describe, expect, it } from "vitest";
import { formatDayMonth, formatMonthYear } from "./format-date";

describe("formatMonthYear", () => {
  it("formats a year-month", () => {
    expect(formatMonthYear("2026-01")).toBe("January 2026");
  });

  it("formats a full date as month and year", () => {
    expect(formatMonthYear("2026-10-29")).toBe("October 2026");
  });

  it("handles months without zero-padding", () => {
    expect(formatMonthYear("2026-1-24")).toBe("January 2026");
  });
});

describe("formatDayMonth", () => {
  it("formats a date as month and day", () => {
    expect(formatDayMonth("2026-11-04")).toBe("November 4");
    expect(formatDayMonth("2026-1-24")).toBe("January 24");
  });
});
