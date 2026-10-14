import {
  STANDARD_FOLDERS,
  type Department,
  type DocumentItem,
  type ItemType,
  type StandardFolder,
} from "@/lib/placeholder-documents";
import { getDepartments, getYears, hasActiveFilters, NO_FILTERS, type SearchFilters as Filters } from "@/lib/search";

export const TYPE_LABELS: Record<ItemType, string> = {
  folder: "Folder",
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
};

const TYPES = Object.keys(TYPE_LABELS) as ItemType[];

const SELECT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30";

type Props = {
  // Items the current role may see; options are derived from these.
  items: DocumentItem[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

// Rendered inside SearchBar; HubShell owns the filter state.
export default function SearchFilters({ items, filters, onChange }: Props) {
  const departments = getDepartments(items);
  const years = getYears(items);

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-end">
      <label className="flex-1 text-xs font-medium text-brand-charcoal">
        Department
        <select
          className={`${SELECT_CLASS} mt-1`}
          value={filters.department}
          onChange={(e) => onChange({ ...filters, department: e.target.value as Department | "all" })}
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 text-xs font-medium text-brand-charcoal">
        Folder
        <select
          className={`${SELECT_CLASS} mt-1`}
          value={filters.folder}
          onChange={(e) => onChange({ ...filters, folder: e.target.value as StandardFolder | "all" })}
        >
          <option value="all">All folders</option>
          {STANDARD_FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 text-xs font-medium text-brand-charcoal">
        Type
        <select
          className={`${SELECT_CLASS} mt-1`}
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value as ItemType | "all" })}
        >
          <option value="all">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 text-xs font-medium text-brand-charcoal">
        Year modified
        <select
          className={`${SELECT_CLASS} mt-1`}
          value={String(filters.year)}
          onChange={(e) => onChange({ ...filters, year: e.target.value === "all" ? "all" : Number(e.target.value) })}
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => onChange(NO_FILTERS)}
        disabled={!hasActiveFilters(filters)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green hover:bg-brand-green/10 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-transparent"
      >
        Clear filters
      </button>
    </div>
  );
}
