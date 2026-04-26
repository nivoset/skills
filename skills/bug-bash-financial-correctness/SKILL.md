---
name: bug-bash-financial-correctness
description: Review a whole codebase or named area for billing, payments, credits, refunds, and accounting-sensitive bugs using the shared bug bash report format.
---

# Bug Bash Financial Correctness

## Purpose

Use this skill to investigate whether money-moving or account-balancing logic can double-charge, misstate balances, drift from subscription state, or silently fail.

## When to Use

- Use for payments, invoices, subscriptions, credits, refunds, usage metering, and billing state transitions.
- Use when the user names a checkout flow, billing route, webhook, ledger model, or finance-related integration.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `route`, `workflow`, `job`, `integration`, or `data model`.

## Core Rules

- Explore code, tests, contracts, and provider docs in the repo before asking questions.
- Prefer existing tests and fixtures.
- Do not commit or patch code.
- If stable financial verification is not possible with current tests, explain the minimum regression coverage needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- duplicate charges or refunds
- missing idempotency keys
- subscription state drift
- invoice generation gaps
- retries that repeat side effects
- partial success across payment and persistence boundaries
- balance, credit, or metering mismatch
- webhook replay issues
- accounting-sensitive rounding or state transition mistakes

Attack vectors to emphasize:

- payment and billing correctness
- silent failure
- state-machine invalid transition
- race condition
- idempotency gap
- external dependency failure
- background job failure
- configuration or environment assumption
- negative-path gaps in billing tests

## Workflow

1. State the resolved scope.
2. Map payment flows, billing state, retries, webhooks, and side effects.
3. Inspect handlers, jobs, provider adapters, and tests.
4. Check whether tests prove the business outcome rather than only status codes or mock calls.
5. Report business impact, likely financial exposure, and the smallest useful regression suite additions.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Treat a missing negative or idempotency test around important billing behavior as a real finding when it creates false confidence.
