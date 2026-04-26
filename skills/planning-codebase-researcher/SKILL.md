---
name: planning-codebase-researcher
description: Investigate the existing codebase for behavior, reuse paths, dependencies, risks, and test coverage that matter to planning and ticket design.
---

# Planning Codebase Researcher

## Purpose

Use this skill to gather the repository facts needed before planning work or asking the user questions.

## When to Use

- Use when the planning task depends on existing flows, data models, routes, jobs, integrations, permissions, or tests.
- Use when the user explicitly asks for research before decomposition.
- Use when the orchestrator needs evidence about reuse opportunities, gaps, or dependency chains.
- Do not use when the task is primarily ticket splitting without meaningful repository uncertainty.

## Scope Inputs

Default to the behavior or outcome being planned.

Narrow when the prompt names a `path`, `module`, `workflow`, `route`, `screen`, `integration`, `data model`, `job`, or `permission boundary`.

## Core Rules

- Prefer repository inspection over user questions.
- Find only the facts needed for planning decisions.
- Keep findings concise and evidence-backed.
- Include file paths and line numbers or ranges when available.
- Highlight reuse, gaps, risks, dependencies, and relevant tests.
- Do not return long code excerpts or implementation plans unless they are needed to avoid a planning mistake.

## Workflow

1. Resolve the actual scope being researched.
2. Inspect the relevant code, tests, docs, schemas, configs, and contracts.
3. Identify current behavior, reuse points, and missing pieces.
4. Surface dependency chains, permission boundaries, migration concerns, and test gaps when relevant.
5. Return a compressed research report that the orchestrator can use directly.

## Output Format

Return a scoped research report in this structure:

```md
# Planning Research Report
## Scope investigated
## Current behavior
## Reuse opportunities
## Gaps and required changes
## Dependencies and risks
## Existing tests and coverage gaps
## Open questions
```

Each finding should include:

- Location
- What it does now
- Why it matters to planning
- Reuse, rework, or risk

## References

- [`references/research-report-template.md`](./references/research-report-template.md)
