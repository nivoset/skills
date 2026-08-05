# Requirements / Linear Review

## Lane Id

`requirements`

## Purpose

Detect requirement coverage gaps by comparing tracker requirements against the diff and changed-code behavior.

## Topic Scope

Detect requirement coverage gaps only: compare the Linear requirements context against the diff and changed-code behavior; report missing acceptance criteria, unclear scope matches, implementation gaps, or requirement ambiguity that needs human review.

## When to Use

- Use when a PR, branch, ticket, or plan references Linear issues or acceptance criteria.
- Use when the bundle includes PR metadata or Linear issue views.
- Do not invent requirements when no issue context exists; report uncertainty instead.

## Core Rules

- Pull requirements from PR body, linked issues, branch names, ticket docs, and Linear CLI views when available.
- Compare stated acceptance criteria to actual changed files and behavior.
- Do not silently change scope or assume unstated requirements.
- If no issue ID or requirement source is available, return uncertainty rather than fabricated gaps.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- ticket acceptance criteria with no implementation or test evidence in the diff
- implementation that does not match ticket title, description, or checklist items
- partial delivery where only a subset of required behavior was implemented
- ambiguous requirements that block correct acceptance tests
- PR scope that appears unrelated to the linked issue
- missing tests for acceptance criteria explicitly promised in the ticket
- conflicts between PR description, Linear issue, and implemented behavior

Attack vectors to emphasize:

- product copy mismatch
- negative-path gap when AC implies a case not covered
- core flow happy-path breakage relative to stated outcome

## Workflow

1. State resolved scope, changed paths, and requirement sources inspected.
2. Extract acceptance criteria, scope boundaries, and explicit out-of-scope notes.
3. Map each requirement to changed code, UI copy, APIs, and tests.
4. Mark gaps, partial matches, and ambiguities needing human review.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Cite the requirement source and the evidence that the diff does not satisfy or only partially satisfies it.
