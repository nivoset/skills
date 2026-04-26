---
name: bug-bash-maintainability-risk
description: Review a whole codebase or named area for maintainability problems that plausibly hide defects or make debugging unsafe using the shared bug bash report format.
---

# Bug Bash Maintainability Risk

## Purpose

Use this skill to document maintainability risks only when they are tied to plausible bugs, fragile behavior, or troubleshooting difficulty.

## When to Use

- Use for duplicated business rules, hidden coupling, dangerous abstractions, inconsistent conventions, and confusing high-risk modules.
- Use when the user names a brittle subsystem, legacy area, or part of the codebase with recurring bugs.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `workflow`, `route`, `job`, `integration`, or `data model`.

## Core Rules

- Do not produce style-only findings.
- Connect every finding to plausible defects, misbehavior, or debugging cost.
- Prefer existing tests, docs, and code ownership signals where available.
- Do not commit or refactor code.
- If the area is hard to validate safely with current tests, describe the minimum stabilization needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- duplicated business logic with drift risk
- hidden coupling between modules or state
- inconsistent conventions around important flows
- abstractions that bypass validation, auth, or persistence guarantees
- sprawling conditionals around sensitive transitions
- brittle test setup that makes regressions easy to miss
- modules that are hard to reason about during incidents

Attack vectors to emphasize:

- maintainability risk hiding defects
- validation drift
- state-machine invalid transition
- cache or stale data
- background job failure
- weak assertions when tests reinforce fragile design

## Workflow

1. State the resolved scope.
2. Identify high-risk modules and duplicated or coupled logic.
3. Inspect how those structures affect correctness, debugging, and test reliability.
4. Validate whether the maintainability problem plausibly masks real bugs.
5. Report only risks with concrete defect or incident implications.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Do not flood the report with architecture opinions. Keep only findings that materially affect defect risk or repair safety.
