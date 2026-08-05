# Async / State Review

## Lane Id

`async-state`

## Purpose

Detect race, lifecycle, and stale-state risk introduced by the diff: ordering problems, lifecycle leaks, cache invalidation gaps, or stale UI state.

## Topic Scope

Detect race, lifecycle, and stale-state risk only: ordering problems, lifecycle leaks, cache invalidation gaps, or stale state introduced by the diff.

## When to Use

- Use for UI event handling, dialogs, menus, portals, optimistic updates, caches, jobs, and concurrent requests.
- Use when the diff adds `stopPropagation`, controlled open state, subscriptions, or async mutations.
- Do not use for pure correctness bugs with no lifecycle or ordering angle unless they cause stale state.

## Core Rules

- Trace event ordering, mount/unmount cleanup, and state transitions across components.
- Check whether UI state can disagree with server or cache state after async completion.
- Prefer read-only investigation and existing tests.
- Use shared severity, confidence, and finding schema from `vette`.
- This lane uses a higher scrutiny bar in Pi `/vette`: treat empty clean results skeptically on interactive UI changes.

## Investigation Focus

Look for:

- menus, dialogs, or overlays left open after selection or navigation
- pointer or click handlers that break library lifecycle or focus management
- race conditions on double submit, retry, replay, or concurrent edits
- idempotency gaps on writes, webhooks, or background retries
- stale caches, memoization, or optimistic UI not reconciled after failure
- hooks or globals toggled on mount without symmetric cleanup on unmount
- async flows where dialog/menu/focus state becomes inconsistent with portal content
- resource leaks: timers, listeners, sockets, subscriptions, workers, streams, unbounded caches

Attack vectors to emphasize:

- race condition
- idempotency gap
- cache or stale data
- state-machine invalid transition
- background job failure

## Workflow

1. State resolved scope and changed paths.
2. Map state owners, controlled open state, and async side effects introduced by the diff.
3. Inspect mount/unmount, event propagation, and cancellation paths.
4. Check whether concurrent or out-of-order completion can leave stale UI or data.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Describe the stale or racey state, the triggering sequence, and the smallest lifecycle or ordering fix.
