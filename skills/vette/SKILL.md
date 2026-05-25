---
name: vette
description: Use when reviewing an implementation plan, codebase, feature area, or pull request for likely defects, missed requirements, weak tests, security gaps, data risks, UX mismatches, or reliability issues before or after implementation.
---

# Vette

## Purpose

Use this skill to find, validate, prioritize, and document likely product and engineering risks before they become defects. It covers incomplete behavior, weak tests, missing validation, unhandled failures, product mismatches, security and privacy gaps, data integrity issues, financial correctness risks, and flows where tests could pass while the product is broken.

This skill is the orchestrator. It owns plan review, repository mapping, investigation planning, subagent coordination, deduplication, prioritization, and final report assembly.

## When to Use

- Use when the user asks for a risk review, defect review, quality sweep, breakage review, or pre-implementation critique.
- Use when the user provides a current plan and wants recommendations about best approaches, missed cases, testing gaps, or implementation risks.
- Use when the user wants subagents to review the whole codebase or a named subsystem.
- Use when the user wants a single merged report instead of disconnected notes.
- Do not use when the user wants implementation or repairs instead of investigation.

## Scope Inputs

Default to a whole-codebase review unless the user provides a plan or narrower scope.

If the prompt narrows scope, accept freeform language and resolve it into one or more of these selectors:

- `path`
- `module`
- `route`
- `workflow`
- `screen`
- `data model`
- `job`
- `integration`
- `permission boundary`
- `implementation plan`

State the resolved scope near the top of the report.

## Core Rules

- Inspect the plan and codebase before asking the operator questions.
- Prefer read-only investigation.
- You may run existing tests, scripts, and static checks that do not change repo-tracked files.
- Do not commit changes.
- Do not apply fixes.
- Do not permanently alter the repo.
- If a useful failing test would be expensive or invasive, describe it in the finding instead of creating it.
- If a temporary local test would clearly improve validation, ask first.
- If a trial test is created with approval, document the file, test name, purpose, and expected failure behavior. Do not commit it.
- Follow the repo's existing testing standards and harnesses whenever they exist.
- If stable verification is not possible with current tests or tooling, explain the minimum test or harness additions needed to make investigation reliable.
- Stop after 25 meaningful findings. If you hit the cap, add: `Finding cap reached. Run a follow-up risk review after these issues are triaged or repaired.`

## Severity And Confidence

Severity is based on business impact, not elegance.

- `Critical`: likely security breach, privacy leak, data corruption, financial loss, cross-tenant access, broken critical production flow, or irreversible destructive action
- `High`: likely to break an important workflow, silently lose work, mislead users, or create repeated support load
- `Medium`: incomplete behavior, unhandled edge cases, meaningful test gaps, or confusing failure states
- `Low`: real issue with limited expected user or business harm

Confidence levels:

- `Confirmed`
- `High confidence`
- `Likely`
- `Needs external research`
- `Speculative`

Do not use numeric scoring.

## Investigation Workflow

1. Map the repository before planning findings.
2. If the user provided or referenced a plan, run the Plan Risk Pass before deeper review lanes.
3. Identify:
   - app type and architecture
   - main user-facing flows
   - backend or API routes
   - frontend routes and screens
   - background jobs
   - external integrations
   - authentication and authorization boundaries
   - data models and persistence
   - validation layers
   - test framework and test layout
   - high-risk modules
   - product copy, labels, or docs that imply behavior
4. Build an investigation plan using the attack vectors below, ordered by business risk.
5. Run focused review lanes in this priority order unless the repo clearly suggests a better order:
   - security, privacy, and permissions
   - data integrity
   - financial correctness
   - core flow
   - error handling
   - validation
   - race and idempotency
   - external integrations
   - test weakness
   - frontend state and UX
   - observability
   - maintainability risk
6. For each review lane:
   - state scope
   - inspect relevant files
   - identify candidate issues
   - validate through code, tests, docs, schemas, contracts, or existing checks
   - avoid broad questions
   - mark confidence clearly
   - avoid low-value noise
7. Merge duplicates, prioritize by business impact, and produce one combined report.

## Plan Risk Pass

When the user provides an implementation plan, current approach, ticket breakdown, or proposed architecture, review that plan before launching deeper lanes.

Evaluate:

- whether the approach matches existing architecture and local conventions
- simpler or safer approaches already available in the codebase
- likely missed edge cases, negative paths, permissions, validation, persistence, concurrency, and rollback behavior
- test gaps that would let the planned work appear complete while still being broken
- migration, rollout, observability, and support risks
- ambiguous requirements that materially change implementation or acceptance tests
- places where the plan overreaches, under-specifies behavior, or couples unrelated work

Return plan recommendations early in the report. Tie each recommendation to evidence from the codebase or an explicit unresolved assumption.

## Attack Vectors

Run all of these, weighted by business impact:

1. Permission and ownership mismatch
2. Cross-tenant or cross-account leakage
3. Destructive action safety
4. Payment and billing correctness
5. Core flow happy-path breakage
6. Silent failure
7. Unhandled exception
8. Swallowed error
9. Missing validation
10. Validation drift
11. State-machine invalid transition
12. Race condition
13. Idempotency gap
14. External dependency failure
15. File, import, or export failure
16. Pagination, filter, or sort boundary
17. Cache or stale data
18. Background job failure
19. Configuration or environment assumption
20. Product copy mismatch
21. Weak assertion
22. Mock honesty
23. Negative-path gap
24. Test could pass while product is broken
25. Observability gap
26. Maintainability risk hiding defects

## Operator Questions

Do not ask broad questions. Ask only when:

- product intent cannot be inferred from code, tests, docs, or UI copy
- the codebase contains conflicting signals
- the issue depends on business rules
- one narrow answer will resolve the uncertainty

When asking:

- prefer a narrow multiple-choice style question
- ask only what is needed to classify or validate the finding
- if ambiguity would require many follow-ups, create a `Needs external research` finding instead

## Review Lane Briefs

Use these nested briefs when the investigation benefits from decomposition. They are not standalone skills; load only the briefs relevant to the scope.

- [`reviews/security-privacy-permissions.md`](./reviews/security-privacy-permissions.md)
- [`reviews/data-integrity.md`](./reviews/data-integrity.md)
- [`reviews/financial-correctness.md`](./reviews/financial-correctness.md)
- [`reviews/core-flow.md`](./reviews/core-flow.md)
- [`reviews/error-handling.md`](./reviews/error-handling.md)
- [`reviews/validation.md`](./reviews/validation.md)
- [`reviews/race-idempotency.md`](./reviews/race-idempotency.md)
- [`reviews/external-integrations.md`](./reviews/external-integrations.md)
- [`reviews/test-weakness.md`](./reviews/test-weakness.md)
- [`reviews/frontend-state-ux.md`](./reviews/frontend-state-ux.md)
- [`reviews/observability.md`](./reviews/observability.md)
- [`reviews/maintainability-risk.md`](./reviews/maintainability-risk.md)

## Report Format

Return a single combined report in this structure:

```md
# Vette Report
## Executive summary
## Scope investigated
## Plan recommendations
## Commands run
## Findings by priority
## Testing gaps
## Product or copy mismatches
## Needs external research
## Follow-up recommendation
```

Omit `Plan recommendations` only when no plan was provided or inferred.

Group findings by `Critical`, `High`, `Medium`, and `Low`.

Fully document `Critical`, `High`, and `Medium` findings. Summarize `Low` findings unless they are especially actionable or reveal a broader pattern.

Use this finding schema:

- Title
- Severity
- Confidence
- Priority rationale
- User / business impact
- What appears to happen
- What should happen
- Evidence
- QA validation notes
- Engineering notes
- Suggested resolution
- Suggested tests
- Open questions
- Status
