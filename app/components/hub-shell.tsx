"use client";

import { useRef, useState, type ReactNode } from "react";
import { mockUser, ROLE_LABELS } from "@/lib/mock-user";
import { placeholderDocuments, type Role } from "@/lib/placeholder-documents";
import { filterByRole, NO_FILTERS, type SearchFilters as Filters } from "@/lib/search";
import AskHrChat from "./ask-hr-chat";
import DepartmentNav from "./department-nav";
import OnboardingGuide from "./onboarding-guide";
import SearchBar from "./search-bar";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

type Props = {
  // Server-rendered News section, passed in so it stays a Server Component.
  news: ReactNode;
};

// Owns the state shared across the hub: who is viewing, the search query and
// the filters. Everything below works from role-filtered items only, so
// restricted content is hidden rather than locked.
export default function HubShell({ news }: Props) {
  const [role, setRole] = useState<Role>(mockUser.role);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const searchRef = useRef<HTMLElement>(null);
  const items = filterByRole(placeholderDocuments, role);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeRole(next: Role) {
    setRole(next);
    // Options can differ per role, so start the filters fresh.
    setFilters(NO_FILTERS);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Welcome, {mockUser.firstName}</h1>
          <p className="mt-1 text-brand-charcoal">Everything you need at RISE CPA, in one place.</p>
        </div>
        <label className="text-xs font-medium text-brand-charcoal">
          Viewing as (demo)
          <select
            value={role}
            onChange={(e) => changeRole(e.target.value as Role)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30 sm:w-40"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <OnboardingGuide />

      <section ref={searchRef} aria-labelledby="search-heading" className="scroll-mt-4">
        <h2 id="search-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
          Find a document
        </h2>
        <SearchBar
          items={items}
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section aria-labelledby="departments-heading">
            <h2 id="departments-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
              Departments
            </h2>
            <DepartmentNav
              items={items}
              filters={filters}
              onSelect={(department, folder) => {
                setFilters({ ...filters, department, folder });
                if (department !== "all") scrollToSearch();
              }}
            />
          </section>

          <section id="news" aria-labelledby="news-heading" className="scroll-mt-4">
            <h2 id="news-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
              News
            </h2>
            {news}
          </section>
        </div>

        <section aria-labelledby="ask-hr-heading" className="lg:sticky lg:top-4 lg:self-start">
          <h2 id="ask-hr-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
            Ask HR
          </h2>
          <AskHrChat
            onOpenDocument={(name) => {
              setQuery(name);
              setFilters(NO_FILTERS);
              scrollToSearch();
            }}
          />
        </section>
      </div>
    </div>
  );
}
