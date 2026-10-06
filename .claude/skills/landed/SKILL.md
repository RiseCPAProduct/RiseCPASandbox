---
name: landed
description: Post-merge verification. Confirms the merged change passes CI on main, then deletes the merged local and remote feature branch. Use after a PR has been merged.
---

# /landed — Post-merge verification

## Steps

1. **Identify the feature branch.** Use the current branch, or the one the user names. If you're already on `main`, ask the user which branch was merged.
2. **Confirm the merge.** Run `gh pr view <branch> --json state,mergeCommit,url`. If the state isn't `MERGED`, stop and report.
3. **Update main.** Run `git checkout main`, then `git pull --ff-only origin main`.
4. **Check CI on main.** Run `gh run list --branch main --limit 5` and find the run for the merge commit. If it's still in progress, follow it with `gh run watch <id>`.
   - If CI fails on main, stop. Report the failing run and keep the branch so the user can investigate.
5. **Delete the branch** (only after CI passes):
   - Local: `git branch -d <branch>`. If git refuses because the PR was squash-merged, confirm the merge in step 2 first, then use `-D`.
   - Remote: `git push origin --delete <branch>`. Skip this if GitHub already deleted it.
   - Run `git fetch --prune`.
   - Never delete `main` or any branch that isn't merged.
6. **Report** a short confirmation:

```
Landed: <branch> → main (<merge SHA short>)  PR: <url>
CI on main: passing (<run url>)
Cleanup: local deleted, remote deleted
```

If `gh` isn't installed or authenticated, say so, ask the user to confirm CI status manually, and don't delete branches until they confirm.
