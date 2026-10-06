import { placeholderDocuments, type Department, type ItemType } from "@/lib/placeholder-documents";
import { getDepartments, getYears, hasActiveFilters, NO_FILTERS, type SearchFilters as Filters } from "@/lib/search";

export const TYPE_LABELS: Record<ItemType, string> = {
  folder: "Folder",
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
};

const DEPARTMENTS = getDepartments(placeholderDocuments);
const YEARS = getYears(placeholderDocuments);
const TYPES = Object.keys(TYPE_LABELS) as ItemType[];

const SELECT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

// Rendered inside SearchBar, which owns the filter state.
export default function SearchFilters({ filters, onChange }: Props) {
  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 text-xs font-medium text-brand-charcoal">
        Department
        <select
          className={`${SELECT_CLASS} mt-1`}
          value={filters.department}
          onChange={(e) => onChange({ ...filters, department: e.target.value as Department | "all" })}
        >
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
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
          {YEARS.map((y) => (
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
