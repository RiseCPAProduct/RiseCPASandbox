# Implementation Plan: RISE CPA Intranet Single-Page Hub Prototype

Goal (Updated Phase 3 onward): a sandbox prototype of the full RISE CPA intranet as one single-page hub, so Eric and staff can react to the whole concept rather than one feature. In Meeting 3, Eric asked for one unified page instead of several windows (docs/DISCOVERY.md, Meeting 3, sections 4 and 7). The page brings together global search with filters and a table view, department navigation, an announcements / news hub, an AI chatbot for HR policy questions, a personal OneDrive link, and an onboarding guide, with role-based visibility where restricted content is hidden rather than locked. Easier navigation and faster access to information are still the top priorities. Everything uses placeholder content; there is no real storage, auth, AI service, or firm data.

Old goal (Phases 1 to 2): a sandbox prototype that tests whether one global search bar can find any internal document or folder across all departments of the RISE CPA intranet, without drilling through folders. Discovery and user research show that finding a document takes staff 10 to 15 minutes, that new employees struggle most, and that the client ranks cross-department search as a top-priority feature. Everything uses placeholder content; there is no real storage, auth, or firm data.

Research references: docs/DISCOVERY.md (second client meeting, section 3; Meeting 3, sections 2 to 7), docs/USER_RESEARCH.md (2.1 Finding Information), docs/COMPETITIVE_MATRIX.md (Google Drive and Slack search).

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

## Phase 3 — Table view with Published and Last Update dates

Research: docs/DISCOVERY.md (Meeting 3, section 2, "Table View Preference", and section 7). Eric asked for search results as a table with the columns Name, Type, Department, Published (month/year) and Last Update. He also confirmed that "year modified" is the most useful date filter. Each item gets two dates: `published` and `modified` (the last update). Both columns show month and year, e.g. "January 2026".

### 3a — Test setup

- [x] Add Vitest as a dev dependency with a `test` script in `package.json`, and confirm `npm test` runs with no tests
- [x] Check that `npm run lint` and `npm run build` still pass with the Vitest config in place

### 3b — Data model (tests first)

- [x] In `lib/placeholder-documents.ts`, add `published: string` (YYYY-MM) to `DocumentItem` and keep `modified: string` (YYYY-MM-DD) as the last-update date, with comments describing both
- [x] Give all 15 items a `published` month that is on or before their `modified` date. Spread `modified` dates across 2024 to 2026 so the Year filter and Last Update column show variety. This replaces the uncommitted `fin-1` date edit.
- [x] Write failing tests for `getYear` (still reads `modified`, including non-padded dates such as `2026-1-24`) and `getYears` (newest first), then make them pass

### 3c — Date formatting (tests first)

- [x] Write failing tests for `formatMonthYear` in `lib/format-date.ts`: `"2026-01"` returns `"January 2026"`, `"2026-10-29"` returns `"October 2026"`, and non-padded input (`"2026-1-24"`) returns `"January 2026"`
- [x] Implement `formatMonthYear` as one pure function with a fixed array of full month names (no `Intl` or locale, so server and client render the same text), and remove `formatDate` from `search-bar.tsx`

### 3d — Click-to-filter (tests first)

- [x] Write failing tests for a pure helper in `lib/search.ts` (e.g. `applyFilter(filters, key, value)`) that sets one filter and leaves the others unchanged, then implement it

### 3e — Table UI

- [x] Create a `ResultsTable` client component (`app/components/results-table.tsx`) that takes `results`, `filters` and `onFilterChange`
- [x] Render a semantic `<table>` with `<thead>` columns: Name, Type, Department, Published, Last Update
- [x] In the Name cell, show the type icon, the name (bold), and the folder path as small grey subtext
- [x] Render Type, Department and Last Update as blue text buttons that set the Type, Department and Year filters. Give each an `aria-label` such as "Filter by Excel". Published is plain text.
- [x] Show both Published and Last Update with `formatMonthYear` (e.g. "February 2026", "October 2026")
- [x] Match the mockup styling: grey header row, alternating row shading, brand-green hover, and the RISE CPA fonts and colours
- [x] Wrap the table in a horizontally scrollable container so it works at phone width without page-level horizontal scroll
- [x] Replace the `<ul>` results list in `search-bar.tsx` with `ResultsTable`, keeping the result count and the "No results" state

### 3f — Verify & log

- [x] Run `npm test`, `npm run lint` and `npm run build`, and check that all three pass
- [x] Check in `npm run dev` that "budget" shows a 5-column table, that clicking "Excel" / "Operations" / "October 2026" applies the matching filter, that "Clear filters" resets them, and that the layout works at 375px width
- [x] Log every decision made during this phase in `docs/DECISIONS.md`

## Phase 4 — Single-page hub layout

Research: docs/DISCOVERY.md (Meeting 3, section 4, "Unified Single-Page Layout").

- [x] Restructure `app/page.tsx` into a hub with clearly labelled sections: Search (top, full width), Departments, News, Ask HR (chatbot) and Getting Started (onboarding). Use placeholder panels for sections not built yet.
- [x] Widen the page container (e.g. `max-w-3xl` to `max-w-6xl`) and use a responsive grid: search full width, then a main column (departments, news) and a side column (chatbot), stacking to one column below the `lg` breakpoint
- [x] Create `lib/mock-user.ts` with a fictional signed-in user (e.g. first name "Antonio") and show a welcome message ("Welcome, Antonio") at the top of the hub, above the search section
- [x] Add a personal OneDrive button to the header (placeholder link to `https://onedrive.live.com`, opened in a new tab with `rel="noopener noreferrer"`)
- [x] Keep `page.tsx` a Server Component. Wrap only interactive sections in client components.
- [x] Check that lint and build pass, and that the layout works at 375px and desktop widths

## Phase 5 — Department navigation

Research: docs/DISCOVERY.md (Meeting 3, sections 2 and 4). Accessing a department's resources is the main workflow to prioritize. The format uses cards for now, until Eric confirms a format (Meeting 3 follow-up).

- [x] Write failing tests for a helper that lists a department's standard folders (Budget / Minutes / Projects / Published Documents) with item counts from the placeholder data, then implement it
- [x] Build a `DepartmentNav` component as a responsive grid of department cards (department name, item count, and its standard folders). Clicking a card sets the shared Department filter, so the search table shows that department's items, and clicking a folder narrows to that folder.
- [x] Highlight the selected card, and add a clear way back to all departments
- [x] Lift the search and filter state so `DepartmentNav` and `SearchBar` share it (e.g. a client `HubShell` wrapper or URL search params). Record the choice in `docs/DECISIONS.md`.
- [x] Verify in `npm run dev` that picking a department updates the table, and that "Clear filters" resets it

## Phase 6 — AI chatbot: scripted vacation showcase

Research: docs/DISCOVERY.md (first meeting, section 6, "AI chatbot"; Meeting 3, section 4). The chatbot answers HR policy questions only and takes no actions. For the sandbox it is a scripted showcase, with no AI service: an employee planning a vacation in Fiji asks about the vacation policy.

- [x] Create `lib/mock-hr-policy.ts` with fictional policy entries (vacation entitlement by role, notice period for requests, bereavement leave, expense reimbursement), each with keywords, an answer, and an optional linked document id from the placeholder data (e.g. the Vacation Request Form)
- [x] Write failing tests for `answerQuestion(text)`: "I'm planning a trip to Fiji, how much vacation do I get?" returns the vacation entry, matching ignores case, and an unrelated question returns a fallback telling the user what the bot can help with. Then implement it.
- [x] Build an `AskHrChat` client component: a message list, a text input, and suggested-question chips, with "I'm planning a vacation to Fiji. What's the vacation policy?" as the first chip
- [x] Show bot answers with a short delay and a typing indicator so the demo feels conversational, plus a link to the related document (e.g. Vacation Request Form)
- [x] Label the panel clearly as a demo with placeholder policy content, and say it answers questions only (it can't book vacation)
- [x] Verify the full Fiji script end to end in `npm run dev`, including the fallback for an off-topic question

## Phase 7 — News hub and latest-news banner

Research: docs/DISCOVERY.md (Meeting 3, section 4). Staff and client anniversaries, birthdays, and new blog posts (e.g. federal / provincial budget summaries). On a single page the News section sits further down, so a closable banner at the top (like a sale banner on a shopping site) keeps staff up to date on firm news without scrolling. This is a concept to show Eric, and it's easy to remove if he doesn't want it.

### 7a — News data and section

- [x] Create `lib/mock-news.ts` with about 6 fictional items across the types Anniversary, Birthday and Blog post, each with an id, title, date and short summary
- [x] Write failing tests for helpers that sort news newest first, limit the count, and return the single latest item, then implement them
- [x] Build a `NewsHub` component that shows the items as compact cards with a type label and a month-year date (reuse `formatMonthYear`). Give the section an `id="news"` anchor.

### 7b — Closable latest-news banner

- [x] Build a `NewsBanner` client component as a slim full-width bar above the header (brand-green background, white text) that shows the latest news item's type and title, a "Read more" link that scrolls to `#news`, and an X button with `aria-label="Dismiss announcement"`
- [x] Clicking X hides the banner. Save the dismissed item's id in `localStorage` (wrapped in try/catch), so the banner stays hidden for that item but appears again when a newer item is added.
- [x] Render nothing until the client has checked `localStorage`, so the banner never flashes or causes a hydration mismatch
- [x] Check that the banner wraps cleanly at 375px, and that it can be closed with the keyboard

## Phase 8 — Onboarding guide

Research: docs/DISCOVERY.md (Meeting 3, section 4, "Onboarding Guide"). New employees struggle most to find things.

- [x] Build a dismissible "Getting started" panel with 4 to 5 short steps (search, filters, departments, Ask HR, OneDrive)
- [x] Remember the dismissal in `localStorage` (wrapped in try/catch), with a "Show guide" link to bring it back

## Phase 9 — Role-based visibility

Research: docs/DISCOVERY.md (second meeting, section 2; Meeting 3, sections 3 and 5). Restricted content must be completely hidden, not greyed out or locked.

- [x] Add a `visibility` field to placeholder items (`staff`, `manager`, `partner`) and add a few restricted items (e.g. a partner-only HR pay summary and a manager-only coaching record)
- [x] Write failing tests for filtering items by role (Partner sees everything, Manager sees staff and manager items, Staff sees staff items only), and check that hidden items never appear in search results, filter options, counts or department navigation. Then implement that.
- [x] Add a clearly labelled "Viewing as" role switcher for the demo (Staff / Manager / Partner), defaulting to Staff
- [x] Verify in `npm run dev` that switching roles adds or removes the restricted items with no locked or greyed-out traces

## Phase 10 — Verify & prepare for feedback

- [x] Run `npm test`, `npm run lint` and `npm run build`, and check that all three pass
- [x] Walk through the main demo script in `npm run dev`: see "Welcome, Antonio", read and close the news banner, search "budget", filter by department, open a department card, ask the Fiji vacation question, switch roles
- [ ] Use the `security-auditor` agent for an OWASP check
- [x] Update `docs/DECISIONS.md` with every decision made in Phases 4 to 9
