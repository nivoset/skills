# Maintainability Review

## Lane Id

`maintainability`

## Purpose

Detect review-worthy complexity introduced by the diff: unnecessary complexity, duplicated logic, poor boundaries, or simpler alternatives that materially reduce risk.

## Topic Scope

Detect review-worthy complexity only: unnecessary complexity, duplicated logic, poor boundaries, or simpler alternatives that materially reduce risk; do not report style-only issues.

## When to Use

- Use when the diff adds branching, duplicated handlers, boolean-heavy APIs, or large conditional blocks.
- Use when a simpler existing pattern is visible in the same module or sibling files.
- Do not use for pure formatting, import order, or naming unless complexity hides defects.

## Core Rules

- Compare against nearby repo patterns before recommending new abstractions.
- Flag complexity only when it increases defect risk, review cost, or future change fragility.
- Prefer read-only investigation.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- duplicated event handlers, menu wiring, or trigger markup across sibling components
- boolean prop sprawl instead of an actions model or descriptor array
- helpers that encode business rules in multiple places
- components doing orchestration, rendering, and side effects without clear boundaries
- speculative abstractions or broad refactors bundled with behavior changes
- spaghetti conditionals that hide invalid states or missing cases
- giant files or functions that make risky behavior hard to see during review

Attack vectors to emphasize:

- maintainability risk hiding defects
- validation drift when duplicated logic diverges
- state-machine invalid transition when complexity obscures transitions

## Workflow

1. State resolved scope and changed paths.
2. Compare the changed structure to local conventions and sibling implementations.
3. Identify duplication, boundary violations, and simpler alternatives already present in the codebase.
4. Rank findings by whether they plausibly hide bugs or raise future defect risk.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Recommend the smallest structural simplification that reduces risk, not a broad rewrite.
