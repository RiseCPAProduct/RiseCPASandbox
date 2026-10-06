---
name: blueprint
description: The project's own planning phase (named "blueprint" so it doesn't clash with the built-in /plan command or the "design" skill). Reads docs/ for context, asks clarifying questions, writes an ordered and checkable docs/IMPLEMENTATION_PLAN.md, and appends architectural decisions to docs/DECISIONS.md. Use when the user wants to plan a feature before building it.
---

# /blueprint — Planning phase

Plan only. Don't write application code during this skill.

## Steps

1. **Gather context.** Read every file in `docs/`. Read `docs/DECISIONS.md` and `docs/IMPLEMENTATION_PLAN.md` closely if they exist, because past decisions are constraints. Skim the relevant code under `src/` or `app/`. This project uses a non-standard Next.js, so see AGENTS.md before you assume any framework API.
2. **Clarify.** If the scope, acceptance criteria, data shape, or UX is ambiguous, ask the user with AskUserQuestion before you write the plan. Ask only questions whose answers change the plan.
3. **Write the plan.** Create or update `docs/IMPLEMENTATION_PLAN.md`:
   - Start with a title, a one-paragraph goal, and the date (YYYY-MM-DD).
   - Group the steps into ordered phases, for example `## Phase 1 — Data layer`, `## Phase 2 — API`, `## Phase 3 — UI`, `## Phase 4 — Tests & polish`.
   - Write each step as a checkbox: `- [ ] <small, verifiable action>`.
   - When you update an existing plan, keep checked items (`- [x]`) as they are and change only what this session affects.
4. **Record decisions.** For each *real* architectural decision made this session (data model, library choice, boundaries, or a trade-off with lasting effect), **append** an entry to `docs/DECISIONS.md` (create the file if it doesn't exist):

```
## YYYY-MM-DD — <short title>
**Context:** <what forced the decision>
**Decision:** <what we chose>
**Alternatives considered:** <options rejected and why>
```

   Never edit or delete past entries. If a decision reverses an earlier one, add a new entry that references it.
5. **Summarize** for the user: the phases, the number of steps, any decisions you recorded, and any open questions.
