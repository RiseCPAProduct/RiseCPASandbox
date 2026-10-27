import type { Metadata } from "next";
import { Suspense } from "react";
import SearchView from "../components/search-view";

export const metadata: Metadata = { title: "Search - RISE CPA Intranet" };

export default function SearchPage() {
  return (
    <div>
      <h1 className="mb-4 font-heading text-3xl font-bold text-brand-charcoal">Find a document</h1>
      {/* SearchView reads the URL, so it renders in the browser. */}
      <Suspense fallback={<p className="text-sm text-brand-charcoal">Loading search...</p>}>
        <SearchView />
      </Suspense>
    </div>
  );
}
