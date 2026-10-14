"use client";

import type { DocumentItem } from "@/lib/placeholder-documents";
import { hasActiveFilters, searchDocuments, type SearchFilters as Filters } from "@/lib/search";
import ResultsTable from "./results-table";
import SearchFilters from "./search-filters";

type Props = {
  // Items the current role may see.
  items: DocumentItem[];
  query: string;
  onQueryChange: (query: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

// Controlled by HubShell so department cards and the chatbot can drive it.
export default function SearchBar({ items, query, onQueryChange, filters, onFiltersChange }: Props) {
  const results = searchDocuments(items, query, filters);
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
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search all departments, e.g. budget, policy, template"
          autoComplete="off"
          className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-12 pr-4 text-base text-brand-charcoal shadow-sm outline-none placeholder:text-zinc-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      <SearchFilters items={items} filters={filters} onChange={onFiltersChange} />

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
            <ResultsTable results={results} filters={filters} onFilterChange={onFiltersChange} />
          )}
        </div>
      )}
    </div>
  );
}
