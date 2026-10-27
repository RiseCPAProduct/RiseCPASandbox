"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem } from "@fluentui/react-components";
import { departmentHref } from "@/lib/departments";
import type { Department } from "@/lib/placeholder-documents";
import { NO_FILTERS, searchDocuments, type SearchFilters as Filters } from "@/lib/search";
import { useUrlSearchState } from "../hooks/use-url-search-state";
import { useDemoRole } from "./demo-role";
import FileOverview from "./file-overview";
import FilterBar from "./filter-bar";
import ResultsTable from "./results-table";

export default function DepartmentView({ department }: { department: Department }) {
  const router = useRouter();
  const { items } = useDemoRole();
  const [{ filters: urlFilters }, setSearch] = useUrlSearchState();
  const [selectedId, setSelectedId] = useState<string>();
  // The department comes from the path, never from the query string.
  const filters: Filters = { ...urlFilters, department };
  const results = searchDocuments(items, "", filters);
  const selected = items.find((item) => item.id === selectedId);
  const canClear = filters.folder !== "all" || filters.type !== "all" || filters.year !== "all";

  function update(next: Filters) {
    // A click on another department's cell isn't possible here, so only
    // the folder, type and year go into the URL.
    setSearch({ query: "", filters: { ...next, department: "all" } });
  }

  return (
    <div>
      <Breadcrumb aria-label="Location">
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => router.push("/departments")}>RISE CPA</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current={filters.folder === "all"} onClick={() => update({ ...filters, folder: "all" })}>
            {department}
          </BreadcrumbButton>
        </BreadcrumbItem>
        {filters.folder !== "all" && (
          <>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current>{filters.folder}</BreadcrumbButton>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>

      <h1 className="mt-2 font-heading text-3xl font-bold text-brand-charcoal">{department}</h1>

      <FilterBar
        items={items.filter((item) => item.department === department)}
        filters={filters}
        onChange={update}
        onClear={() => update(NO_FILTERS)}
        canClear={canClear}
        fields={["folder", "type", "year"]}
      />

      <div className="mt-4" aria-live="polite">
        <p className="mb-2 text-sm text-brand-charcoal">
          {results.length} {results.length === 1 ? "item" : "items"}
        </p>
        {results.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-brand-charcoal">
            Nothing in {department}
            {filters.folder !== "all" && ` / ${filters.folder}`} matches these filters.{" "}
            <Link href={departmentHref(department)} className="text-brand-green underline">
              Show everything in {department}
            </Link>
          </div>
        ) : (
          <ResultsTable
            results={results}
            filters={filters}
            onFilterChange={update}
            selectedId={selectedId}
            onSelect={(item) => setSelectedId(item.id)}
          />
        )}
      </div>

      <FileOverview item={selected} onClose={() => setSelectedId(undefined)} />
    </div>
  );
}
