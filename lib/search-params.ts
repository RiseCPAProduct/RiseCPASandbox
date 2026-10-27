import { DEPARTMENTS, ITEM_TYPES, STANDARD_FOLDERS } from "./placeholder-documents";
import { NO_FILTERS, type SearchFilters } from "./search";

export type SearchState = { query: string; filters: SearchFilters };

// URLSearchParams on the client, or the plain object a Page receives.
type ParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

function getParam(params: ParamsInput, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(options: readonly T[], value: string | undefined): T | "all" {
  return options.find((option) => option === value) ?? "all";
}

// Reads the search state from the URL. Anything unknown falls back to
// "all", so a hand-edited or stale link never breaks the page.
export function filtersFromParams(params: ParamsInput): SearchState {
  const year = Number(getParam(params, "year"));
  return {
    query: getParam(params, "q") ?? "",
    filters: {
      department: oneOf(DEPARTMENTS, getParam(params, "department")),
      folder: oneOf(STANDARD_FOLDERS, getParam(params, "folder")),
      type: oneOf(ITEM_TYPES, getParam(params, "type")),
      year: Number.isInteger(year) && year >= 1000 && year <= 9999 ? year : NO_FILTERS.year,
    },
  };
}

// The URL form of the search state, leaving out empty and "all" values.
export function filtersToParams({ query, filters }: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query);
  if (filters.department !== "all") params.set("department", filters.department);
  if (filters.folder !== "all") params.set("folder", filters.folder);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.year !== "all") params.set("year", String(filters.year));
  return params;
}
