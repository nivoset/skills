---
name: planning-decomposer
description: Split a scoped outcome into independently testable tickets with clear dependencies, useful code references, and plain-English acceptance tests.
---

# Planning Decomposer

## Purpose

Use this skill to turn a scoped initiative into a nested ticket hierarchy that a developer can execute one leaf ticket at a time.

## When to Use

- Use when the desired behavior is understood well enough to split into implementation tickets.
- Use when the user wants epics, features, work items, or leaf tickets with explicit acceptance tests.
- Use when the orchestrator has already gathered the key codebase facts and unresolved decisions.
- Do not use as the first step when repository research is still missing.

## Core Rules

- Use outcome-oriented ticket names.
- Split until each leaf ticket is independently testable.
- Prefer one primary acceptance test per leaf ticket.
- Separate unrelated behaviors into separate leaf tickets.
- Keep dependencies only where a downstream ticket truly cannot be tested first.
- Keep acceptance tests user- or stakeholder-facing and free of implementation detail.
- Phrase non-functional work as user or stakeholder benefit.

## Splitting Guidance

Split a ticket when:

- one acceptance test requires functionality that does not exist yet
- a prerequisite behavior must land first
- work spans unrelated user behaviors
- work crosses separate verification areas such as UI, API, permissions, data, jobs, integrations, migration, observability, resilience, performance, accessibility, or security
- a developer would need to solve unrelated implementation problems to complete it safely

Avoid ticket names like:

- `Refactor BillingService`
- `Add Redis cache`
- `Update schema`
- `Fix API`

Prefer names like:

- `Let users recover access when their invitation expires`
- `Keep checkout available when the primary payment provider is unavailable`
- `Help support diagnose failed imports without engineering help`

## Workflow

1. Confirm the scoped outcome, assumptions, and unresolved decisions.
2. Sketch the hierarchy from epic or feature down to leaf tickets.
3. Split work until each leaf ticket has one primary observable behavior to verify.
4. Attach only the dependencies that are truly blocking.
5. Add acceptance tests, code references, and verification areas for each leaf ticket.

## Output Format

Return:

```md
# Ticket Breakdown
## Ticket hierarchy
## Leaf tickets
## Assumptions and open questions
```

For each leaf ticket include:

- Title
- Parent
- Goal
- User or stakeholder benefit
- Acceptance test
- Dependencies
- Useful code references
- Suggested verification area
- Out of scope
- Assumptions or open questions

## References

- [`references/ticket-template.md`](./references/ticket-template.md)
- [`references/acceptance-test-guide.md`](./references/acceptance-test-guide.md)
