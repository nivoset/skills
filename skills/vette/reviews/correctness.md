# Correctness Review

## Lane Id

`correctness`

## Purpose

Detect behavior regressions introduced by the diff: changed runtime behavior, missed branches, invalid assumptions, or correctness failures.

## Topic Scope

Detect behavior regressions only: changed runtime behavior, missed branches, invalid assumptions, or correctness failures introduced by the diff.

## When to Use

- Use for any diff or feature slice where runtime behavior may have changed.
- Use when reviewing navigation, routing, conditional UI, business rules, or API response handling.
- Do not use for test-style-only critiques; route those to test-quality or test-scenarios.

## Core Rules

- Review only this lane. Do not broaden into security, naming, or maintainability unless the defect is correctness-shaped.
- Focus on concrete or plausible regressions; do not spend effort proving the diff is clean.
- Use the diff/context bundle first. Use read/grep only to verify changed-file context.
- Reject findings outside the changed-path set when reviewing a bounded diff.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- removed or altered user-visible behavior without equivalent replacement
- branch logic that no longer matches product copy, tests, or prior behavior
- keyboard, pointer, or focus behavior regressions
- routing or navigation changes that break same-tab vs new-tab expectations
- invalid assumptions about permissions, ownership, or form state
- happy-path changes that break edge cases still supported elsewhere
- conditional rendering that hides required affordances or shows wrong affordances

Attack vectors to emphasize:

- core flow happy-path breakage
- state-machine invalid transition
- product copy mismatch
- validation drift when behavior changes without matching guards

## Workflow

1. State resolved scope and changed paths.
2. Read the diff for behavior changes, not just refactors.
3. Trace each changed branch through UI, API, persistence, and side effects when needed.
4. Compare against tests, feature specs, and requirement context in the bundle.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Prefer behavior-first titles. Include file, line, evidence from diff or verified code, and the smallest safe fix boundary.
