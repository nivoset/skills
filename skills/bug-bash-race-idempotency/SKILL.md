---
name: bug-bash-race-idempotency
description: Review a whole codebase or named area for concurrency, duplicate submission, replay, and stale-state bugs using the shared bug bash report format.
---

# Bug Bash Race Idempotency

## Purpose

Use this skill to investigate whether repeated or concurrent actions can create duplicate, conflicting, or stale outcomes.

## When to Use

- Use for webhook handling, retries, submissions, back-button flows, concurrent updates, queues, and state transitions.
- Use when the user names a mutation-heavy workflow, background process, or external event handler.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `workflow`, `route`, `module`, `job`, `integration`, `path`, or `data model`.

## Core Rules

- Explore state transitions and duplicate execution paths before asking questions.
- Prefer existing tests, replay fixtures, and queue or webhook harnesses.
- Do not commit or patch code.
- If concurrency behavior is not testable with the current setup, explain the minimum stable coverage or harness addition needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- duplicate submission
- replayed webhook side effects
- missing idempotency protection
- stale reads before writes
- invalid concurrent transitions
- cache invalidation races
- back-button or refresh behavior that repeats mutations
- tests that ignore repeated execution paths

Attack vectors to emphasize:

- state-machine invalid transition
- race condition
- idempotency gap
- cache or stale data
- background job failure
- external dependency failure
- negative-path and regression gaps

## Workflow

1. State the resolved scope.
2. Map mutable state, retries, replays, and concurrent actors.
3. Inspect mutation paths, locking or dedupe logic, and tests.
4. Verify whether repeated requests change the outcome incorrectly.
5. Report the risk of duplicate writes, charges, sends, deletes, or stale state.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Escalate findings based on business impact, especially when duplicate execution can move money, data, or destructive actions.
