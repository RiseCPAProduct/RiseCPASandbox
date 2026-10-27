import { describe, expect, it } from "vitest";
import { mockTeam, teamForRole } from "./mock-team";

describe("teamForRole", () => {
  it("gives Staff an empty team", () => {
    expect(teamForRole("staff")).toEqual([]);
  });

  it("gives Managers and Partners the team", () => {
    expect(teamForRole("manager")).toEqual(mockTeam);
    expect(teamForRole("partner")).toEqual(mockTeam);
  });

  it("has 3 to 4 direct reports, each with a review file and coaching notes", () => {
    expect(mockTeam.length).toBeGreaterThanOrEqual(3);
    expect(mockTeam.length).toBeLessThanOrEqual(4);
    for (const member of mockTeam) {
      expect(member.reviewFile).toMatch(/\.xlsx$/);
      expect(member.coachingNotes.length).toBeGreaterThan(0);
    }
  });
});
