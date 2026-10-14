import { describe, expect, it } from "vitest";
import { placeholderDocuments, type DocumentItem } from "./placeholder-documents";
import {
  applyFilter,
  filterByRole,
  getDepartmentFolders,
  getYear,
  getYears,
  NO_FILTERS,
  searchDocuments,
} from "./search";

function item(modified: string, overrides: Partial<DocumentItem> = {}): DocumentItem {
  return {
    id: modified,
    name: "Doc",
    type: "pdf",
    department: "HR",
    path: "HR",
    published: "2024-01",
    modified,
    visibility: "staff",
    ...overrides,
  };
}

describe("getYear", () => {
  it("reads the year from the modified date", () => {
    expect(getYear(item("2025-06-12", { published: "2023-01" }))).toBe(2025);
  });

  it("handles dates without zero-padding", () => {
    expect(getYear(item("2026-1-24"))).toBe(2026);
  });
});

describe("getYears", () => {
  it("lists unique years newest first", () => {
    expect(getYears([item("2024-03-01"), item("2026-01-01"), item("2024-09-09"), item("2025-05-05")])).toEqual([
      2026, 2025, 2024,
    ]);
  });
});

describe("placeholder data", () => {
  it("has a published month on or before each modified date", () => {
    for (const doc of placeholderDocuments) {
      const [py, pm] = doc.published.split("-").map(Number);
      const [my, mm] = doc.modified.split("-").map(Number);
      expect(py * 12 + pm, doc.id).toBeLessThanOrEqual(my * 12 + mm);
    }
  });

  it("spans 2024 to 2026 for the Year filter", () => {
    expect(getYears(placeholderDocuments)).toEqual([2026, 2025, 2024]);
  });

  it("includes restricted items for the role demo", () => {
    expect(placeholderDocuments.some((d) => d.visibility === "manager")).toBe(true);
    expect(placeholderDocuments.some((d) => d.visibility === "partner")).toBe(true);
  });
});

describe("applyFilter", () => {
  it("sets one filter and leaves the others unchanged", () => {
    const start = { ...NO_FILTERS, type: "excel" as const };
    expect(applyFilter(start, "department", "Finance")).toEqual({ ...NO_FILTERS, department: "Finance", type: "excel" });
    expect(applyFilter(start, "year", 2025)).toEqual({ ...NO_FILTERS, type: "excel", year: 2025 });
  });

  it("does not mutate the original filters", () => {
    const start = { ...NO_FILTERS };
    applyFilter(start, "type", "pdf");
    expect(start).toEqual(NO_FILTERS);
  });
});

describe("folder filter", () => {
  const items = [
    item("2026-01-01", { id: "a", path: "HR / Budget" }),
    item("2026-01-01", { id: "b", path: "HR / Minutes" }),
    item("2026-01-01", { id: "c", department: "Finance", path: "Finance / Budget" }),
    item("2026-01-01", { id: "d", path: "HR" }),
  ];

  it("keeps only items inside that standard folder", () => {
    const ids = searchDocuments(items, "", { ...NO_FILTERS, folder: "Budget" }).map((d) => d.id);
    expect(ids).toEqual(["a", "c"]);
  });

  it("combines with the department filter", () => {
    const ids = searchDocuments(items, "", { ...NO_FILTERS, department: "HR", folder: "Budget" }).map((d) => d.id);
    expect(ids).toEqual(["a"]);
  });
});

describe("getDepartmentFolders", () => {
  it("lists every standard folder with its item count", () => {
    const items = [
      item("2026-01-01", { path: "HR / Budget" }),
      item("2026-01-01", { path: "HR / Budget" }),
      item("2026-01-01", { path: "HR / Published Documents" }),
      item("2026-01-01", { department: "Finance", path: "Finance / Budget" }),
    ];
    expect(getDepartmentFolders(items, "HR")).toEqual([
      { folder: "Budget", count: 2 },
      { folder: "Minutes", count: 0 },
      { folder: "Projects", count: 0 },
      { folder: "Published Documents", count: 1 },
    ]);
  });
});

describe("filterByRole", () => {
  const items = [
    item("2026-01-01", { id: "s", visibility: "staff" }),
    item("2026-01-01", { id: "m", visibility: "manager" }),
    item("2026-01-01", { id: "p", visibility: "partner" }),
  ];
  const ids = (role: "staff" | "manager" | "partner") => filterByRole(items, role).map((d) => d.id);

  it("shows staff only staff items", () => {
    expect(ids("staff")).toEqual(["s"]);
  });

  it("shows managers staff and manager items", () => {
    expect(ids("manager")).toEqual(["s", "m"]);
  });

  it("shows partners everything", () => {
    expect(ids("partner")).toEqual(["s", "m", "p"]);
  });

  it("keeps hidden items out of years and folder counts", () => {
    const restricted = [
      item("2026-01-01", { path: "HR / Budget", visibility: "staff" }),
      item("2023-05-05", { path: "HR / Budget", visibility: "partner" }),
    ];
    const visible = filterByRole(restricted, "staff");
    expect(getYears(visible)).toEqual([2026]);
    expect(getDepartmentFolders(visible, "HR")[0]).toEqual({ folder: "Budget", count: 1 });
  });
});
