# Decisions Log

## 2026-10-01 — Placeholder data uses internal department documents, not client files
**Context:** The first plan draft used client tax files (e.g. W-2s, client folders). Discovery shows the intranet is for internal documents (policies, templates, budgets, minutes), and real firm or client data is off-limits.
**Decision:** 15 fictional internal items across HR, Finance, Marketing and Operations, using the client's standard folder structure (Budget / Minutes / Projects / Published Documents). "Budget" appears in all 4 departments to demonstrate cross-department search. Stored as a static TypeScript array in `lib/placeholder-documents.ts`.
**Alternatives considered:** Client-file examples (wrong use case, confidentiality risk). 5 items (too few to show cross-department results). A JSON file or mock API (more setup with no benefit for a feasibility test).

## 2026-10-01 — Search runs client-side with a simple name match
**Context:** Phase 1 only needs to prove that a single search bar can find items across departments as the user types.
**Decision:** Filter the in-memory array on every keystroke with a case-insensitive substring match on the item name (`lib/search.ts`). An empty query shows no results.
**Alternatives considered:** A fuzzy-search library such as Fuse.js (adds a dependency before we know if typo tolerance matters). Matching on folder path too (makes "budget" return every item inside Budget folders, which is noisier). Server-side search or an API route (no real data source yet). Showing everything on an empty query (looks like a file browser, not a search).

## 2026-10-01 — Each result shows type, department, path and modified date
**Context:** The client wants future filters by department, document type and date modified, and staff need to tell current documents from outdated ones.
**Decision:** Each result row shows a type icon (folder, PDF, Word, Excel), the name, the folder path, a department tag, and the file type with its modified date. Icons are inline SVGs.
**Alternatives considered:** Name only (hides the information future filters depend on). An icon library (extra dependency for 2 icons). Emoji icons (CLAUDE.md bans special Unicode).

## 2026-10-01 — RISE CPA branding, light theme only
**Context:** The prototype is a pitch tool for the partners, so it should look like RISE CPA.
**Decision:** Brand colours as Tailwind tokens (`brand-green` #87B04B, `brand-charcoal` #616261, white), Roboto Bold for headings and Open Sans for body text via `next/font/google`, and a charcoal header showing "RISE CPA Intranet". The starter template's dark mode was removed.
**Alternatives considered:** Keeping dark mode (the brand is defined only on white, so it would need extra design work). Keeping the Geist starter fonts (off-brand).

## 2026-10-01 — Phase 1 verified without a test framework
**Context:** CLAUDE.md asks for TDD, but the repo has no test runner, and this is a feasibility sandbox.
**Decision:** Verify Phase 1 with lint, a production build, and a one-off script that runs `searchDocuments` against sample queries ("budget", "BUDGET", partial words, blank, no match). Revisit adding Vitest if the search logic grows (filters in a later phase).
**Alternatives considered:** Adding Vitest now (setup cost for a single 5-line function).

## 2026-10-01 — Sandbox work happens on feature branches
**Context:** This is a team repo, and `main` should stay clean.
**Decision:** Phase 1 is built on `feature/global-search` and merged through a PR (via `/done`).
**Alternatives considered:** Committing straight to `main` (no review for teammates).

## 2026-10-01 — Phase 1 moved to main (reverses "Sandbox work happens on feature branches")
**Context:** The team needs everything on the `main` branch for now.
**Decision:** The `feature/global-search` branch was deleted before anything was committed or pushed, and the Phase 1 work now lives on `main`.
**Alternatives considered:** Keeping the feature branch and merging through a PR (not what the team needs right now).

## 2026-10-01 — Filters are three single-select dropdowns: Department, Type, Year
**Context:** Phase 2. The client asked to filter search results by department, document type and date modified (DISCOVERY.md, second meeting, section 3). Staff have moderate tech comfort and already use filters in other software.
**Decision:** Three native dropdowns under the search bar, each defaulting to "All", plus a "Clear filters" button. All active filters combine with the text query (AND).
**Alternatives considered:** Multi-select checkboxes or chips (more flexible, but more UI than a feasibility test needs). A filter sidebar (takes space from results on a single-column page). A custom dropdown component (native selects are accessible out of the box).

## 2026-10-01 — Date filter works by year, not exact dates or months
**Context:** The client's examples were about telling years apart (e.g. 2026 vs 2027 budgets, records from 2015), so staff use current files rather than outdated ones.
**Decision:** A "Year modified" filter. The years are taken from the placeholder data and listed newest first. Years are parsed numerically, so dates without zero-padding (e.g. `2026-1-24`) still work.
**Alternatives considered:** A date-range picker (heavier UI, no clear need yet). Month plus year (the client mentioned months, but year is the main need; revisit after user testing).

## 2026-10-01 — Filters alone show results (updates "Search runs client-side with a simple name match")
**Context:** Phase 1 showed nothing for an empty query. With filters, staff may want to browse everything in a department (e.g. all of HR) without typing.
**Decision:** Results appear when a query is typed *or* any filter is set. With no query and no filters, nothing is shown, as before.
**Alternatives considered:** Requiring a query before filters apply (makes "show me all HR documents" impossible).

## 2026-10-01 — Filter options come from the data; filter state lives in SearchBar
**Context:** Options need to stay in sync with the placeholder data, and the search box and filters need shared state.
**Decision:** The Department and Year options are taken from the placeholder data, and the Type options come from the fixed type list. `SearchFilters` is its own component (`app/components/search-filters.tsx`), but `SearchBar` renders it and owns the state. `app/page.tsx` still renders only `SearchBar`, with an updated subtitle.
**Alternatives considered:** Hard-coded option lists (drift from the data). Rendering `SearchFilters` directly in `page.tsx` (the page is a Server Component, so it would need a new client wrapper or URL search params to share state; worth revisiting if filters need to be shareable links).

## 2026-10-01 — Phase 2 still verified without a test framework
**Context:** The earlier decision said to revisit Vitest once filters were added. The filter logic is still small and pure.
**Decision:** Verify with lint, a production build, and a one-off script covering 8 query and filter combinations. Defer Vitest again.
**Alternatives considered:** Adding Vitest now (reasonable next step if a Phase 3 adds more logic, or if the team wants CI tests).
