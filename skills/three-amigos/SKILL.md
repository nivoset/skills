---
name: three-amigos
description: Use when refining a feature, user story, workflow, or requirements before implementation through a Three Amigos workshop with business analysis, engineering, QA, and a mock-customer usability perspective. Use to align behavior, acceptance scenarios, risks, assumptions, and customer-flow simplifications.
---

# Three Amigos

## Purpose

Run a structured, evidence-based workshop that produces one shared behavior specification before implementation. The parent agent orchestrates four independent perspectives: business analysis, engineering, QA, and a mock customer.

## Core Rules

- Inspect the supplied request and relevant repository, product, or design evidence before dispatching agents.
- Keep role agents read-only unless the user explicitly requests a different activity. Do not commit, change the product, or contact external systems.
- Give every role the same concise context packet: the requested outcome, known evidence, constraints, and the exact question to answer.
- Keep roles independent. Do not ask one role to validate another role's conclusions before synthesis.
- Run the roles in parallel when capacity permits; otherwise run them sequentially without changing their briefs.
- Reconcile compatible conclusions, deduplicate overlaps, and surface conflicts or missing business decisions to the user only when they materially change behavior.
- Do not turn the workshop into an implementation plan. Identify implementation constraints and risks without choosing an architecture or task breakdown.

## Workshop

### 1. Establish The Context

Extract the user goal, actors, stated rules, workflow, explicit constraints, source material, and unresolved terms. Inspect relevant code, tests, documentation, product copy, and designs when available. Distinguish evidence from assumptions.

If the request lacks enough information to describe a user-visible outcome, ask the narrowest question needed before dispatching agents.

### 2. Dispatch The Four Roles

Start one bounded subagent for each role. Require each to return concise, evidence-backed observations and to label assumptions.

**Business analyst**

- Clarify the user or stakeholder goal, actors, business rules, scope boundaries, and success outcomes.
- Identify ambiguous requirements and decision points.
- Do not unilaterally decide priorities or product tradeoffs.

**Engineering**

- Identify current-system constraints, relevant dependencies, data or state implications, integrations, and delivery risks.
- Point out technical questions that materially affect the observable behavior.
- Do not select an implementation, refactor, or task breakdown.

**QA**

- Define observable happy-path, negative-path, boundary, permission, recovery, and testability expectations.
- Draft behavior-first acceptance scenarios; use Given/When/Then wording when it improves clarity.
- Do not test implementation mechanics or assert unsupported business rules.

**Mock customer**

- Walk the primary journey as an ordinary user, especially routine or high-frequency tasks.
- Flag unclear labels, confusing order, missing feedback, jargon, duplicate entry, and unnecessary steps.
- Recommend the simpler alternative and explain the user impact of leaving the friction in place.
- Determine whether a task is common from the request and available evidence. If frequency is unknown, label the recommendation as an assumption.
- Treat every finding as non-blocking: it is a recommendation, not a new requirement or a reason to withhold the shared specification.

### 3. Reconcile And Return

Merge role outputs into one coherent specification. Preserve explicit product constraints over inferred preferences. If a customer recommendation conflicts with a stated constraint, retain it as a recommendation and explain the tradeoff.

Ask the user only when conflicting evidence or an unresolved business rule would produce meaningfully different acceptance behavior. Otherwise state the assumption and continue.

## Output Format

Return one report, not four role transcripts:

```md
# Three Amigos Workshop

## Shared understanding
## Agreed behavior and scope
## Acceptance scenarios
## Assumptions and open decisions
## Engineering and QA risks
## Customer experience recommendations
```

In `Customer experience recommendations`, label each item `Non-blocking recommendation`, name the affected journey, describe the friction, recommend a simpler alternative, explain the expected customer impact, and state any frequency assumption.

Omit empty sections. Keep acceptance scenarios behavior-first and use the `bdd` skill when a fuller Gherkin specification is requested.
