# Error Handling Review

## Lane Id

`error-handling`

## Purpose

Detect unhandled failure paths introduced by the diff: exceptions, timeouts, retries, cancellation, partial failures, or user-facing error gaps.

## Topic Scope

Detect unhandled failure paths only: exceptions, timeouts, retries, cancellation, partial failures, or user-facing error gaps introduced by the diff.

## When to Use

- Use when the diff adds mutations, network calls, dialogs, jobs, imports, exports, or multi-step flows.
- Use when error UI, toast handling, or retry behavior changed.
- Do not use for permission or validation root causes unless the failure path itself is mishandled.

## Core Rules

- Trace failure paths from user action through API, persistence, and UI feedback.
- Prefer read-only investigation and existing tests.
- Do not commit or repair code during review.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- mutations without `onError` or equivalent user feedback
- dialogs or forms that cannot cancel or recover during in-flight requests
- swallowed errors, empty catch blocks, or generic fallbacks that hide root cause
- partial failures that leave UI state inconsistent with backend state
- missing handling for conflict, timeout, rate-limit, or revision-mismatch errors
- navigation or open-in-new-tab actions without fallback when blocked
- background steps that fail silently while UI shows success

Attack vectors to emphasize:

- silent failure
- unhandled exception
- swallowed error
- external dependency failure
- background job failure

## Workflow

1. State resolved scope and changed paths.
2. List new or changed async operations, mutations, and external calls.
3. Walk success and failure paths through to user-visible outcomes.
4. Check tests for failure-path coverage where behavior changed.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Describe what the user sees on failure, what should happen instead, and the smallest safe handling or recovery boundary.
