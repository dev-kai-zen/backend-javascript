# Git Workflow Guide for Junior Developers

This guide assumes your team uses this **branch model**:

| Branch | Purpose |
|--------|---------|
| **main** | Production — what customers run |
| **staging** | Pre-production — QA, UAT, final checks |
| **develop** | Integration — where features come together |
| **feature branches** | One branch per feature, bugfix, or task |

**Why this matters:** everyone agrees where code “lives” at each stage, releases are predictable, and `main` stays stable.

---

## Table of contents

Section titles below are plain text (not clickable links), so Markdown preview will not try to open paths or fragments. Use your editor’s **Outline** view or scroll to jump to a section.

1. Starting a new feature
2. Working on the feature daily
3. Pushing feature branch to remote
4. Creating a pull request (PR)
5. Keeping feature branch updated with develop
6. Local commit exists but remote is ahead
7. Merging feature branch into develop
8. Pushing directly to develop
9. Merging develop into staging
10. Merging staging into main
11. Hotfix workflow
12. Undoing mistakes
13. Viewing branches and history
14. Stashing changes
15. Recommended Git best practices for junior developers
16. Common Git problems and fixes
17. Visual Git flow explanation
18. Golden rules

---


## 1. Starting a new feature

### Goal

Start all new work from an up-to-date **`develop`** branch so your feature integrates cleanly with everyone else’s work.

### Commands (step by step)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

**What each step does**

- **`git checkout develop`** — Switch to the integration branch so you branch from the right place.
- **`git pull origin develop`** — Download teammates’ commits and update your local `develop`. **Why:** avoids building on stale code and reduces surprise conflicts later.
- **`git checkout -b feature/your-feature-name`** — Create **and** switch to a new branch. **Why:** all feature work stays isolated until it is reviewed and merged.

### Branch naming conventions

Use a **prefix** so people see the type of work at a glance:

| Prefix | Use for |
|--------|---------|
| `feature/` | New functionality |
| `bugfix/` | Fixing a bug (non-urgent) |
| `hotfix/` | Urgent production fixes (see **section 11 — Hotfix workflow**) |
| `chore/` | Tooling, config, housekeeping (team-dependent) |

Examples:

- `feature/login-page`
- `feature/user-profile`
- `bugfix/navbar-overflow`

**Tips:** use **lowercase**, **hyphens** between words, and names that describe the **task**, not the ticket only (e.g. `feature/JIRA-123` is okay if your team requires tickets—combine if needed: `feature/JIRA-123-login-page`).

### Why branch from `develop`?

- `develop` is where integrated features land **before** staging/production.
- Branching from `main` would miss work that is already merged to `develop` but not released yet.
- Branching from an old `develop` means you may redo work or fight conflicts that a simple `pull` would have avoided.

### Why feature branches matter

- **Safety:** broken work on `develop` blocks the team; on a feature branch, only you (and reviewers) are affected.
- **Review:** pull requests compare **feature → develop** clearly.
- **History:** each merge tells a story; bisecting and rollbacks are easier.

---


## 2. Working on the feature daily

### Checking what changed

```bash
git status
```

**Why:** shows modified, staged, and untracked files so you commit exactly what you intend.

### Staging files

```bash
git add .
```

**Why **`git add .`**:** stages all changes in the current directory tree (respecting `.gitignore`).  
**Caution:** review with `git status` first; you do not want to stage secrets or generated files.

To stage one file:

```bash
git add path/to/file
```

### Committing

```bash
git commit -m "feat: add login form validation"
```

**Why:** a commit is a **snapshot** of the repo. Small, logical commits are easier to review, revert, and understand.

### Viewing recent history

```bash
git log --oneline
```

**Why:** confirms your last commits and messages before pushing or opening a PR.

### Good commit message practices

- **Imperative mood:** “add” not “added” or “adds” (like a short command to the codebase).
- **First line ~50 characters** when possible; **blank line** then body if you need detail.
- **Describe why** when the change is not obvious from the diff.


### Conventional Commits (common types)

| Prefix | Meaning | Example |
|--------|---------|---------|
| `feat` | New user-facing capability | `feat: add password reset email` |
| `fix` | Bug fix | `fix: prevent duplicate API calls` |
| `refactor` | Code change, same behavior | `refactor: extract validation helper` |
| `chore` | Maintenance, deps, tooling | `chore: bump eslint` |
| `docs` | Documentation only | `docs: update API examples` |

**Why teams use this:** changelog generation, release notes, and quick scanning of history.

---


## 3. Pushing feature branch to remote

### First push (set upstream)

```bash
git push -u origin feature/your-feature-name
```

**Why `-u` (upstream):** links your local branch to `origin/feature/your-feature-name`. After this, Git knows where **`git push`** and **`git pull`** should go.

### Later pushes

```bash
git push
```

**Why push often:** backs up work, enables CI, and lets others see or continue your branch. Small pushes paired with small commits reduce “big bang” failures.

---


## 4. Creating a pull request (PR)

### Why PRs matter

- **Quality:** second pair of eyes catches bugs, style issues, and missing tests.
- **Knowledge sharing:** the team learns the codebase as it changes.
- **Audit trail:** discussions and approvals stay attached to the merge.

### Code review process (typical)

1. You open **PR: `feature/...` → `develop`**.
2. Reviewers comment; you push more commits to the **same branch** (the PR updates automatically).
3. After approval and green checks (CI), someone merges (or you merge if allowed).

### Before you click “Create PR” — checklist

- [ ] **Pulled latest `develop`** and resolved conflicts if you merged/rebased.
- [ ] **No `console.log` / debug prints** left in (unless intentional and agreed).
- [ ] **No commented-out dead code** (delete or explain in docs).
- [ ] **Tested locally** (and ran tests/lint if the project has them).
- [ ] **Commit history is readable** (reasonable messages; avoid “WIP” noise in final state if your team cares).

---


## 5. Keeping feature branch updated with develop

### Scenario

While you work, **`develop` gained new commits** (other merged PRs). You want those changes **in your feature branch** so integration stays smooth.

### Commands

```bash
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop
```

**Why this order:** refresh `develop` first, then merge it **into** your feature—your feature branch now includes the latest integration work.

### Merge conflicts

**What they are:** Git cannot combine two edits to the same lines automatically.

**Typical flow to resolve**

1. After `git merge develop`, Git reports conflicted files.
2. Open each file; look for markers:

   ```text
   <<<<<<< HEAD
   (your version)
   =======
   (incoming from develop)
   >>>>>>> develop
   ```

3. Edit to the **correct combined** result and **remove the markers**.
4. Stage and commit:

   ```bash
   git add .
   git commit
   ```

   Git often pre-fills a merge commit message; save and exit the editor if you use one.

**Why `git add` after fixing:** tells Git the conflict is resolved. **`git commit`** completes the merge.

---


## 6. Local commit exists but remote repo is ahead

### Scenario

You committed locally, but **`git push` is rejected** because the **remote branch** has commits you do not have (e.g. you pushed from another machine, or a teammate pushed to your branch).

### Safe workflows

**Option A — merge-based (safe, explicit merge commit)**

```bash
git pull origin feature/your-feature-name
git push
```

If your team’s workflow is to integrate **`develop` into your feature** when push fails *because `develop` moved*, you might instead:

```bash
git pull origin develop
```

…after checking out your feature branch—but that **merges `develop` into your current branch**; only do this when that is what you intend. When the rejection is “remote has new commits on **the same branch**”, pull **that branch name**.

**Option B — rebase (linear history on your branch)**

```bash
git pull --rebase origin feature/your-feature-name
git push
```

To replay your commits on top of **latest `develop`** (team policy varies):

```bash
git pull --rebase origin develop
```

Then:

1. **Resolve conflicts** if Git stops with a rebase conflict (`git status` shows instructions).
2. Continue the rebase when fixed:

   ```bash
   git add .
   git rebase --continue
   ```

3. **Push** when rebase completes.

### Merge vs rebase

| | **Merge** | **Rebase** |
|---|-----------|------------|
| **History** | Can show merge commits | Tends to look like a straight line |
| **Safety on shared branches** | Safer default | Rewrites commit **parents** (see below) |

### When rebase helps

- You want a **clean PR diff** and linear history **before merge**.
- You are rewriting **only your local commits** that are **not yet depended on** by others.

### ⚠️ Why `git push --force` is dangerous

Force push **overwrites** the remote branch. Teammates’ work can disappear from the remote; open PRs and CI can break.

**Avoid:**

```bash
git push --force
```

**Unless** your team explicitly allows it (often as `git push --force-with-lease`, which still overwrites but refuses if someone else pushed in the meantime).

---


## 7. Merging feature branch into develop

### Typical team flow

1. **Create and merge via PR** after approval (preferred).
2. **Delete the branch** locally and on the remote to reduce clutter.

### After merge — clean up your machine

```bash
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

**Why delete old branches**

- Avoids “Which branch is current?” confusion.
- Keeps `git branch -a` readable.
- Prevents accidentally building on a dead branch.

**Note:** `-d` refuses if Git thinks the branch is not merged; use `-D` only if you **know** it is safe (destructive locally).

---


## 8. Pushing directly to develop branch

### Scenario

A **small, already-approved** change (team-dependent), or an emergency process your org allows.

```bash
git checkout develop
git pull origin develop
git add .
git commit -m "fix: resolve API timeout issue"
git push origin develop
```

### ⚠️ Warning

Most teams **prefer PRs** for traceability and review. Direct push to `develop` can:

- Skip CI gates or review,
- Block others if you push broken code,
- Blend unrelated fixes without context.

**Only direct push when your team’s policy allows it.**

---


## 9. Merging develop into staging

### Purpose

**Staging** is where QA/UAT happens on something **close to production** without exposing it on `main` yet.

```bash
git checkout staging
git pull origin staging
git merge develop
git push origin staging
```

**Why staging exists**

- Validates integrations, config, and data in a **production-like** environment.
- Catches issues **before** customers see them.

**Importance of testing before production:** shipping untested merges to `main` increases outages, rollbacks, and stressful hotfixes.

---


## 10. Merging staging into main

### Purpose

**Production release** — what runs for users should match what passed staging.

```bash
git checkout main
git pull origin main
git merge staging
git push origin main
```

### Production deployment flow (conceptual)

1. Code **proven** on `staging` is merged to `main`.
2. Deployment pipelines often trigger from **`main`** tags or commits.

### Why `main` should stay stable

- Releases and rollbacks anchor to `main`.
- Incidents are harder when “what is production?” is unclear.

---


## 11. Hotfix workflow

### Scenario

A **production bug** needs an urgent fix: minimize risk, patch `main`, then **backport** so other branches do not reintroduce the bug.

### Create hotfix from `main`

```bash
git checkout main
git pull origin main
git checkout -b hotfix/payment-bug
```

Fix, commit, then push:

```bash
git push -u origin hotfix/payment-bug
```

Open a **PR to `main`** (or follow team release rules), deploy as approved.

### Merge back to integration branches

After the hotfix is on `main`, merge it (or `main`) into **`develop`** and **`staging`** so:

- Ongoing work includes the fix.
- The next release does not **drop** the hotfix.

Exact commands depend on team flow (often PRs: `hotfix → main`, then `main → develop`, etc.).

### Why hotfix branches matter

- Isolates urgent work from unrelated `develop` churn.
- Clear history: “this small change shipped to prod on date X.”

---


## 12. Undoing mistakes

### Unstage files (keep edits in working tree)

```bash
git restore --staged path/to/file
```

To unstage **everything**:

```bash
git restore --staged .
```

**Why:** you ran `git add` too eagerly; this only moves files out of the staging area.

### Discard local changes in working tree (⚠️ destructive to uncommitted work)

```bash
git restore .
```

**Warning:** throws away **uncommitted** edits. If you might need them, use the **Stashing** section (section 14) instead.

### Revert a commit safely (shared branches / already pushed)

```bash
git revert <commit-hash>
```

**Why `revert` is safer in teams:** it **adds a new commit** that undoes a previous one—history is preserved and nobody else’s clone is invalidated.

### `revert` vs `reset`

| | **`git revert`** | **`git reset`** |
|---|------------------|-----------------|
| **History** | Non-destructive (new commit) | Can rewrite history |
| **Already pushed** | Usually the right choice | Often **requires force push** — dangerous |
| **Local “oops”** | Fine | `--soft` / `--mixed` can help **if not shared** |

**Avoid `git reset --hard` on pushed branches** unless you know exactly what you are doing and your team agrees.

---


## 13. Viewing branches and history

### Local branches

```bash
git branch
```

### Local + remote-tracking branches

```bash
git branch -a
```

**Local vs remote:** `origin/develop` is your **snapshot** of what Git last fetched from the server; your **`develop`** is your local branch you actually commit on (until you push/pull).

### Graph view

```bash
git log --oneline --graph --all
```

**Reading the graph**

- Commits flow **upward** or **left-to-right** depending on terminal.
- **`*`** nodes are commits; branch lines show **divergence** and **merges**.

---


## 14. Stashing changes

### Scenario

You must **switch branches** but are not ready to commit (experiment half-done).

```bash
git stash
git stash list
```

Return later (and drop the stash entry):

```bash
git stash pop
```

**What stash is:** a **temporary stack** of patch sets—not a substitute for real commits on long-running work.

**Tip:** `git stash push -m "describe work"` helps identify entries in `git stash list`.

---


## 15. Recommended Git best practices for junior developers

- **Pull before you start** work on a shared branch; reduce surprise conflicts.
- **Commit often** with **small, logical** units—each commit should be one clear idea when possible.
- **Write clear messages** (see **Conventional Commits** under section 2).
- **Never commit secrets** (API keys, `.env` with real credentials). Use env vars and secret stores; add patterns to `.gitignore`.
- **Avoid force push** unless explicitly approved; prefer `--force-with-lease` if you must.
- **Open PRs early** as **drafts** to get direction and catch design issues sooner.
- **Keep feature branches short-lived**; long branches diverge painfully.
- **Ask before rebasing** branches others use—rewriting shared history disrupts teammates.

---


## 16. Common Git problems and fixes

### Merge conflicts

**Symptoms:** `git merge` or `git pull` stops; files listed as conflicted.  
**Fix:** edit markers, `git add`, `git commit` (merge) or `git rebase --continue` (rebase).

### Detached HEAD

**Symptoms:** message says “You are in detached HEAD.”  
**Cause:** checked out a **commit** (or tag) directly instead of a branch.  
**Fix:** `git checkout develop` or `git switch develop`, or create a branch from the commit: `git switch -c recover-work`.

### Committed on the wrong branch

**If not pushed:**

```bash
git log --oneline -1   # note commit hash
git checkout correct-branch
git cherry-pick <hash>
git checkout wrong-branch
git reset --hard HEAD~1   # ⚠️ only if that commit is not needed here
```

(Exact steps vary; ask a teammate if unsure—**do not reset** if you already pushed.)

### Accidentally committed a sensitive file

1. Remove it from the tree in a new commit; rotate the credential **immediately** (assume compromise).
2. If secrets touched `main`, follow **incident** procedures—history may still contain the file; `git revert` does not purge blobs from old commits. **Team lead / security** guidance required.

### Push rejected

**Cause:** remote has commits you lack.  
**Fix:** `git pull` (merge) or `git pull --rebase` on **that branch**, resolve conflicts, push again.

### “Branch already exists”

**Creating:** pick a new name or delete the old local branch if truly unused: `git branch -d old-name`.  
**Remote:** someone else may have created it—`git fetch` and inspect `git branch -a`.

---


## 17. Visual Git flow explanation

Simple mental model of **promotion** (bottom → top):

```text
main
  ↑
staging
  ↑
develop
  ↑
feature/login-page
```

**Flow in words**

1. You build on **`feature/login-page`** branched from **`develop`**.
2. Merged features land on **`develop`** (integration).
3. When ready for QA, **`develop` → `staging`**.
4. After validation, **`staging` → `main`** (production).

Hotfixes often **start from `main`** and flow back into **`develop`** / **`staging`** so the fix is not lost.

---


## 18. Golden rules

- **Never work directly on `main`** for day-to-day features.
- **Always pull before you push** on shared branches (or know exactly why you are not).
- **Read `git status` often**—it tells you what Git thinks changed.
- **Ask before force pushing** shared branches.
- **Test before merging** to `develop` / `staging` / `main` per team standards.
- **Keep commits clean**—your future self and your reviewers will thank you.

---

*When in doubt, pause and ask. Fixing Git problems is normal; creating a second problem with a rushed force push is what we try to avoid.*
