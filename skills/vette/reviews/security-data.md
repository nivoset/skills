# Security / Data Review

## Lane Id

`security-data`

## Purpose

Detect auth, data, and validation risk introduced by the diff: authorization gaps, privacy leaks, input-validation issues, injection risk, and data integrity problems.

## Topic Scope

Detect auth, data, and validation risk only: authorization, privacy, input-validation, injection, or data integrity issues introduced by the diff.

## When to Use

- Use for API routes, handlers, forms, exports, background jobs, and persistence changes.
- Use when the diff touches permissions, tenant boundaries, PII, billing, or destructive actions.
- Do not use for general maintainability or naming unless the issue is a concrete security or data defect.

## Core Rules

- Confirm enforcement on server-side paths, not only UI gating.
- Compare frontend, backend, database, cache, and test expectations for permission drift.
- Prefer read-only investigation and existing tests.
- Use shared severity, confidence, and finding schema from `vette`.
- This lane uses a higher scrutiny bar in Pi `/vette`: treat empty clean results skeptically and verify high-risk surfaces explicitly.

## Investigation Focus

Look for:

- missing auth, role, or ownership checks on new routes or mutations
- cross-tenant or cross-account leakage through IDs, joins, filters, caches, or jobs
- client-side-only permission gating for sensitive actions
- unsafe exports, imports, or destructive actions without policy checks
- sensitive data in responses, logs, UI, analytics, or background processing
- missing or weak input validation on freeform text, uploads, query params, or payloads
- injection, path traversal, open redirect, CSRF, SSRF, or deserialization risks when relevant
- data writes that are not atomic where user-visible consistency requires it
- migration, default, constraint, or delete behavior that can corrupt or lose data
- payment, billing, rounding, or financial state changes without safeguards

Attack vectors to emphasize:

- permission and ownership mismatch
- cross-tenant or cross-account leakage
- destructive action safety
- payment and billing correctness
- missing validation
- cache or stale data

## Workflow

1. State resolved scope and changed paths.
2. Map auth boundaries, roles, ownership rules, tenant keys, and validation layers touched by the diff.
3. Inspect routes, handlers, screens, jobs, policies, schemas, and tests.
4. Validate candidate issues through code paths, contracts, and docs.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Treat likely auth, privacy, corruption, or financial issues as high priority even when reproduction is static-only.
