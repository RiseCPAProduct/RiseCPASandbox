import {
  STANDARD_FOLDERS,
  type Department,
  type DocumentItem,
  type ItemType,
  type Role,
  type StandardFolder,
} from "./placeholder-documents";

export type SearchFilters = {
  department: Department | "all";
  folder: StandardFolder | "all";
  type: ItemType | "all";
  year: number | "all";
};

export const NO_FILTERS: SearchFilters = { department: "all", folder: "all", type: "all", year: "all" };

export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    filters.department !== "all" || filters.folder !== "all" || filters.type !== "all" || filters.year !== "all"
  );
}

// Sets one filter and keeps the rest, e.g. when a table cell is clicked.
export function applyFilter<K extends keyof SearchFilters>(
  filters: SearchFilters,
  key: K,
  value: SearchFilters[K],
): SearchFilters {
  return { ...filters, [key]: value };
}

const ROLE_RANK: Record<Role, number> = { staff: 0, manager: 1, partner: 2 };

// Removes items the role may not see. Run this before anything else
// (search, filter options, counts) so hidden items leave no trace.
export function filterByRole(items: DocumentItem[], role: Role): DocumentItem[] {
  return items.filter((item) => ROLE_RANK[item.visibility] <= ROLE_RANK[role]);
}

// Parses the year numerically so dates that aren't zero-padded (e.g. 2026-1-24) still work.
export function getYear(item: DocumentItem): number {
  return Number(item.modified.split("-")[0]);
}

// The standard folder an item sits in, e.g. "HR / Budget" -> "Budget".
function getFolder(item: DocumentItem): string | undefined {
  return item.path.split(" / ")[1];
}

// Department options in the order they first appear in the data.
export function getDepartments(items: DocumentItem[]): Department[] {
  return [...new Set(items.map((item) => item.department))];
}

// Year options, newest first.
export function getYears(items: DocumentItem[]): number[] {
  return [...new Set(items.map(getYear))].sort((a, b) => b - a);
}

// Every standard folder in a department with how many items it holds.
export function getDepartmentFolders(
  items: DocumentItem[],
  department: Department,
): { folder: StandardFolder; count: number }[] {
  const inDepartment = items.filter((item) => item.department === department);
  return STANDARD_FOLDERS.map((folder) => ({
    folder,
    count: inDepartment.filter((item) => getFolder(item) === folder).length,
  }));
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
      (filters.folder === "all" || getFolder(item) === filters.folder) &&
      (filters.type === "all" || item.type === filters.type) &&
      (filters.year === "all" || getYear(item) === filters.year),
  );
}
