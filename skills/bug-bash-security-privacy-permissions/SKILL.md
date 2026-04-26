---
name: bug-bash-security-privacy-permissions
description: Review a whole codebase or named area for auth, privacy, tenant isolation, and destructive permission bugs using the shared bug bash report format.
---

# Bug Bash Security Privacy Permissions

## Purpose

Use this skill to investigate whether users can access, export, mutate, or delete data they should not be able to reach.

## When to Use

- Use for auth, role, ownership, tenant isolation, privacy, export, deletion, and destructive action reviews.
- Use when the user names an area such as an admin route, API surface, background job, or data export flow.
- Do not use for general quality sweeps when another domain is clearly primary.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `route`, `workflow`, `screen`, `data model`, `job`, `integration`, or `permission boundary`.

## Core Rules

- Inspect code, tests, docs, schemas, and UI copy before asking questions.
- Prefer read-only investigation and existing tests.
- Do not commit or apply fixes.
- Follow existing test standards first. If stable permission verification is missing, explain the minimum test additions needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- missing auth checks
- missing role checks
- missing ownership checks
- cross-tenant leakage through IDs, joins, filters, caches, or jobs
- unsafe exports or imports
- destructive actions without confirmation, policy checks, or auditability
- sensitive data exposure in responses, logs, UI, or background processing
- permission mismatches between frontend, backend, database, and tests
- stale permission or session state

Attack vectors to emphasize:

- permission and ownership mismatch
- cross-tenant or cross-account leakage
- destructive action safety
- file, import, or export failure
- cache or stale data
- background job failure
- product copy mismatch
- weak assertions and missing negative permission tests

## Workflow

1. State the resolved scope.
2. Map auth boundaries, roles, ownership rules, and tenant keys.
3. Inspect routes, handlers, screens, jobs, policies, and tests that enforce or imply access rules.
4. Validate candidate issues through code paths, tests, contracts, and docs.
5. Document confirmed or likely findings with business impact first.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Fully document `Critical`, `High`, and `Medium` findings. Summarize `Low` findings unless they are especially actionable or reveal a broader pattern.

If intent cannot be inferred and one narrow answer would resolve it, ask a tightly scoped question. Otherwise record `Needs external research`.
