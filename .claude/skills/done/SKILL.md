---
name: done
description: Validation gate for finishing work. Auto-detects scope (quick, standard, or project) from the branch, diff size, and implementation plan, then always runs lint and build before it commits, pushes or opens a PR, checks CI, and updates the changelog, handoff note, and plan as the scope requires. Use when the user says the work is done or ready to ship.
---

# /done — Validation gate

## 1. Detect scope

Collect: the branch (`git rev-parse --abbrev-ref HEAD`), the diff size (`git diff --stat HEAD` plus untracked files), and whether `docs/IMPLEMENTATION_PLAN.md` has unchecked `- [ ]` items.

- **Project**: the plan exists and has unchecked items.
- **Quick**: on `main`, with a small diff (about 3 files or fewer and under 100 changed lines).
- **Standard**: anything else. If you're on `main` with a non-small diff, create a feature branch first.

Tell the user which scope you detected and why, then continue.

## 2. Validate (all scopes, never skip)

Run `npm run lint`, then `npm run build`. Also run `npm test` if a `test` script exists in package.json. If anything fails, stop, report the failures, and don't commit.

## 3. Ship

- **Quick:** commit with a clear message, run `git push`, then check CI with `gh run list --branch main --limit 1` (use `gh run watch` to follow it).
- **Standard:**
  1. Add an entry under `## Unreleased` in `CHANGELOG.md` (create the file if missing).
  2. Commit, then `git push -u origin <branch>`.
  3. Open a PR with `gh pr create`, giving it a summary and a test plan.
  4. Wait on CI with `gh pr checks --watch`. If it fails, report the failure and stop.
  5. Ask the user whether to run `/code-review` on the PR.
- **Project:** do everything in Standard, and before the commit also:
  - Check off the completed steps in `docs/IMPLEMENTATION_PLAN.md` (`- [ ]` → `- [x]`). Don't check anything you haven't verified.
  - Append a dated handoff note to `docs/HANDOFF.md` that lists what was done, what remains, and any gotchas for the next session.

If `gh` isn't installed or authenticated, say so and give the user the URL for checking CI or opening the PR manually. Don't treat CI as passing.

## 4. Report

Report the scope, the validation results, the commit SHA, the PR URL (if any), the CI status, and the files updated.
