import { describe, expect, it } from "vitest";
import { NO_FILTERS } from "./search";
import { filtersFromParams, filtersToParams } from "./search-params";

describe("filtersFromParams", () => {
  it("reads the query and every filter", () => {
    const params = new URLSearchParams("q=budget&department=HR&type=excel&year=2026&folder=Budget");
    expect(filtersFromParams(params)).toEqual({
      query: "budget",
      filters: { department: "HR", type: "excel", year: 2026, folder: "Budget" },
    });
  });

  it("falls back to all for unknown values", () => {
    const params = new URLSearchParams("department=Legal&type=zip&year=soon&folder=Secret");
    expect(filtersFromParams(params)).toEqual({ query: "", filters: NO_FILTERS });
  });

  it("accepts a Next.js searchParams object", () => {
    expect(filtersFromParams({ q: ["budget", "x"], department: "Finance" })).toEqual({
      query: "budget",
      filters: { ...NO_FILTERS, department: "Finance" },
    });
  });
});

describe("filtersToParams", () => {
  it("leaves out empty and 'all' values", () => {
    expect(filtersToParams({ query: "", filters: NO_FILTERS }).toString()).toBe("");
  });

  it("round-trips through filtersFromParams", () => {
    const state = {
      query: "budget",
      filters: { department: "Operations" as const, type: "word" as const, year: 2025, folder: "Projects" as const },
    };
    expect(filtersFromParams(filtersToParams(state))).toEqual(state);
  });
});
