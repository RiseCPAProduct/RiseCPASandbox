"use client";

import { useState } from "react";
import { placeholderDocuments, type ItemType } from "@/lib/placeholder-documents";
import { hasActiveFilters, NO_FILTERS, searchDocuments, type SearchFilters as Filters } from "@/lib/search";
import SearchFilters, { TYPE_LABELS } from "./search-filters";

const TYPE_COLORS: Record<ItemType, string> = {
  folder: "text-brand-green",
  pdf: "text-red-600",
  word: "text-blue-600",
  excel: "text-emerald-700",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Formats YYYY-MM-DD by hand so server and client render the same text.
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function TypeIcon({ type }: { type: ItemType }) {
  const className = `h-6 w-6 shrink-0 ${TYPE_COLORS[type]}`;
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

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const results = searchDocuments(placeholderDocuments, query, filters);
  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery || hasActiveFilters(filters);

  return (
    <div className="w-full">
      <label htmlFor="global-search" className="sr-only">
        Search documents and folders
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-charcoal"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all departments, e.g. budget, policy, template"
          autoComplete="off"
          className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-12 pr-4 text-base text-brand-charcoal shadow-sm outline-none placeholder:text-zinc-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      <SearchFilters filters={filters} onChange={setFilters} />

      {showResults && (
        <div className="mt-4" aria-live="polite">
          <p className="mb-2 text-sm text-brand-charcoal">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-brand-charcoal">
              {hasQuery
                ? <>No documents or folders match &quot;{query.trim()}&quot;{hasActiveFilters(filters) && " with these filters"}.</>
                : "No documents or folders match these filters."}
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {results.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-brand-green/5">
                  <TypeIcon type={item.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900">{item.name}</p>
                    <p className="truncate text-sm text-brand-charcoal">{item.path}</p>
                  </div>
                  <div className="shrink-0 text-right text-sm">
                    <span className="inline-block rounded-full bg-brand-green/15 px-2 py-0.5 text-xs font-medium text-brand-charcoal">
                      {item.department}
                    </span>
                    <p className="mt-1 text-brand-charcoal">
                      {TYPE_LABELS[item.type]} - {formatDate(item.modified)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
