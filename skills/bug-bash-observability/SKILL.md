---
name: bug-bash-observability
description: Review a whole codebase or named area for missing logs, traces, alerts, and auditability gaps that hide important failures using the shared bug bash report format.
---

# Bug Bash Observability

## Purpose

Use this skill to investigate whether meaningful failures, risky actions, and important state changes are visible to engineers, operators, support, and auditors.

## When to Use

- Use for logging, metrics, tracing, alerts, audit trails, correlation IDs, admin visibility, and operator diagnosis gaps.
- Use when the user names a high-risk workflow, background job, integration, or regulated action.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `workflow`, `job`, `integration`, `route`, `module`, `path`, or `permission boundary`.

## Core Rules

- Inspect runtime signals and failure surfaces before asking questions.
- Prefer existing tests and operational docs when present.
- Do not commit or patch code.
- If observability is hard to verify automatically, describe the minimum logging or audit checks needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- missing logs on important failures
- logs without enough context to diagnose issues
- absent or weak audit trails for destructive or privileged actions
- missing traces or correlation IDs across async boundaries
- no operator signal for repeated retries or dead-letter paths
- no user-visible indication when background work fails
- tests that ignore observability requirements around important flows

Attack vectors to emphasize:

- silent failure
- background job failure
- external dependency failure
- observability gap
- configuration or environment assumption
- destructive action safety

## Workflow

1. State the resolved scope.
2. Map the important actions and failures that should leave diagnostic signals.
3. Inspect logs, telemetry hooks, audit records, jobs, and tests.
4. Verify whether support or engineering could detect and diagnose a failure.
5. Report the business and operational cost of hidden failures.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Treat missing observability around destructive actions, billing, permissions, and background jobs as high-risk even when the product still appears to function.
