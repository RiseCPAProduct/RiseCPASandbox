# Implementation Plan: RISE CPA Intranet Single-Page Hub Prototype

Goal (Phase 11 onward): turn the single-page sandbox into the multi-tab hub from the team's lo-fi, which Eric preferred in Meeting 4 (docs/DISCOVERY.md, Fourth Meeting Summary, sections 1 and 9). "Single page" meant one browser window that replaces File Explorer, Teams and Outlook, not one scrolling page. The hub gets tabs for Home, Search, Departments, Calendar and Help, rebuilt with Microsoft's Fluent UI React v9 so it looks like it was made in SharePoint. Staff and managers/partners get different home pages: staff see a short set of key links (policies, SOPs, how-to guides, IT ticket guides), while managers and partners get department cards and a team section. Departments are also reachable from a collapsible left sidebar. The chatbot becomes a floating corner button with a reset option, the news banner rotates through the three latest posts, and a calendar shows firm and social events. The onboarding guide pops up during a user's first month and lives in full on a Help tab. The scope is still front end only, with placeholder content, no login and no back end. Department navigation and finding a file are the workflows that must work; the chatbot and OneDrive button can stay showcases. A feasibility write-up answers Eric's question about which features SharePoint can't support, plus the OneDrive, onboarding-timing and Gemini chatbot questions.

0ld Goal (Phase 3 onward): a sandbox prototype of the full RISE CPA intranet as one single-page hub, so Eric and staff can react to the whole concept rather than one feature. In Meeting 3, Eric asked for one unified page instead of several windows (docs/DISCOVERY.md, Meeting 3, sections 4 and 7). The page brings together global search with filters and a table view, department navigation, an announcements / news hub, an AI chatbot for HR policy questions, a personal OneDrive link, and an onboarding guide, with role-based visibility where restricted content is hidden rather than locked. Easier navigation and faster access to information are still the top priorities. Everything uses placeholder content; there is no real storage, auth, AI service, or firm data.

Old goal (Phases 1 onward): a sandbox prototype that tests whether one global search bar can find any internal document or folder across all departments of the RISE CPA intranet, without drilling through folders. Discovery and user research show that finding a document takes staff 10 to 15 minutes, that new employees struggle most, and that the client ranks cross-department search as a top-priority feature. Everything uses placeholder content; there is no real storage, auth, or firm data.

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

---
# Meeting 4 phases (planned 2026-10-15)
Research for every phase below: docs/DISCOVERY.md, "RISE CPA: Fourth Meeting Summary". Section numbers refer to that summary. Placeholder departments stay as they are (HR, Finance, Marketing, Operations); new documents may be added inside them.
## Phase 11 — Fluent UI foundation
Section 7, "Component library". Eric approved building with a Microsoft component library so the firm could recreate the prototype in SharePoint.
- [x] Read the bundled Next.js guides on Server and Client Components and CSS (`node_modules/next/dist/docs/01-app/01-getting-started/05-*.md` and `11-css.md`) and Fluent UI v9's Next.js App Router setup notes before adding anything
- [x] Add `@fluentui/react-components` (v9) as a dependency, pinned to an exact version
- [x] Write failing tests for `lib/fluent-theme.ts`: the brand ramp has 16 shades, its primary shade is `#87B04B`, and the theme's base font is Open Sans. Then build `riseLightTheme` with `createLightTheme` and implement them.
- [x] Create a client `app/providers.tsx` that wraps the app in `FluentProvider` with `riseLightTheme` and inserts Fluent's styles during server rendering, so there is no flash or hydration warning. Render it from `app/layout.tsx`.
- [x] Keep Tailwind for page layout and spacing only; controls (buttons, inputs, dropdowns, tables, tabs, dialogs) come from Fluent
- [x] Check that `npm test`, `npm run lint` and `npm run build` pass, and that `npm run dev` shows no console errors
## Phase 12 — Multi-tab app shell and routing
Sections 1 and 9. Tabs: Home, Search, Departments, Calendar, Help. The chatbot is a floating button on every tab (Phase 16), not its own tab.
- [ ] Create routes `app/page.tsx` (Home), `app/search/page.tsx`, `app/departments/page.tsx`, `app/departments/[department]/page.tsx`, `app/calendar/page.tsx` and `app/help/page.tsx`, each starting as a placeholder heading. Read the bundled guides on layouts, linking and dynamic route params first.
- [ ] Build an `AppHeader` client component in the root layout: RISE CPA wordmark, a Fluent `TabList` whose tabs are links (selected tab from `usePathname`), the OneDrive button and the "Viewing as (demo)" role switcher
- [ ] Write failing tests for `lib/nav.ts` (the tab list and which tab is active for a given path, including `/departments/hr`), then implement it
- [ ] Move the demo role into a `DemoRoleProvider` client context in the root layout, so the role survives switching tabs. Default Staff.
- [ ] Write failing tests for `filtersFromParams` and `filtersToParams` in `lib/search-params.ts` (query, department, type, year and folder round-trip; unknown values fall back to "all"), then implement them. Search and department pages read their state from the URL.
- [ ] At 375px the tabs scroll horizontally inside the header with no page-level horizontal scroll
- [ ] Delete `HubShell` once every section it held has a new home (by the end of Phase 16)
## Phase 13 — Search tab (primary workflow)
Section 7, "Must work: department navigation and finding a file". Lo-fi search page: filters plus a file overview panel before opening a file.
- [ ] Rebuild `SearchBar` and `SearchFilters` with Fluent `SearchBox`, `Dropdown` and `Button`, keeping the existing `lib/search.ts` behaviour and tests
- [ ] Rebuild `ResultsTable` with Fluent `Table`, keeping the five columns, the icon and path subtext, and click-to-filter on Type, Department and Last Update
- [ ] Sync the query and filters to the URL with `filtersToParams`, so `/search?department=HR&folder=Budget` opens pre-filtered and the Back button works
- [ ] Add a file overview panel: selecting a row shows name, type, department, path, published and last update, plus a disabled "Open file (demo)" button. Fluent `Drawer` on desktop, full-width at 375px.
- [ ] Verify "budget" search, every filter, click-to-filter, "Clear filters" and the overview panel in `npm run dev`
## Phase 14 — Department navigation: sidebar, cards and department page
Section 5. Department navigation is mainly for managers and partners; Eric wants both the pop-out left sidebar and the landing-page cards.
- [ ] Write failing tests for `departmentSlug` / `departmentFromSlug` (e.g. `"HR"` and `"hr"`; unknown slugs return `undefined`), then implement them
- [ ] Build a `DepartmentSidebar` client component (Fluent `NavDrawer` or inline `Drawer`) listing role-visible departments and their standard folders, collapsed by default, with a button in the header to open it on every tab
- [ ] Build `app/departments/[department]/page.tsx`: a breadcrumb (RISE CPA / Department / Folder), that department's role-visible items in the Fluent results table, and Type, Year and Folder filters. An unknown slug shows the not-found page.
- [ ] Make `app/departments/page.tsx` the department card grid (reusing `DepartmentNav` rebuilt with Fluent `Card`), linking each card and folder to the department page instead of setting a search filter
- [ ] Verify that a hidden item for Staff never shows in the sidebar, cards, counts or department page
## Phase 15 — Role-based home pages
Section 5. Staff and co-ops mostly need a few key links. Managers and partners get department navigation and a team section with performance reviews (Excel files) and coaching notes.
- [ ] Add a few staff-visible placeholder documents inside the existing departments: an Internet Technology Service Ticket Guide and a Remote Desktop How-To (Operations), a Client File Naming SOP and a New Hire Checklist (HR)
- [ ] Create `lib/key-links.ts`: a short list of key links (Employee Policy Manual, SOPs, how-to guides, IT Service Ticket Guide), each pointing at a placeholder document id
- [ ] Write failing tests that every key link points at an existing, staff-visible document, then make them pass
- [ ] Create `lib/mock-team.ts`: 3 to 4 fictional direct reports, each with a performance review Excel file and coaching notes (`manager` visibility). Write failing tests that Staff gets an empty team list and Manager and Partner get the list, then implement `teamForRole`.
- [ ] Build the Home page: welcome message, a search box that sends the query to `/search`, the rotating banner slot (Phase 17), compact latest news, and then by role either Key Links (Staff) or Department cards plus My Team (Manager, Partner)
- [ ] Verify that switching role swaps the home sections with no locked or greyed-out traces
## Phase 16 — Floating Ask HR chat
Section 6. A floating pop-up button in the corner, a clear/reset button, no edit-message button. Stays a scripted showcase (see Phase 21 for the Gemini write-up).
- [ ] Write failing tests for a pure chat reducer in `lib/chat.ts` (send adds the user message and the matched answer; reset returns the empty state with the suggested questions), then implement it and use it in `AskHrChat`
- [ ] Render a Fluent floating button (bottom-right, labelled "Ask HR") in the root layout on every tab. Clicking it opens the chat panel; Escape or the close button closes it and returns focus to the button.
- [ ] Add a "Clear chat" button that resets the conversation. No edit-message control.
- [ ] Keep the Fiji vacation script, the typing indicator, the off-topic fallback and the "demo, answers questions only" label. A linked document opens `/search?q=<name>`.
- [ ] At 375px the panel opens as a full-width sheet and never covers the close button
- [ ] Remove the fixed Ask HR section from the old hub
## Phase 17 — Rotating announcement banner and News
Section 3. The banner is separate from the News hub and rotates through the three most recent posts. Partners and managers post firm news; delegated staff (e.g. the social committee) add birthdays, anniversaries and events.
- [ ] Add a `postedBy` field to news items (e.g. "Partner", "Manager", "Social Committee") and a blog post about a CRA PST change being announced and then postponed. Update `mock-news` tests first.
- [ ] Write failing tests for `latestNews(items, 3)` and a wrap-around `nextIndex` / `prevIndex` helper, then implement them
- [ ] Rebuild `NewsBanner` to rotate through the 3 latest posts every 6 seconds, with previous / next buttons and a position indicator ("2 of 3"). Rotation pauses on hover and keyboard focus, and doesn't run at all when `prefers-reduced-motion` is set.
- [ ] Keep dismissal: closing the banner hides it until a newer post exists (same `useStoredValue` approach)
- [ ] Show "Posted by" on News cards, and add a disabled "Post news (demo)" button visible to Manager and Partner only, to show who can post
## Phase 18 — Calendar tab
Section 3. Monthly social events (e.g. bowling, the Christmas party) plus firm events. The lo-fi shows blogs and news beside the calendar, expandable.
- [ ] Add `DEMO_TODAY` (`2026-10-01`) to `lib/mock-user.ts`, so server and client render the same month
- [ ] Create `lib/mock-events.ts` with about 8 fictional events across Nov 2026 (social and firm types, each with a title, date, optional time and location)
- [ ] Write failing tests for `buildMonthGrid(year, month)` (weeks start on Sunday, leading and trailing days from neighbouring months, February in a leap year) and `eventsOn(date)`, then implement them
- [ ] Build `CalendarMonth`: a month grid with previous / next month buttons, event chips on their days, and a list of the selected day's events below. Days with events are keyboard-focusable buttons.
- [ ] Add a side column with News and blog posts as an expandable Fluent `Accordion`, stacking below the calendar at 375px
- [ ] Show the next 3 upcoming events on the Home page with a link to the Calendar tab
## Phase 19 — Onboarding pop-up and Help tab
Section 2. Show the guide during a user's first month, then stop (fallback: first login only, reopenable). Build the full guide in its own Help tab.
- [ ] Write failing tests for `shouldShowOnboarding({ firstSeen, today, dismissed })`: shows on the first visit, shows on day 30, stops after 30 days, and never shows once dismissed for good. Then implement it.
- [ ] Store the first-visit date and the "don't show again" choice with `useStoredValue`
- [ ] Replace the inline Getting Started panel with a Fluent `Dialog` welcome tour (4 to 6 short steps, one per tab plus Ask HR and OneDrive), with Next / Back, "Don't show again" and Close
- [ ] Build `app/help/page.tsx`: a detailed user guide with one section per tab and feature, an in-page table of contents, and a "Show the welcome tour" button
- [ ] Add demo controls on the Help page ("Reset onboarding" and "Pretend it's day 31") so the first-month rule can be shown in the meeting
## Phase 20 — OneDrive button
Section 4. The reason is confirmed (a shortcut to each employee's own space). A non-functional button is fine.
- [ ] Rebuild the header OneDrive button with Fluent, opening a small popover that says "Demo: in the real hub this opens your own OneDrive" with the placeholder link
- [ ] Record the per-user linking options in the Phase 21 write-up
## Phase 21 — Feasibility and SharePoint compatibility write-up
Sections 4, 6 and 7. Eric wants to know which features SharePoint can't support, and the firm is weighing SharePoint against a custom front end over SharePoint drives, with maintenance by non-developers as the deciding concern.
- [ ] Create `docs/FEASIBILITY.md` with a table: feature, how SharePoint Online would do it (built-in web part, SPFx extension, or not possible), what a custom front end would need, and the upkeep effort for non-developers. Cover tabs, search with filters, table view, role-based hiding, department sidebar and cards, key links, rotating banner, news posting rights, calendar, floating chatbot, first-month onboarding pop-up, Help tab, file overview panel and the OneDrive button.
- [ ] Onboarding timing: explain that `localStorage` is per browser, so a real first-month rule needs per-user storage (e.g. a SharePoint list or the user's profile), and recommend the fallback if that's too much upkeep
- [ ] OneDrive: list the ways to link each user to their own OneDrive without custom code, and list questions for Trevor
- [ ] Chatbot: how a Gemini Flash-Lite version would work (a server route holding the key, grounding on published HR policies), the data-confidentiality and cost questions, and Microsoft-native alternatives. Recommend whether to build it; no code in this phase.
- [ ] Mark every claim about SharePoint, Microsoft or Google that needs checking against current vendor documentation, with the source link and the date checked
## Phase 22 — Verify and prepare for Meeting 5
- [ ] Run `npm test`, `npm run lint` and `npm run build`, and check that all three pass
- [ ] Walk through the demo script in `npm run dev` for each role: Home, banner rotation and dismiss, search "budget" and the overview panel, sidebar to a department page, Calendar, Ask HR Fiji script and Clear chat, Help tab and the onboarding demo controls
- [ ] Check every tab at 375px and desktop width, by keyboard only, with no console errors
- [ ] Remove components and code no longer used (old hub sections, unused Tailwind-only controls)
- [ ] Use the `security-auditor` agent for an OWASP check
- [ ] Update `docs/DECISIONS.md` with every decision made in Phases 11 to 21