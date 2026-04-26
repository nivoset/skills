---
name: bug-bash-frontend-state-ux
description: Review a whole codebase or named area for frontend state bugs, UX mismatch, and incomplete UI outcomes using the shared bug bash report format.
---

# Bug Bash Frontend State UX

## Purpose

Use this skill to investigate whether the UI accurately reflects system state, handles edge cases, and communicates outcomes clearly.

## When to Use

- Use for loading states, empty states, disabled controls, permission-denied states, stale data, partial failure, and copy-to-behavior mismatch.
- Use when the user names a screen, route, interaction flow, or component area.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `screen`, `workflow`, `route`, `path`, `module`, or `integration`.

## Core Rules

- Inspect UI code, copy, contracts, and tests before asking questions.
- Prefer existing frontend and end-to-end tests.
- Do not commit or patch code.
- If stable UI verification is not possible with current tests, describe the minimum practical coverage needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- loading states that never resolve correctly
- empty or permission-denied states that mislead users
- stale data after mutation
- partial failure with no clear recovery
- disabled controls with no usable explanation
- success messages that overstate what happened
- UI copy that conflicts with backend behavior
- client-only validation or permission assumptions

Attack vectors to emphasize:

- core flow happy-path breakage
- silent failure
- missing validation
- cache or stale data
- product copy mismatch
- negative-path gaps
- test could pass while product is broken

## Workflow

1. State the resolved scope.
2. Map intended user-visible states from screens, copy, and tests.
3. Trace data loading, mutation, refresh, and error behavior.
4. Verify whether the UI reflects backend reality under success, failure, and edge conditions.
5. Report user confusion and misleading outcomes first.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Prioritize findings where the UI claims success, completeness, or permission that the system does not actually provide.
