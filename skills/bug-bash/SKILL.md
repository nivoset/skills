---
name: bug-bash
description: Orchestrate a read-only bug bash across a whole codebase or a named area using specialized review subskills and a shared finding format.
---

# Bug Bash

## Purpose

Use this skill to run a codebase bug bash that finds, validates, prioritizes, and documents likely defects, incomplete behavior, weak tests, missing validations, unhandled failures, product mismatches, and flows where tests could pass while the product is broken.

This skill is the orchestrator. It owns repository mapping, investigation planning, subagent coordination, deduplication, prioritization, and final report assembly.

## When to Use

- Use when the user asks for a bug bash, defect review, breakage review, or high-signal quality sweep.
- Use when the user wants subagents to review the whole codebase or a named subsystem.
- Use when the user wants a single merged report instead of disconnected notes.
- Do not use when the user wants implementation or repairs instead of investigation.

## Scope Inputs

Default to a whole-codebase review.

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

State the resolved scope near the top of the report.

## Core Rules

- Inspect the codebase before asking the operator questions.
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
- Stop after 25 meaningful findings. If you hit the cap, add: `Finding cap reached. Run a follow-up bug bash after these issues are triaged or repaired.`

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
2. Identify:
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
3. Build an investigation plan using the attack vectors below, ordered by business risk.
4. Run focused sub-reviews in this priority order unless the repo clearly suggests a better order:
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
5. For each sub-review:
   - state scope
   - inspect relevant files
   - identify candidate issues
   - validate through code, tests, docs, schemas, contracts, or existing checks
   - avoid broad questions
   - mark confidence clearly
   - avoid low-value noise
6. Merge duplicates, prioritize by business impact, and produce one combined report.

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

## Subskill Routing

Use or simulate these focused review roles when the investigation benefits from decomposition:

- `bug-bash-security-privacy-permissions`
- `bug-bash-data-integrity`
- `bug-bash-financial-correctness`
- `bug-bash-core-flow`
- `bug-bash-error-handling`
- `bug-bash-validation`
- `bug-bash-race-idempotency`
- `bug-bash-external-integrations`
- `bug-bash-test-weakness`
- `bug-bash-frontend-state-ux`
- `bug-bash-observability`
- `bug-bash-maintainability-risk`

## Report Format

Return a single combined report in this structure:

```md
# Bug Bash Report
## Executive summary
## Scope investigated
## Commands run
## Findings by priority
## Testing gaps
## Product or copy mismatches
## Needs external research
## Follow-up recommendation
```

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
