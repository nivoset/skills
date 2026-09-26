---
name: pr-bug-bash
description: Use when Codex needs to run an intense evidence-first pull request review against dev, develop, or a named target branch; gather requirements from GitHub PR text, Linear issues, branch names, tickets, and code; use vette risk lanes to find defects; create and verify temporary TDD-style failing tests for high-confidence failures; and draft PR review comments that include the generated test code.
---

# PR Bug Bash

## Purpose

Run a branch-scoped bug bash that turns suspected PR defects into verified evidence. This skill composes `pr-review`, `vette`, `tdd`, `linear-cli`, and the local bug ticket template instead of reimplementing those workflows.

Use it to review a current or named branch before merge, especially when the operator wants comments backed by failing tests and linked requirements.

## Core Rules

- Default source branch to the active branch unless the user names another branch.
- Default target branch to the user-mentioned target, else `dev`, else `develop`, else the repository default branch.
- Review the source branch against the merge base with the target branch.
- Gather requirements before judging defects: PR body, linked issues, explicit Linear IDs, branch-derived Linear issue, acceptance criteria, nearby tests, contracts, docs, and product copy.
- Use `linear-cli` read-only commands for Linear discovery. Do not create or edit Linear content unless the user explicitly requests that visible write.
- Use `vette` as the risk-review engine, scoped to source-vs-target changes and discovered requirements.
- Use `tdd` red-phase discipline for verification tests: behavior-focused names, test-only edits, smallest proof, and independent verification that the failure is for the expected reason.
- Treat generated tests as temporary review artifacts by default. Capture the code for comments, then remove the files or edits and restore the pre-review working tree state except for pre-existing user changes.
- Draft PR comments first. Do not post GitHub comments, submit a review, or request changes until the user approves the exact drafts.
- Do not fix the PR. This skill proves and reports failures; implementation belongs in a separate TDD repair workflow.

## Workflow

### 1. Intake And Safety

1. Capture `git status --short` before doing anything else.
2. Identify source branch, target branch, PR number if available, and linked issue IDs.
3. If changing branches would collide with local changes, prefer a separate worktree. Ask only if no safe read path exists.
4. Compute the merge base and inspect branch-only commits, changed files, and `target...source` diff.
5. Start a cleanup ledger for every temporary test file or edit: path, owner, creation time, baseline status, command run, and cleanup action.

### 2. Requirements Pass

Use the strongest available source of intent:

- GitHub PR title, body, checklist, and review context.
- Linear issue from explicit IDs, branch name, PR links, or `linear issue view`.
- Local ticket docs, acceptance tests, route/API contracts, schemas, and product copy.
- Existing tests that describe intended behavior.

If the requirements conflict, record the conflict as a blocker candidate or targeted question. Do not invent product intent.

### 3. Vette Review Pass

Run `vette` only on changed behavior and directly connected code paths. Prioritize:

- requirements and product behavior mismatches
- security, privacy, permissions, and tenant isolation
- data integrity, persistence, migrations, and transactions
- validation, error handling, and external integrations
- race conditions, idempotency, caching, and resource cleanup
- weak tests, mock honesty, and missing negative paths
- frontend state, UX, accessibility, and performance when the diff touches UI

Reject findings that are speculative, outside the branch diff, unrelated to requirements, or not user-impacting.

### 4. Failing Test Proof

For each high-confidence blocker or important suggestion:

1. Create the smallest temporary behavior test that proves the defect.
2. Keep the edit test-only unless the existing test harness requires a fixture. If a fixture is required, document why in the ledger.
3. Run the narrowest relevant command.
4. Verify the failure is caused by the suspected missing behavior, not setup, imports, timing, shared state, mocks, or unrelated breakage.
5. Capture the exact test code and command result for the draft comment.
6. Remove the temporary test edit and verify cleanup against the ledger.

If a reliable failing test is too expensive or impossible, use static proof only when it is decisive. Otherwise downgrade or drop the finding.

## Comment Drafting

Read [`references/pr-bug-bash-comment.md`](references/pr-bug-bash-comment.md) before drafting comments.

Each drafted comment must:

- target a changed line, changed hunk, or clearly PR-scoped path
- explain the user-visible failure or concrete engineering risk
- map the failure to a requirement, Linear issue, PR promise, or code contract
- include exact verification command and current result
- include the generated failing test code at the bottom when a test was created and verified
- state the smallest safe fix boundary without implementing it

Use one comment per root cause. Group related symptoms into one comment instead of posting duplicates.

## Final Report

End with:

- source branch, target branch, merge base, and requirement sources inspected
- review disposition recommendation: request changes, comment only, approve, or needs clarification
- comments drafted or posted
- verified failing tests created, commands run, and cleanup result
- rejected candidate findings and why, when material
- final `git status --short` and whether any temporary artifacts remain
