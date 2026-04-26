---
name: bug-bash-data-integrity
description: Review a whole codebase or named area for data loss, corruption, partial writes, and invalid state bugs using the shared bug bash report format.
---

# Bug Bash Data Integrity

## Purpose

Use this skill to investigate whether the system can lose data, corrupt records, create invalid state, or persist only part of an intended change.

## When to Use

- Use for persistence, transactions, migrations, imports, deletes, duplicate records, and rollback behavior.
- Use when the user names a model, repository, job, API mutation, or workflow that writes data.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `route`, `workflow`, `data model`, `job`, or `integration`.

## Core Rules

- Explore first, ask only if business intent cannot be inferred.
- Prefer read-only investigation and existing tests.
- Do not commit or repair code.
- Reuse current test patterns where possible. If stable write-path validation is missing, describe the minimum harness or fixture improvement needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- partial writes
- missing transactions
- invalid state transitions
- duplicate creation paths
- unsafe migrations
- rollback gaps
- data deletion or archival mistakes
- import parsing failures
- persistence assumptions that tests do not verify
- background processing that leaves records half-updated

Attack vectors to emphasize:

- destructive action safety
- silent failure
- missing validation
- validation drift
- state-machine invalid transition
- race condition
- idempotency gap
- file, import, or export failure
- background job failure
- weak assertions around persisted state

## Workflow

1. State the resolved scope.
2. Map data models, write paths, transactions, and side effects.
3. Inspect mutation handlers, background jobs, migrations, and tests.
4. Verify whether persistence, rollback, and duplicate protection are actually tested.
5. Report business impact first, then root cause and suggested test coverage.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Document meaningful data loss or corruption risk even if the bug is not fully reproduced, provided the evidence supports at least `Likely`.
