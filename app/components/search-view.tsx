"use client";

import { useState } from "react";
import { SearchBox } from "@fluentui/react-components";
import { hasActiveFilters, NO_FILTERS, searchDocuments } from "@/lib/search";
import { useUrlSearchState } from "../hooks/use-url-search-state";
import { useDemoRole } from "./demo-role";
import FileOverview from "./file-overview";
import FilterBar from "./filter-bar";
import ResultsTable from "./results-table";

export default function SearchView() {
  const { items } = useDemoRole();
  const [{ query, filters }, setSearch] = useUrlSearchState();
  const [selectedId, setSelectedId] = useState<string>();
  // The box keeps its own text so typing never fights the URL update; it
  // follows the URL when that changes from elsewhere (Back, a link).
  const [draft, setDraft] = useState(query);
  const [urlQuery, setUrlQuery] = useState(query);
  if (query !== urlQuery) {
    setUrlQuery(query);
    setDraft(query);
  }

  const results = searchDocuments(items, query, filters);
  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery || hasActiveFilters(filters);
  const selected = items.find((item) => item.id === selectedId);

  return (
    <div>
      <SearchBox
        size="large"
        className="w-full max-w-none!"
        aria-label="Search documents and folders"
        placeholder="Search all departments, e.g. budget, policy, template"
        value={draft}
        onChange={(_, data) => {
          setDraft(data.value);
          setUrlQuery(data.value);
          setSearch({ query: data.value, filters }, { replace: true });
        }}
      />

      <FilterBar
        items={items}
        filters={filters}
        onChange={(next) => setSearch({ query, filters: next })}
        onClear={() => setSearch({ query, filters: NO_FILTERS })}
        canClear={hasActiveFilters(filters)}
      />

      <div className="mt-4" aria-live="polite">
        {showResults ? (
          <>
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
              <ResultsTable
                results={results}
                filters={filters}
                onFilterChange={(next) => setSearch({ query, filters: next })}
                selectedId={selectedId}
                onSelect={(item) => setSelectedId(item.id)}
              />
            )}
          </>
        ) : (
          <p className="text-sm text-brand-charcoal">Type a name or pick a filter to see documents from every department.</p>
        )}
      </div>

      <FileOverview item={selected} onClose={() => setSelectedId(undefined)} />
    </div>
  );
}
