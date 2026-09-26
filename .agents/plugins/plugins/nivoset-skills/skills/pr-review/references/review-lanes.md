# Review Lanes

Use these lanes to keep reviewer agents focused. Assign only the lanes relevant to the PR.

## Requirements and Product Behavior

- Compare PR description, linked ticket, acceptance criteria, UI copy, API contracts, and code.
- Check that every stated requirement is implemented and no unrelated behavior was added.
- Trace the core happy path and the highest-risk negative path.
- Identify ambiguous product intent as a targeted question, not a defect.

## Security, Privacy, Permissions, and Tenant Isolation

- Confirm authentication and authorization are enforced server-side.
- Check object ownership, role checks, organization/account boundaries, and tenant-scoped queries.
- Look for sensitive data in logs, errors, responses, caches, analytics, and client state.
- Check injection risks, path traversal, unsafe deserialization, open redirects, CSRF, SSRF, and token/session handling when relevant.

## Data Integrity, Migrations, Persistence, and Transactions

- Verify writes are atomic where user-visible consistency depends on multiple changes.
- Check migrations for backward/forward compatibility, defaults, constraints, and rollback risk.
- Confirm deletes, updates, imports, exports, and retries cannot silently corrupt or lose data.
- Check precision, rounding, dates, time zones, enum/state transitions, pagination, sorting, and filtering.

## Concurrency, Idempotency, Caching, and Resource Leaks

- Check double-submit, retry, replay, webhook, background job, and concurrent request behavior.
- Verify idempotency keys, uniqueness constraints, locks, transactions, or conflict handling where needed.
- Check stale caches, invalidation, memoization, optimistic UI reconciliation, and out-of-order events.
- Look for unclosed files, sockets, database handles, timers, event listeners, subscriptions, workers, streams, and unbounded caches.

## Error Handling, Validation, and External Integrations

- Confirm invalid inputs fail clearly and safely.
- Check external service timeouts, retries, rate limits, partial outages, and response-shape drift.
- Ensure errors are not swallowed and user-facing failures do not look successful.
- Verify cleanup occurs on failure paths.

## Tests, Test Names, Mock Honesty, and Coverage Gaps

- Ensure tests prove user-visible behavior, persisted state, emitted events, rendered output, or API contracts.
- Flag assertions that only prove mocks, implementation calls, snapshots, truthiness, or absence of thrown errors.
- Check that test names describe expected user behavior and match setup/action/assertions.
- Prefer suggested names such as `customers_cannot_submit_the_same_order_twice_during_concurrent_checkout`.
- Verify mocks do not remove the risk being tested.

## Frontend State, UX, Accessibility, and Performance

- Check loading, empty, error, disabled, optimistic, and success states.
- Verify form validation, double-submit protection, focus, keyboard access, labels, contrast, and responsive layout.
- Check state cleanup on unmount, route changes, account switches, and async cancellation.
- Look for realistic performance risks: excessive rendering, unbounded lists, large payloads, blocking work, and layout instability.

## Maintainability and Architecture Fit

- Check whether the change follows existing architecture, naming, dependency direction, and local helpers.
- Flag complexity that hides behavior, speculative abstractions, broad refactors, and duplicated business rules.
- Prefer comments only when maintainability risk can cause real defects or expensive future changes.

## Subagent Output Contract

Each lane agent returns findings in this shape:

```md
## Scope
[lane and files inspected]

## Commands
- `[command]` -> `[result]`

## Findings
- Priority: Blocker | Suggestion | Nit | Strong test
- Location: `[file:line or changed hunk]`
- Evidence: `[code path, command result, failing assertion, or static proof]`
- User impact: `[concrete bad outcome]`
- Suggested test: `[behavior-focused test name and assertions, only when a new or renamed test is needed]`
- Verification method: `[command, static proof, or reason no test is appropriate]`
- Suggested fix boundary: `[smallest safe repair scope]`

## No-Issue Areas
[important paths inspected where no issue was found]
```
