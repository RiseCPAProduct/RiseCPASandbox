import { describe, expect, it } from "vitest";
import { activeTab, NAV_TABS } from "./nav";

describe("NAV_TABS", () => {
  it("lists the five hub tabs in order", () => {
    expect(NAV_TABS.map((t) => t.label)).toEqual(["Home", "Search", "Departments", "Calendar", "Help"]);
  });
});

describe("activeTab", () => {
  it("picks Home only for the root path", () => {
    expect(activeTab("/")).toBe("home");
  });

  it("picks the tab for a top-level path", () => {
    expect(activeTab("/search")).toBe("search");
    expect(activeTab("/calendar")).toBe("calendar");
    expect(activeTab("/help")).toBe("help");
  });

  it("keeps Departments active on a department page", () => {
    expect(activeTab("/departments/hr")).toBe("departments");
  });

  it("does not match a path that only starts with the same letters", () => {
    expect(activeTab("/searching")).toBeUndefined();
  });
});
