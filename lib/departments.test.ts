import { describe, expect, it } from "vitest";
import { departmentFromSlug, departmentSlug } from "./departments";

describe("departmentSlug", () => {
  it("lower-cases the department name", () => {
    expect(departmentSlug("HR")).toBe("hr");
    expect(departmentSlug("Operations")).toBe("operations");
  });
});

describe("departmentFromSlug", () => {
  it("finds a department whatever the case", () => {
    expect(departmentFromSlug("hr")).toBe("HR");
    expect(departmentFromSlug("HR")).toBe("HR");
    expect(departmentFromSlug("finance")).toBe("Finance");
  });

  it("returns undefined for an unknown slug", () => {
    expect(departmentFromSlug("legal")).toBeUndefined();
  });
});
