import { describe, expect, it } from "vitest";
import { shouldShowOnboarding } from "./onboarding";

describe("shouldShowOnboarding", () => {
  it("shows on the first visit", () => {
    expect(shouldShowOnboarding({ firstSeen: null, today: "2026-10-01", dismissed: false })).toBe(true);
    expect(shouldShowOnboarding({ firstSeen: "2026-10-01", today: "2026-10-01", dismissed: false })).toBe(true);
  });

  it("still shows on day 30", () => {
    expect(shouldShowOnboarding({ firstSeen: "2026-10-01", today: "2026-10-30", dismissed: false })).toBe(true);
  });

  it("stops after 30 days", () => {
    expect(shouldShowOnboarding({ firstSeen: "2026-10-01", today: "2026-10-31", dismissed: false })).toBe(false);
  });

  it("never shows once dismissed for good", () => {
    expect(shouldShowOnboarding({ firstSeen: null, today: "2026-10-01", dismissed: true })).toBe(false);
    expect(shouldShowOnboarding({ firstSeen: "2026-10-01", today: "2026-10-02", dismissed: true })).toBe(false);
  });
});
