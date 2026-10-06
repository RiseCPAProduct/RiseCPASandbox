# Implementation Plan: Global Document & Folder Search Bar

Updated: 2026-10-01

Goal: a sandbox prototype that tests whether one global search bar can find any internal document or folder across all departments of the RISE CPA intranet, without drilling through folders. Discovery and user research show that finding a document takes staff 10 to 15 minutes, that new employees struggle most, and that the client ranks cross-department search as a top-priority feature. Everything uses placeholder content; there is no real storage, auth, or firm data.

Research references: docs/DISCOVERY.md (second client meeting, section 3), docs/USER_RESEARCH.md (2.1 Finding Information), docs/COMPETITIVE_MATRIX.md (Google Drive and Slack search).

## Phase 1 — Cross-department search with placeholder data

- [x] Create a placeholder dataset of about 15 fictional internal items across 4 departments (HR, Finance, Marketing, Operations). Use the client's standard folder structure (Department > Budget / Minutes / Projects / Published Documents), with each item having a name, a type (folder, PDF, Word, Excel), a department, a path, and a modified date. Include a "budget" item in at least 3 departments so cross-department results can be demonstrated.
- [x] Build a `SearchBar` client component that filters by name as the user types, ignores upper and lower case, and returns both documents and folders from every department
- [x] Show each result with a type icon, the name, the department, the folder path, and the modified date, plus a "No results" state
- [x] Apply basic RISE CPA branding to the search page (green #87B04B, charcoal #616261, white; Roboto Bold headings, Open Sans body; "RISE CPA" in capitals)
- [x] Replace the starter content on `app/page.tsx` with the search page
- [x] Log every decision made while sandboxing in `docs/DECISIONS.md` (Context / Decision / Alternatives considered)

## Phase 2 — Search filters (department, document type, year)

Research: docs/DISCOVERY.md (second client meeting, section 3, "Filter System & Criteria"). Staff should be able to narrow results to one department or search across all of them, filter by document type, and filter by year so they use current files rather than outdated ones.

- [x] Extend `lib/search.ts` so the search accepts optional department, type and year filters, applied together with the text query
- [x] Build a `SearchFilters` client component with three dropdowns (Department, Type, Year), each defaulting to "All", plus a "Clear filters" button
- [x] Derive the Department and Year options from the placeholder data so they stay in sync with it
- [x] Show results when either a query is typed or a filter is set, so staff can browse a department without typing
- [x] Add the filters to the search page under the search bar, with the result count reflecting the active filters
- [x] Log every decision made while sandboxing in `docs/DECISIONS.md`