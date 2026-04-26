---
name: planning-orchestrator
description: Orchestrate codebase research, decision clarification, and ticket decomposition into independently testable leaf tickets with plain-English acceptance tests.
---

# Planning Orchestrator

## Purpose

Use this skill to turn a desired outcome into an implementation-ready ticket breakdown without asking avoidable questions first.

This skill is the main planning entrypoint. It owns repository mapping, research delegation, decision tracking, dependency handling, and final ticket assembly.

## When to Use

- Use when the user wants to plan a feature, refactor, migration, integration, or large repair.
- Use when the user wants the work split into developer-consumable tickets.
- Use when the user wants codebase research before questions or estimates.
- Do not use when the user only wants implementation, code review, or a bug bash.

## Scope Inputs

Default to the user-stated outcome.

If the prompt narrows scope, accept freeform language and resolve it into one or more of these selectors:

- `path`
- `module`
- `workflow`
- `route`
- `screen`
- `integration`
- `data model`
- `job`
- `permission boundary`

State the resolved scope near the top of the result.

## Core Rules

- Research the repository before asking the user questions.
- Use focused companion skills or sub-agents for codebase facts, reuse mapping, dependency checks, and ticket splitting.
- Ask only questions that materially change scope, behavior, dependencies, or acceptance tests.
- Keep the main thread focused on orchestration, decisions, and the final plan.
- Keep ticket titles outcome-oriented and understandable to product, QA, and engineering readers.
- Keep acceptance tests in plain English and free of implementation details.
- Require one primary `Given/When/Then` acceptance test per leaf ticket by default.
- Include code references with file paths and line numbers or ranges when available. Do not block output on missing columns.
- Keep dependencies explicit only when one leaf ticket truly blocks another.

## Workflow

1. Restate the desired outcome and resolved scope briefly.
2. Map what must be learned from the codebase before planning.
3. Route focused research to `planning-codebase-researcher` or equivalent sub-agents.
4. Summarize only the findings that affect decomposition, reuse, dependencies, risk, or testing.
5. Ask only unresolved product or tradeoff questions that the repository cannot answer.
6. Route ticket splitting to `planning-decomposer` or perform equivalent decomposition directly.
7. Return a nested ticket hierarchy and detailed leaf tickets.

## Companion Skills

Route to or invoke directly when useful:

- `planning-codebase-researcher`
- `planning-decomposer`

The orchestrator is the normal entrypoint, but advanced users may call the companion skills directly for focused work.

## Output Format

Return one planning result in this structure:

```md
# Planning Breakdown
## Shared understanding
## Key decisions
## Ticket hierarchy
## Leaf tickets
## Assumptions and open questions
```

Keep `Key decisions` brief. Include it only when decisions affect ticket shape, dependencies, or acceptance tests.

For each leaf ticket include:

- Title
- Parent
- Goal
- User or stakeholder benefit
- Acceptance test
- Dependencies
- Useful code references
- Suggested verification area
- Assumptions or open questions

## References

Use these reference files when the work needs deeper structure:

- [`references/subagent-research-template.md`](./references/subagent-research-template.md)
- [`references/decision-template.md`](./references/decision-template.md)
- [`references/final-quality-checklist.md`](./references/final-quality-checklist.md)
