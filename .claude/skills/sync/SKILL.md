---
name: sync
description: Preflight check before starting work. Fetches remote state, verifies the current branch is healthy and up to date with its tracking branch, and lists uncommitted files. Use at the start of a session or before branching, committing, or planning.
---

# /sync — Preflight check

Read-only. Never pull, reset, stash, or commit during this skill.

## Steps

1. Run `git fetch --prune origin`. If it fails (network, auth), report the error and stop.
2. Get the branch: `git rev-parse --abbrev-ref HEAD`.
   - If it prints `HEAD`, flag **detached HEAD** as unhealthy.
3. Check health:
   - Look for an in-progress merge, rebase, or cherry-pick (`git status` mentions it, or `.git/MERGE_HEAD`, `.git/rebase-merge`, `.git/rebase-apply` exist). Flag it if present.
   - Get the upstream: `git rev-parse --abbrev-ref --symbolic-full-name @{u}`. If there is none, flag **no tracking branch** and skip step 4.
4. Count ahead/behind: `git rev-list --left-right --count HEAD...@{u}` (left = ahead, right = behind).
5. List dirty files: `git status --porcelain`. Group them as staged, unstaged, and untracked.
6. Report a short summary in this shape:

```
Branch:   <name> → <upstream or "no upstream">
Status:   <healthy | issues: ...>
Ahead/behind: <n> ahead, <m> behind
Dirty files: <count>
  <path>  (staged | unstaged | untracked)
```

7. If the branch is behind, suggest `git pull --rebase`. If it has diverged (ahead and behind), say so and suggest a rebase, but don't run it.
