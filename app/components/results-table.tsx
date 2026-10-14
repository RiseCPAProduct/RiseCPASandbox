"use client";

import type { DocumentItem, ItemType } from "@/lib/placeholder-documents";
import { formatMonthYear } from "@/lib/format-date";
import { applyFilter, getYear, type SearchFilters as Filters } from "@/lib/search";
import { TYPE_LABELS } from "./search-filters";

const TYPE_COLORS: Record<ItemType, string> = {
  folder: "text-brand-green",
  pdf: "text-red-600",
  word: "text-blue-600",
  excel: "text-emerald-700",
};

const FILTER_LINK_CLASS =
  "rounded text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50";

function TypeIcon({ type }: { type: ItemType }) {
  const className = `h-5 w-5 shrink-0 ${TYPE_COLORS[type]}`;
  if (type === "folder") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M6 3h8l5 5v13H6z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  results: DocumentItem[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
};

// Type, Department and Last Update cells are buttons that apply that filter.
export default function ResultsTable({ results, filters, onFilterChange }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-zinc-200 text-brand-charcoal">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Name</th>
            <th scope="col" className="px-4 py-3 font-semibold">Type</th>
            <th scope="col" className="px-4 py-3 font-semibold">Department</th>
            <th scope="col" className="px-4 py-3 font-semibold">Published</th>
            <th scope="col" className="px-4 py-3 font-semibold">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => {
            const year = getYear(item);
            const lastUpdate = formatMonthYear(item.modified);
            return (
              <tr key={item.id} className="border-t border-zinc-200 odd:bg-white even:bg-zinc-50 hover:bg-brand-green/10">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <TypeIcon type={item.type} />
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.path}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    className={FILTER_LINK_CLASS}
                    aria-label={`Filter by ${TYPE_LABELS[item.type]}`}
                    onClick={() => onFilterChange(applyFilter(filters, "type", item.type))}
                  >
                    {TYPE_LABELS[item.type]}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    className={FILTER_LINK_CLASS}
                    aria-label={`Filter by ${item.department}`}
                    onClick={() => onFilterChange(applyFilter(filters, "department", item.department))}
                  >
                    {item.department}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-charcoal">{formatMonthYear(item.published)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    className={FILTER_LINK_CLASS}
                    aria-label={`Filter by year ${year}`}
                    title={`Show items last updated in ${year}`}
                    onClick={() => onFilterChange(applyFilter(filters, "year", year))}
                  >
                    {lastUpdate}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
