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

## 2026-10-10 — Search results become a 5-column table (updates "Each result shows type, department, path and modified date")
**Context:** In Meeting 3, Eric chose a table view for results with the columns Name, Type, Department, Publishing month/year and Last updated date (DISCOVERY.md, Meeting 3, sections 2 and 7). The team's mockup shows that layout.
**Decision:** Replace the `<ul>` list with a semantic `<table>` in a new `ResultsTable` component, with the columns Name, Type, Department, Published and Last Update. The Name cell keeps the type icon and shows the folder path as grey subtext. The table scrolls horizontally inside its container on narrow screens, and the page container gets wider to fit five columns.
**Alternatives considered:** Matching the mockup exactly with no icon or path (path helps staff tell same-named files apart, e.g. several "Budget" items). A CSS grid styled as a table (loses native table semantics for screen readers). Stacked cards on mobile (more code. Horizontal scroll is enough for a desktop-first intranet).

## 2026-10-10 — Two dates per item: `published` (YYYY-MM) and `modified` (YYYY-MM-DD)
**Context:** The table needs both a publishing month/year and a last-updated date. Until now each item had a single `modified` date.
**Decision:** Add `published` as a year-month string and keep `modified` as the full last-update date. The Year filter keeps using the `modified` year, because Eric confirmed that "year modified" is the most useful filter. Placeholder data keeps `published` on or before `modified`.
**Alternatives considered:** Renaming the existing date to `published` and inventing a new `modified` (more churn for the same result). Keeping one date and formatting it two ways (both columns would always show the same month, which defeats the point). Filtering by published year (doesn't match what Eric asked for).

## 2026-10-10 — Date display variation
**Context:** The mockup shows variations in format for published and modified documents. The team chose month and year for Last Update.
**Decision:** `formatPublished` returns "YYYY Mon", and `formatModified` returns "Month YYYY". Both are pure functions in `lib/format-date.ts` that use fixed month-name arrays, so server and client render identical text.
**Alternatives considered:** Relative times such as "2m ago" (needs a timestamp and a client-only clock, risks hydration mismatches, and the data has no times). "Oct 29" (month and day without a year is ambiguous across years, which is the outdated-file problem the client wants to avoid). `Intl.DateTimeFormat` (output depends on locale and runtime).

## 2026-10-10 — Clicking Type, Department or Last Update applies that filter
**Context:** The mockup shows these cells in blue, like links. Staff browsing results often want "more like this".
**Decision:** These cells are buttons that set the matching filter (Type, Department, or the Year of `modified`) through a pure `applyFilter` helper in `lib/search.ts`, using the existing filter state in `SearchBar`. Published stays plain text, because there is no published filter and clicking it to set the modified year would be misleading.
**Alternatives considered:** Styling only (looks clickable but does nothing). Making Published clickable to set the year (it would filter on a different date than the one clicked). Adding a separate published-year filter (no client request for it).

## 2026-10-10 — Add Vitest for Phase 3 (follows "Phase 2 still verified without a test framework")
**Context:** CLAUDE.md requires TDD, and the earlier decision said to add Vitest if Phase 3 added more logic. Phase 3 adds date formatting, a second date field and a click-to-filter helper.
**Decision:** Add Vitest as a dev dependency with an `npm test` script. Write the tests for `lib/` functions first.
**Alternatives considered:** Another one-off verification script (doesn't support TDD and isn't repeatable). Jest (heavier setup with TypeScript and ESM. Vitest works with almost no config).

## 2026-10-10 — Both table dates show "Month YYYY" (updates "Date display variation")
**Context:** The previous entry used two formats: "YYYY Mon" for Published and "Month YYYY" for Last Update. The team wants one consistent format.
**Decision:** Published and Last Update both show the full month name and year, e.g. "January 2026", through a single pure `formatMonthYear` function in `lib/format-date.ts` that accepts YYYY-MM and YYYY-MM-DD.
**Alternatives considered:** Keeping two formats (inconsistent, and the columns look like different kinds of data). Abbreviated months such as "Jan 2026" (less clear for a broad audience, and the table has room for full names).

## 2026-10-10 — Sandbox the whole single-page hub, not just search (updates the Phase 1 to 2 goal)
**Context:** In Meeting 3, Eric asked for one unified page containing search, department navigation, a news hub, an HR chatbot, a OneDrive link and an onboarding guide, with role-based visibility. Testing features one at a time gives less useful feedback than showing the whole concept.
**Decision:** The implementation plan's goal is now a single-page hub prototype covering every Meeting 3 feature, built in Phases 4 to 10 after the table view. The previous search-only goal stays in the plan, labelled "Old goal". Everything still uses placeholder content.
**Alternatives considered:** Finishing search to production quality first (delays feedback on the overall layout, which Eric cares about most). Several separate pages (Eric explicitly prefers one page).

## 2026-10-10 — Chatbot is a scripted showcase, not a live AI service
**Context:** Discovery says the chatbot should answer HR policy questions only, and confidentiality is a firm boundary. The sandbox needs to show the experience, not prove a model integration.
**Decision:** A keyword-matched `answerQuestion` function over fictional policy entries in `lib/mock-hr-policy.ts`, demoed with a "vacation in Fiji" script that returns the vacation policy and links to the Vacation Request Form. It runs entirely in the browser.
**Alternatives considered:** A real Claude API route (needs an API key and costs money, and adds a server boundary and data-handling questions before the UX is validated). A static mock with no working input (doesn't let Eric or staff try their own questions).

## 2026-10-10 — Demo role switcher for role-based visibility
**Context:** Staff, managers and partners should see different content, and restricted items must be fully hidden (Meeting 3, sections 3 and 5). The sandbox has no auth.
**Decision:** Items get a `visibility` level (`staff`, `manager`, `partner`), and a clearly labelled "Viewing as" switcher (default Staff) filters items before search, filter options, counts and department navigation are calculated, so hidden items leave no trace.
**Alternatives considered:** Real authentication (out of scope for a placeholder sandbox). Greyed-out or locked items (Eric explicitly rejected this). Filtering only the search results (counts and filter options would still give away restricted items).

## 2026-10-10 — Department navigation uses cards for now
**Context:** Eric likes navigating by department but hasn't confirmed a format (Meeting 3 follow-up). The team needs something to build and demo now.
**Decision:** A responsive grid of department cards showing each department's standard folders. Clicking a card or folder sets the shared Department filter, so the search table updates. `DepartmentNav` is its own component, so it can be swapped later if Eric prefers another format.
**Alternatives considered:** A sidebar (takes width from the 5-column table and the chatbot). A header dropdown (hides departments behind a click, which is weaker for new employees). Waiting for Eric (holds up the hub demo).

## 2026-10-10 — Closable latest-news banner at the top of the hub
**Context:** On a single page, the News section sits below search and departments, so staff may scroll past firm news. The team wants to show Eric a "shopping sale banner" concept that keeps staff up to date.
**Decision:** A slim banner above the header shows the newest news item, with a "Read more" link that scrolls to the News section and an X to close it. The dismissed item's id is saved in `localStorage`, so a newer item brings the banner back. It renders only after the client has checked storage, to avoid a flash or hydration mismatch. It's presented to Eric as an optional concept.
**Alternatives considered:** No banner (news is easy to miss on a long page). A modal or toast popup (more intrusive, which suits an intranet home page poorly). Remembering dismissal permanently (staff would never see later news). Not remembering dismissal (the banner would come back on every visit, which is annoying).

## 2026-10-10 — Shared hub state lives in a client `HubShell` (updates "Filter options come from the data; filter state lives in SearchBar")
**Context:** Department cards, the chatbot's document links and the role switcher all need to change the search query and filters that `SearchBar` used to own.
**Decision:** A client `HubShell` component (`app/components/hub-shell.tsx`) owns the role, query and filters. `SearchBar` is now controlled through props. `page.tsx` stays a Server Component that renders the header, the banner and `HubShell`, and passes the server-rendered `NewsHub` in as a prop. Changing role resets the filters, because the options can differ per role.
**Alternatives considered:** URL search params (shareable links, but more wiring than a demo needs, and still worth revisiting later). React context (adds indirection for a single page with one owner).

## 2026-10-10 — Folder filter added for department cards
**Context:** Clicking a folder on a department card (e.g. HR > Budget) needs to narrow the table to that folder.
**Decision:** Add a `folder` filter (Budget / Minutes / Projects / Published Documents) and a matching "Folder" dropdown, so the narrowed state is visible and can be cleared like the other filters. An item's folder is the second segment of its path.
**Alternatives considered:** Matching the path text in the search box (mixes navigation with search, and "Budget" would also match names). A hidden folder state with no dropdown (staff couldn't see why results were narrowed).

## 2026-10-10 — Stored UI state read with `useSyncExternalStore`
**Context:** The banner and the onboarding guide remember their dismissal in `localStorage`, which the server can't read. The project's Next.js guide warns that reading it during render causes hydration errors, and setting state in an effect causes a flash.
**Decision:** A `useStoredValue` hook (`app/hooks/use-stored-value.ts`) returns `undefined` on the server and during hydration, and the stored value afterwards. Both components render nothing while the value is `undefined`. Reads and writes are wrapped in try/catch, with an in-memory fallback so dismissal still works when storage is blocked.
**Alternatives considered:** An inline pre-paint script (no pop-in, but more complex for two optional panels). `useEffect` + `useState` (flash, and the lint rules discourage setting state in effects).

## 2026-10-10 — Hub verified in the browser with Edge and playwright-core
**Context:** The plan asks for checks in `npm run dev`, but the repo has no browser test tooling.
**Decision:** Drive the dev server once with `playwright-core` (installed outside the repo) using the installed Microsoft Edge. Desktop and 375px screenshots were checked, along with these interactions: banner close and reload, budget table, cell filters, department card, Fiji chat, off-topic fallback and role switching. There were no console errors. Nothing was added to the project.
**Alternatives considered:** Adding Playwright as a project dependency with E2E tests (worth doing if the prototype moves past the pitch stage).

## 2026-10-15 — Restored package.json dev dependencies
**Context:** The "update document files" commit removed the `lint` script and the `tailwindcss`, `@tailwindcss/postcss`, `eslint` and `eslint-config-next` dev dependencies, so a fresh clone couldn't style pages or run lint. Phase 11 was ticked, but Fluent UI wasn't in `package.json`.
**Decision:** Restore `package.json` from the commit before, then add `@fluentui/react-components` (9.74.11) and `@fluentui/react-icons` (2.0.344), pinned to exact versions.
**Alternatives considered:** Leaving lint out (the `/done` gate needs it).

## 2026-10-15 — Fluent UI v9 with a RISE CPA brand ramp, Tailwind for layout only
**Context:** Eric approved a Microsoft component library so the prototype can be recreated in SharePoint (Meeting 4, section 7).
**Decision:** `lib/fluent-theme.ts` defines a 16-shade green ramp with `#87B04B` as shade 80 and builds `riseLightTheme` with `createLightTheme`, using Open Sans as the base font. Because `#87B04B` gives about 2.4:1 contrast with white, filled buttons and brand text use shade 60 (`#4E7027`). `app/providers.tsx` renders Fluent's styles during server rendering with `createDOMRenderer`, `renderToStyleElements` and `useServerInsertedHTML`. Controls come from Fluent; Tailwind handles layout and spacing. Layout classes sit on a div inside `FluentProvider`, because Fluent copies the provider's className onto every portal (dropdowns, dialogs), and a full-height class there covered the page.
**Alternatives considered:** Using `#87B04B` for filled buttons (fails WCAG contrast). Fluent's default blue theme (doesn't look like RISE CPA).

## 2026-10-15 — Tabs are routes; header tabs navigate with the router
**Context:** The hub becomes five tabs (Meeting 4, sections 1 and 9).
**Decision:** One route per tab (`/`, `/search`, `/departments`, `/departments/[department]`, `/calendar`, `/help`). The header uses a Fluent `TabList` whose selection calls `router.push`, with the selected tab from `activeTab(pathname)` in `lib/nav.ts`. Department pages are prerendered with `generateStaticParams`, and an unknown slug calls `notFound()`.
**Alternatives considered:** Client-side tab state on one page (no shareable URLs, and Back doesn't work). Styling Next.js links to look like tabs (loses Fluent's tab look and keyboard behaviour).

## 2026-10-15 — Demo role in a root-layout context (replaces HubShell)
**Context:** The "Viewing as" role must survive switching tabs.
**Decision:** `DemoRoleProvider` in the root layout holds the role and exposes the role-filtered items, so every tab works from items the role may see. `HubShell` was deleted. The role resets on a full page reload, which is fine for a demo.
**Alternatives considered:** Saving the role in `localStorage` (a presenter could forget they left it on Partner).


## 2026-10-15 — Search state lives in the URL, updated with the native history API
**Context:** `/search?department=HR&folder=Budget` should open pre-filtered, and Back should undo a filter.
**Decision:** `filtersFromParams` / `filtersToParams` (`lib/search-params.ts`) convert between the URL and the search state; unknown values fall back to "all". `useUrlSearchState` reads `useSearchParams` and writes with `window.history.pushState` for filters and `replaceState` for typing, which Next.js syncs with `useSearchParams`. The search box keeps its own text and follows the URL when it changes elsewhere. Pages that read the URL are wrapped in `Suspense`, as the Next.js docs require for static pages.
**Alternatives considered:** `router.push` on every keystroke (refetches the route, so typing lags). Local state only (no shareable links).

## 2026-10-15 — Department sidebar is a Fluent OverlayDrawer, not NavDrawer
**Context:** Eric wants a pop-out left sidebar plus landing-page cards (Meeting 4, section 5).
**Decision:** A menu button in the header opens an `OverlayDrawer` listing role-visible departments and their folders as Next.js links, so the role survives navigation. Cards and folders link to `/departments/<slug>?folder=<Folder>`.
**Alternatives considered:** `NavDrawer` (its items are built for Fluent's own navigation state and don't fit Next.js links as easily). An always-visible sidebar (takes width from the 5-column table).

## 2026-10-15 — File overview in a side drawer
**Context:** The lo-fi shows a file's details before opening it.
**Decision:** Selecting a file name opens an end-side `OverlayDrawer` (`min(100vw, 26rem)` wide, so full width at 375px) with type, department, location, published and last update, plus a disabled "Open file (demo)" button.
**Alternatives considered:** An inline expanding row (cramped inside a horizontally scrolling table).

## 2026-10-15 — Floating Ask HR uses a chat reducer and a non-modal panel
**Context:** Section 6 asks for a floating corner button with a clear/reset button and no edit-message control.
**Decision:** `chatReducer` (`lib/chat.ts`) has `send`, `reply` and `reset` actions; `send` and `reply` are separate so the UI can show the typing indicator between them. The panel is a non-modal dialog fixed bottom-right (a bottom sheet at 375px). Escape and the close button close it and return focus to the button. Suggested questions show until the first message.
**Alternatives considered:** A modal Fluent `Dialog` (blocks the page, but staff may want to read a document while asking). A `send` that adds the answer immediately (no conversational pause).

## 2026-10-15 — Rotating banner pauses on hover, focus and reduced motion
**Context:** The banner rotates through the three latest posts (section 3).
**Decision:** It moves every 6 seconds, with previous / next buttons and "n of 3". Rotation stops while the pointer or keyboard focus is on it, and never starts when `prefers-reduced-motion` is set (read with `useSyncExternalStore`, which reports "reduced" until the browser answers). While it rotates, its live region is off, so screen readers aren't interrupted every 6 seconds. Closing it stores the newest post's id, as before.
**Alternatives considered:** Rotating without pause controls (fails WCAG 2.2.2, Pause, Stop, Hide).

## 2026-10-15 — Calendar uses a fixed demo date
**Context:** Server and client must render the same month.
**Decision:** `DEMO_TODAY` (2026-10-01) sets the starting month and the upcoming events. `buildMonthGrid` uses UTC dates, so every time zone builds the same grid. There are two October events and eight November events, so both the first month and "Next month" have something to show. Days with events are buttons; other days aren't focusable.
**Alternatives considered:** The real date (the demo would show an empty month after November 2026).

## 2026-10-15 — Onboarding tour: first month, at most once a day
**Context:** Section 2: show the guide during the first month, then stop; the fallback is first login only, reopenable.
**Decision:** `shouldShowOnboarding` shows the tour from the first visit through day 30 unless "Don't show again" was chosen. The provider also stores the date it last opened by itself, so it opens at most once a day rather than on every reload. The Help page can reopen it and has demo controls ("Reset onboarding", "Pretend it's day 31"). The first-visit date uses the browser's local date. `docs/FEASIBILITY.md` explains why real use needs per-user storage.
**Alternatives considered:** Opening on every page load in the first month (became annoying in testing).

## 2026-10-15 — Verified with headless Edge; security-auditor agent not available
**Context:** Phase 22 asks for a full walk-through and an OWASP check with the `security-auditor` agent.
**Decision:** The walk-through was scripted with `playwright-core` (installed outside the repo, as before) against `npm run dev`: 45 checks at 1280px and 375px, with no console errors other than the expected 404 for an unknown department. No `security-auditor` agent is defined in this project, so that check is still open. The app has no back end, sign-in or secrets, sends no user input anywhere, and its only external link uses `rel="noopener noreferrer"`.
**Alternatives considered:** Adding Playwright to the project (still worth doing if the prototype moves past the pitch stage).


## 2026-10-28 — Rise/Folio in three phases, publishing first
**Context:** The product moved from an intranet site to a publishing and findability app (DISCOVERY.md, "Rise/Folio MVP"). The team asked for few phases, starting with publishing, and for real AI calls so feasibility can be judged.
**Decision:** Phase 23 builds the pipeline (Submit -> Partner approval -> Smart Publish) with AI; Phase 24 adds firm settings, in-app notifications, What's New and the document record; Phase 25 adds Smart File for client documents and the AI sensitivity check. Ask the Library (extra AI cost item) and Supabase are left for later.
**Alternatives considered:** One phase per MVP screen (12+ phases, which the team didn't want).

## 2026-10-28 — AI behind one server-side provider interface, Claude now, Gemini Flash-Lite by env var
**Context:** Good Company plans Gemini Flash-Lite (MVP section 10); for now the prototype uses Claude, and swapping should be simple.
**Decision:** Every AI call runs in a Route Handler on the server. `lib/ai/provider.ts` defines `AiProvider.generate({ system, prompt, schema })`, which returns JSON already matching a zod schema. `ClaudeProvider` uses the official `@anthropic-ai/sdk` with structured outputs (`messages.parse` + `betaZodOutputFormat`), low effort, and the server-side refusal fallback. `lib/ai/index.ts` picks the provider from `AI_PROVIDER`; `lib/ai/gemini.ts` is the swap point with the `@google/genai` call written out. Tasks (`lib/ai/tasks.ts`) build prompts and then validate every value against the firm's rules, dropping anything not in the lists and flagging low confidence for the form to highlight. With no key, the AI buttons explain why and every form works by hand.
**Alternatives considered:** Calling the AI from the browser (exposes the key). A multi-provider SDK such as the Vercel AI SDK (one more abstraction to learn and keep current; our interface is about 20 lines and ports directly to a Supabase Edge Function). Free-text answers parsed by hand (fragile; structured outputs guarantee the shape).

## 2026-10-28 — Default model claude-opus-5-5, overridable with AI_MODEL
**Context:** Flash-Lite is a small, cheap model; a fair cost comparison needs a similar tier.
**Decision:** Default to `claude-opus-5-5` and let `AI_MODEL` override it. `claude-haiku-5-5` is the closest tier to Flash-Lite for a like-for-like cost and speed test. The choice is the team's once real usage is measured.
**Alternatives considered:** Hard-coding a smaller model (a cost decision nobody has made yet).

## 2026-10-28 — In-memory store behind service functions; Supabase later
**Context:** Henry wants a real back end, but there is no Supabase project or credentials yet.
**Decision:** `lib/publishing/service.ts` holds all back-end rules as plain functions over a `PublishingStore` (submissions, notifications, client files, config). Route Handlers in `app/api/` call them. The store lives on `globalThis` per server process, is seeded with demo data, and resets on restart. Supabase replaces the store without changing the routes or UI.
**Alternatives considered:** A JSON file on disk (survives restarts, but invites concurrent-write bugs and still isn't the target database). Supabase now (blocked on an account and keys).

## 2026-10-28 — The server enforces the workflow; the browser only asks
**Context:** Key rule: nobody writes directly to the Published folder, and publishing needs partner approval.
**Decision:** `lib/publishing/workflow.ts` is a pure state machine with role rules (Partner reviews, Manager publishes, only the submitter resubmits, Supersede is system-only). On publish the server rebuilds the name, version and folder from the firm's template, retires the replaced version, and creates the notification. The demo role travels in an `x-demo-role` header; with real sign-in the session replaces it and nothing else changes. Staff see only their own submissions; queues return 403 to other roles. In the demo one partner reviews every department; with sign-in the review queue filters on the responsible partner.
**Alternatives considered:** Trusting a file name built in the browser (anyone could publish any name).

## 2026-10-28 — Pipeline documents join search through /api/library
**Context:** Published documents must appear in search, department pages and counts, hidden above the viewer's level.
**Decision:** `DemoRoleProvider` fetches `/api/library` for the current role and appends those items to the placeholder items, so every existing screen picks them up. The server filters by audience before sending, so hidden documents never reach the browser. Search shows the generated file name (e.g. `HR_Policy_VacationPolicy_v4_2026-11`).
**Alternatives considered:** Moving all placeholder documents into the store (more churn than this phase needs).

## 2026-10-28 — Replacement matching works without AI
**Context:** "Replaces existing document?" should be suggested, and the product must work without AI.
**Decision:** `findReplacementCandidates` scores published documents in the same department by shared title words, counting generic type words such as "form" or "policy" at half weight. Smart Publish shows the top match as a hint; with AI on, the AI picks from the same candidate list and any id outside it is dropped.
**Alternatives considered:** AI only (no hint when AI is off).

## 2026-10-28 — Settings: partners only, validated on the server, applies to the next publish
**Context:** Section 4 gives partners or managers with admin ability control over publishing rules.
**Decision:** Partners can edit document types (one word each), the naming template (must include {TITLE}, only known tokens, no characters invalid in file names), default audience, lead partners and both AI toggles. Names already published don't change.
**Alternatives considered:** A separate admin flag per person (no sign-in yet to attach it to).

## 2026-10-28 — Notifications: "seen" is per browser
**Context:** In-app notifications replace the firm-wide email.
**Decision:** A bell in the header lists publishes the role may see, with an unread count since the bell was last closed, stored with `useStoredValue`. Real use needs per-user storage, like the onboarding rule.
**Alternatives considered:** Server-side read state (needs real users).

## 2026-10-28 — Smart File: client team only, AI reads the file name only and starts off
**Context:** Section 6: client files need no approval, but confidentiality is a firm boundary.
**Decision:** Client files get their own template (`ACME-LTD_2026_T2_Bank-Statements_Dec`), folder (Client / Year / Engagement) and a duplicate check that asks before adding a new version. Only the client team and partners see a client's files; others get nothing back, not a locked item. The client-file AI toggle is off by default and, when on, sends only the file name and the clients the person is on the team for. Marking a file final locks it.
**Alternatives considered:** Reading client file contents with AI (crosses the confidentiality boundary the firm set).

## 2026-10-28 — Sensitivity check is advisory
**Context:** Stretch feature: flag content that doesn't match the chosen audience.
**Decision:** A button on Smart Publish runs the check for the audience currently chosen and shows concerns and a suggested audience. It never blocks publishing.
**Alternatives considered:** Blocking publish on a flag (an AI false positive would stop real work).

## 2026-10-29 — Scripted demo AI when no key is set
**Context:** The team showcases the Publishing tab without an Anthropic key, so every AI button said "No AI key is configured" and the Settings switches seemed to do nothing.
**Decision:** Add a `DemoProvider` behind the existing `AiProvider` interface. Each task passes a rule-based demo answer (keyword matching on the title, description, file name and excerpt) along with its prompt; the demo provider returns it after a short delay, and real providers ignore it. The answer still goes through the task's zod schema and the firm-rule validators, so the form behaves exactly as with real AI. `getAiProvider()` uses it when no key is set or `AI_PROVIDER=demo`; a key switches back to Claude. The UI labels demo suggestions as scripted.
**Alternatives considered:** Hard-coding answers in the UI (bypasses the validators and Settings switches, and would be thrown away later). A separate demo branch in each route (four copies of the same logic). Removing the Claude provider (loses the swap point the team already decided on).

## 2026-10-29 — News hub, Calendar and OneDrive button removed
**Context:** The product is now a publishing and findability app (Rise/Folio). The firm News hub and banner (Phase 17), the Calendar tab (Phase 18) and the OneDrive button (Phase 20) are no longer part of it.
**Decision:** Remove them with their data and helpers. The date helpers onboarding still needs move to `lib/dates.ts`. What's New on Home stays, because it lists publishes from the pipeline, not firm news. Ask HR stays. Earlier write-ups in FEASIBILITY.md are left as the record of what was considered.
**Alternatives considered:** Hiding them behind a flag (keeps code nobody maintains).
