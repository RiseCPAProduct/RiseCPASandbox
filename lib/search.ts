import type { Department, DocumentItem, ItemType } from "./placeholder-documents";

export type SearchFilters = {
  department: Department | "all";
  type: ItemType | "all";
  year: number | "all";
};

export const NO_FILTERS: SearchFilters = { department: "all", type: "all", year: "all" };

export function hasActiveFilters(filters: SearchFilters): boolean {
  return filters.department !== "all" || filters.type !== "all" || filters.year !== "all";
}

// Parses the year numerically so dates that aren't zero-padded (e.g. 2026-1-24) still work.
export function getYear(item: DocumentItem): number {
  return Number(item.modified.split("-")[0]);
}

// Department options in the order they first appear in the data.
export function getDepartments(items: DocumentItem[]): Department[] {
  return [...new Set(items.map((item) => item.department))];
}

// Year options, newest first.
export function getYears(items: DocumentItem[]): number[] {
  return [...new Set(items.map(getYear))].sort((a, b) => b - a);
}

// Case-insensitive match on the item name across every department, narrowed
// by any active filters. With no query and no filters, returns no results.
export function searchDocuments(
  items: DocumentItem[],
  query: string,
  filters: SearchFilters = NO_FILTERS,
): DocumentItem[] {
  const q = query.trim().toLowerCase();
  if (!q && !hasActiveFilters(filters)) return [];
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) &&
      (filters.department === "all" || item.department === filters.department) &&
      (filters.type === "all" || item.type === filters.type) &&
      (filters.year === "all" || getYear(item) === filters.year),
  );
}
