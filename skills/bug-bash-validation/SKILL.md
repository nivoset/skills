---
name: bug-bash-validation
description: Review a whole codebase or named area for missing, inconsistent, or drifting validation across layers using the shared bug bash report format.
---

# Bug Bash Validation

## Purpose

Use this skill to investigate whether inputs are accepted, rejected, transformed, and constrained consistently across the system.

## When to Use

- Use for schema checks, form validation, API input validation, database constraints, generated types, docs, and test coverage around invalid input.
- Use when the user names a form, endpoint, payload, schema, or model.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `route`, `workflow`, `screen`, `data model`, or `integration`.

## Core Rules

- Explore validation rules across every relevant layer before asking questions.
- Prefer existing schema tests and contract tests.
- Do not commit or patch code.
- If validation coverage is weak, recommend the minimum stable tests or constraints needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- missing validation
- drift between frontend, backend, database, docs, and generated types
- duplicate validation rules that disagree
- malformed, empty, oversized, expired, duplicate, or unauthorized input slipping through
- validation enforced in UI only
- tests that do not prove invalid paths fail correctly

Attack vectors to emphasize:

- missing validation
- validation drift
- file, import, or export failure
- pagination, filter, or sort boundary
- configuration or environment assumption
- product copy mismatch
- negative-path gaps
- test could pass while product is broken

## Workflow

1. State the resolved scope.
2. Map input contracts across UI, API, persistence, and docs.
3. Compare rules across layers and identify mismatches.
4. Check whether tests cover negative, boundary, permission, and duplicate-input cases.
5. Report the user-facing consequence of accepting or rejecting bad input incorrectly.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Treat validation drift as a meaningful finding even when each individual layer looks reasonable in isolation.
