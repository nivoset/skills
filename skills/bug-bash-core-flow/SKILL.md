---
name: bug-bash-core-flow
description: Review a whole codebase or named area for broken primary user journeys, misleading success states, and incomplete end-to-end behavior using the shared bug bash report format.
---

# Bug Bash Core Flow

## Purpose

Use this skill to investigate whether the most important user journeys actually work from entry point to persisted outcome.

## When to Use

- Use for sign-up, onboarding, checkout, content creation, submission, approval, export, setup, or other primary workflows.
- Use when the user names a screen, route, funnel, or business process.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `workflow`, `screen`, `route`, `path`, `module`, `integration`, or `job`.

## Core Rules

- Trace the whole path, not isolated methods.
- Prefer read-only investigation and existing tests.
- Do not commit or repair code.
- If end-to-end confidence is weak because current tests are fragmented, propose the minimum stable coverage needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- happy-path breakage
- silent success states
- missing final persistence or side effects
- copy that promises behavior the system does not deliver
- steps that work individually but fail as a flow
- redirect, refresh, or retry paths that lose user progress
- state changes that end in the wrong terminal state

Attack vectors to emphasize:

- core flow happy-path breakage
- silent failure
- unhandled exception
- swallowed error
- missing validation
- state-machine invalid transition
- external dependency failure
- product copy mismatch
- negative-path and regression test gaps

## Workflow

1. State the resolved scope.
2. Identify the intended user journey from code, docs, copy, and tests.
3. Trace the workflow through UI, API, persistence, and side effects.
4. Verify whether success states reflect real completion.
5. Document where the flow breaks, misleads, or ends incompletely.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Prioritize issues that break the user journey even when the underlying technical defect seems small.
