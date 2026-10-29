import { describe, expect, it } from "vitest";
import { addDays, daysBetween } from "./dates";

describe("daysBetween", () => {
  it("counts whole days, including across months", () => {
    expect(daysBetween("2026-10-01", "2026-10-31")).toBe(30);
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
    expect(daysBetween("2026-10-01", "2026-10-01")).toBe(0);
  });
});

describe("addDays", () => {
  it("moves across month and year ends", () => {
    expect(addDays("2026-10-31", -30)).toBe("2026-10-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});
