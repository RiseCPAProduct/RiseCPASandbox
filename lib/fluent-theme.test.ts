import { describe, expect, it } from "vitest";
import { riseBrand, riseLightTheme } from "./fluent-theme";

describe("riseBrand", () => {
  it("has 16 shades", () => {
    expect(Object.keys(riseBrand)).toHaveLength(16);
  }); 
  it("uses the RISE CPA green as its primary shade", () => {
    expect(riseBrand[80].toUpperCase()).toBe("#87B04B");
  });
});

describe("riseLightTheme", () => {
  it("uses Open Sans as the base font", () => {
    expect(riseLightTheme.fontFamilyBase).toContain("Open Sans");
  });
});
