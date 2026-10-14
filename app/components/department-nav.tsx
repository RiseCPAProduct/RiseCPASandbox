"use client";

import type { Department, DocumentItem, StandardFolder } from "@/lib/placeholder-documents";
import { getDepartmentFolders, getDepartments, type SearchFilters as Filters } from "@/lib/search";

type Props = {
  // Items the current role may see; counts are derived from these.
  items: DocumentItem[];
  filters: Filters;
  onSelect: (department: Department | "all", folder: StandardFolder | "all") => void;
};

// Cards for now; kept as its own component so the format can change
// once Eric confirms a preference.
export default function DepartmentNav({ items, filters, onSelect }: Props) {
  const departments = getDepartments(items);
  const hasDepartment = filters.department !== "all";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-brand-charcoal">Open a department or jump straight to one of its folders.</p>
        {hasDepartment && (
          <button
            type="button"
            onClick={() => onSelect("all", "all")}
            className="rounded px-2 py-1 text-sm font-medium text-brand-green hover:bg-brand-green/10"
          >
            All departments
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {departments.map((department) => {
          const folders = getDepartmentFolders(items, department);
          const total = items.filter((item) => item.department === department).length;
          const selected = filters.department === department;
          return (
            <div
              key={department}
              className={`rounded-lg border bg-white p-4 shadow-sm transition-colors ${
                selected ? "border-brand-green ring-2 ring-brand-green/30" : "border-zinc-200 hover:border-brand-green"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(department, "all")}
                aria-pressed={selected}
                className="flex w-full items-baseline justify-between rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50"
              >
                <span className="font-heading text-lg font-bold text-brand-charcoal">{department}</span>
                <span className="text-xs text-zinc-500">
                  {total} {total === 1 ? "item" : "items"}
                </span>
              </button>
              <ul className="mt-3 space-y-1">
                {folders.map(({ folder, count }) => {
                  const folderSelected = selected && filters.folder === folder;
                  return (
                    <li key={folder}>
                      <button
                        type="button"
                        onClick={() => onSelect(department, folder)}
                        aria-pressed={folderSelected}
                        className={`flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm hover:bg-brand-green/10 ${
                          folderSelected ? "bg-brand-green/15 font-medium text-zinc-900" : "text-brand-charcoal"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-brand-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                          </svg>
                          {folder}
                        </span>
                        <span className="text-xs text-zinc-500">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
