---
name: pr-review
description: Use when reviewing the active or named branch against a target branch, drafting GitHub review comments, verifying findings locally, or coordinating focused reviewer subagents.
---

# PR Review

## Purpose

Review the active or named branch against a target branch through bounded, evidence-first subagents. The parent agent coordinates scope, calls `vette` when risk-review lanes overlap, dispatches `thermo-nuclear-code-quality-review` in a separate subagent lane when that skill is available, verifies findings locally, drafts or posts GitHub review comments when appropriate, and removes or stashes only temporary verification artifacts it created.

## When to Use

- Use when the user asks for a PR review, branch review, GitHub review comments, code suggestions, test suggestions, or test-name suggestions.
- Use when the user names a source branch, or when the active branch should be reviewed.
- Use when the target branch is named, or when the default target should be inferred as `dev` or `develop`.
- Use when a review is broad enough to benefit from separate focused agents.
- Use when findings must be locally verified before comments are drafted or posted.
- Do not use for implementation work after the review; hand verified repair prompts to a coding workflow instead.

## Core Rules

- Review the source branch against the target branch, not the working tree in isolation.
- Default source branch is the active branch unless the user names another branch.
- Default target branch is `dev` if it exists, otherwise `develop` if it exists. If neither exists, use the repository's default branch or ask when the target is ambiguous.
- Prefer `git merge-base <target> <source>` plus diff/log inspection from the merge base so the review covers only source-branch changes.
- Use multiple subagents for non-trivial reviews. Give each subagent one bounded scope.
- Prefer lane-based subagents for cross-cutting risks; use file-based subagents when files are independent or the PR is large.
- Call `vette` as a review lane when the branch review overlaps likely defects, missed requirements, weak tests, security gaps, data risks, UX mismatches, observability gaps, or maintainability risks.
- At intake, check whether the `thermo-nuclear-code-quality-review` skill is available in the current environment. If available, dispatch it in a separate read-only subagent lane scoped to the source-vs-target diff and require file/line-ready PR comments for accepted findings. If unavailable, continue the PR review and note that the skill was unavailable.
- Keep subagents read-only by default. Subagents are writable only in an isolated worktree or when the parent serializes the write.
- Any writable subagent gets exactly one writable path scope and returns an artifact manifest listing every file it created or changed.
- Do not let two active agents share mutable state: databases, ports, caches, browser profiles, fixtures, or write scopes.
- Do not post externally visible GitHub comments unless the user asked you to post them or approves the final drafts.
- Every actionable finding must have local evidence: a failing focused test, reproduced command, static proof from code/contracts, or documented reason verification is impossible.
- Test names must describe expected user behavior, not implementation details or vague assertions.
- Clean up after verification. Remove temporary tests/files, or stash only your own verification changes with an explicit message. Never stash or remove unrelated user changes.

## Workflow

### 1. Intake

1. Identify the source branch: the active branch unless the user names another branch.
2. Identify the target branch: user-provided branch, otherwise `dev`, then `develop`, then the repository default branch if neither exists.
3. Identify PR number if one exists, linked issue, stated requirements, and changed files between merge base and source branch.
4. Capture pre-existing local state with `git status --short`.
5. If the worktree is dirty before checkout, do not stash, reset, or overwrite it. Prefer a new git worktree for the source branch. If a worktree is not possible, ask before changing branches.
6. Fetch and check out the source branch if needed.
7. Compute the merge base and inspect `target...source` diff, changed files, and branch-only commits.
8. Read PR description when available, changed files, nearby tests, schemas, and contracts.
9. Check available skills for `thermo-nuclear-code-quality-review`. Load it if present; record unavailable if not present.
10. Start a cleanup ledger for any temporary artifact: path, baseline status, owning agent, creation time, and intended cleanup action.
11. Run the smallest baseline check that establishes the branch is reviewable.

### 2. Choose Review Slices

Use lane-based slices unless the branch diff is mostly isolated files. Read [review-lanes.md](references/review-lanes.md) when assigning lanes.

Default lanes:

- Requirements and product behavior
- Security, privacy, permissions, and tenant isolation
- Data integrity, migrations, persistence, and transactions
- Concurrency, idempotency, caching, and resource leaks
- Error handling, validation, and external integrations
- Tests, test names, mock honesty, and coverage gaps
- Frontend state, UX, accessibility, and performance when applicable
- Maintainability and architecture fit
- `vette` risk sweep when the requested review overlaps product or engineering risk review
- `thermo-nuclear-code-quality-review` maintainability sweep in its own subagent lane when the skill is available

File-based slicing is acceptable when:

- each file has a clear owner or behavior boundary,
- the change is too large for one lane to inspect well,
- or verification can be isolated per file without shared fixtures.

When calling `vette`, scope it to the source-vs-target diff and ask it to return only findings relevant to changed behavior. Do not let `vette` expand into a whole-repo review unless the user explicitly asked for that.

When dispatching `thermo-nuclear-code-quality-review`, use a separate subagent from the other review lanes and scope it to maintainability risks introduced or worsened by the source-vs-target diff. Ask it to return only evidence-backed findings that meet the PR review comment contract, including the exact changed file and line for each comment. Accepted thermo-nuclear findings should be converted into PR review comments on those file/line locations; do not let the lane become a whole-repo style audit unless the user explicitly asked for that.

### 3. Dispatch Subagents

Each subagent prompt must include:

- Branch or PR intent and assigned scope only.
- Source branch, target branch, merge base, and changed files relevant to that scope.
- Files, tests, commands, and contracts relevant to that scope.
- Whether the agent is read-only or may create one temporary verification test.
- Isolation constraints: no shared ports, DBs, caches, browser state, or overlapping write scope.
- Output contract: findings only if evidence-backed; include file/line, failure mode, user impact, verification command/result, and suggested fix boundary.
- For `thermo-nuclear-code-quality-review`, output candidate PR comments keyed to exact changed file/line locations so the parent can post them on the PR.
- Suggested test names only when the finding needs a new or renamed test. If no test is appropriate, state the verification method instead.

Subagents must not post GitHub comments. They return candidate findings to the parent.

### 4. Parent Verification

For each candidate finding:

1. Re-read the relevant code path yourself.
2. Confirm it is in source-vs-target branch scope.
3. Verify locally with the narrowest command or static proof.
4. For defect claims, prefer a focused temporary test that fails for the right reason.
5. Reject findings that are speculative, duplicate, outside scope, or not user-impacting.
6. Record exact commands and results.

### 5. Comment Preparation

Use [comment-contract.md](references/comment-contract.md) for review comment formats.

Every actionable comment must include:

- priority: blocker, suggestion, nit, or strong test callout,
- concrete user-visible failure or maintenance risk,
- exact code location or changed hunk,
- local verification evidence,
- code suggestion when the smallest safe patch is clear,
- test or test-name suggestion when coverage or naming is the issue,
- fix boundary: what to change and what not to change.

Prefer one complete comment per root cause. Group related lines instead of comment spam.

Before posting externally visible comments, show the exact final comments and review disposition unless the user explicitly said to post without another approval step. Do not submit approve/request-changes/comment-only reviews until the intended disposition is explicit.

If posting is approved, use the repository's established GitHub workflow or `gh` command after the comments pass the quality gate. Otherwise, return drafts only.

### 6. Cleanup

Before finalizing:

1. Run `git status --short`.
2. Compare against the cleanup ledger and the pre-review `git status --short`.
3. Remove temporary verification files/edits you created, or stash only those paths with a message like `review verification artifacts for PR <number>`.
4. Do not touch pre-existing user changes or paths missing from the cleanup ledger.
5. Re-run `git status --short` and report any remaining local changes.
6. If temporary changes were stashed, report the stash name and why it was kept.

### 7. Final Report

Return:

- review status: request changes, comment only, approve, or needs clarification,
- exact commands run and results,
- whether `thermo-nuclear-code-quality-review` was available and used,
- comments drafted or posted,
- rejected candidate findings and why, if relevant,
- cleanup result, including whether artifacts were removed or stashed.

## References

- [review-lanes.md](references/review-lanes.md): lane checklist and subagent assignment guidance.
- [comment-contract.md](references/comment-contract.md): GitHub review comment templates and suggestion formats.
