---
name: ticket-building-system
description: Use when creating, editing, or triaging tracker-neutral tickets, issues, bugs, spikes, epics, features, or implementation tasks.
---

# Ticket Building System

## Overview

Tracker-neutral workflow for drafting, reviewing, editing, and optionally creating tickets. Draft useful plain Markdown first, keep tracker metadata explicit, and require review before any externally visible create or edit action.

## Ticket Tiers

Use these tiers as defaults unless the team, tracker, or user provides a different taxonomy.

| Tier | Definition | Default Placement |
|------|------------|--------------------|
| Epic | Top-level user story or full functionality | None |
| Feature | Scoped capability within a larger outcome | Parent Epic recommended |
| Task | Technical implementation work | Parent Feature recommended |
| Bug | Defect, regression, or unexpected behavior | Parent Feature or affected area optional |
| Spike | Time-boxed research or validation | Parent Feature or decision area optional |

## Policy and Permissions

- Follow explicit team or tracker policy when provided.
- If no policy is known, treat roles, parent rules, labels, estimates, and workflow states as configurable metadata.
- Ask for role or authorization only when it affects whether a ticket can be created, edited, assigned, or moved.
- Do not create or edit externally visible tickets until the user explicitly approves the final draft and metadata.

## Placement and Session Context

1. Resolve placement before drafting.
2. If the request includes an issue ID, URL, project, milestone, label, or parent, treat it as placement or base context.
3. If parent context is available, fetch or inspect it when an integration is available and inherit relevant project, team, milestone, labels, and parent placement unless the user overrides.
4. If required placement is missing, ask only for the fields needed by the target tracker or team workflow.
5. Remember confirmed parent, project, team, and tracker context for the session and reuse unless the user changes them.

## Detail Gathering

Ask only for the minimum information needed to write an accurate ticket. Ask follow-ups only when missing information would make the ticket inaccurate or too vague.

| Tier | Required Fields |
|------|-----------------|
| Epic | Summary, Desired Outcome, Acceptance Criteria, Notes |
| Feature | Summary, Desired Outcome, Acceptance Criteria, Estimate, Notes, Parent or area when required |
| Task | Summary, Desired Outcome, Acceptance Criteria, Notes, Parent or area when required |
| Bug | Summary, Steps to Reproduce, Current Behavior, Expected Behavior, Severity, Notes |
| Spike | Summary, Research Question, Time Box, Expected Output, Notes, Parent (optional) |

## Role-Specific Input

When ticket scoping needs role-specific input, prefer sub-agents over CLI prompts:

- **PM/TL lane**: Use a product-focused sub-agent to shape scope, business outcome, and acceptance criteria.
- **Engineer lane**: Use an engineering sub-agent to validate technical feasibility and break work into implementable tasks.
- **Parent agent**: Synthesize final ticket text and metadata; policy checks stay in this skill.

Alternative: Use `the-agency` CLI to spawn specialist prompts (e.g., `the-agency product product-manager`, `the-agency engineering engineering-senior-developer`).

## Template Reference

Use a native tracker or team template when the user explicitly asks for that tracker and the template is available. Otherwise use the local Markdown templates.

| Tier | Template File | When to Use |
|------|---------------|-------------|
| Epic | `references/template-epic.md` | New user story or full functionality |
| Epic planning | `references/template-epic-planning.md` | Complex epics requiring scope, milestones, dependencies |
| Feature | `references/template-feature.md` | Scoped module within an Epic |
| Task | `references/template-task.md` | Technical implementation work |
| Bug | `references/template-bug.md` | Defects, regressions, unexpected behavior |
| Spike | `references/template-spike.md` | Time-boxed research or validation |

**Validation**: `references/validation-checklist.md`

## "Create a Ticket" Workflow

1. Identify requester role.
2. Resolve placement and remember session context.
3. Determine tier: Epic, Feature, Task, Bug, or Spike.
4. Resolve template source:
   - Use an explicitly requested native tracker or team template when available.
   - Fall back to local `references/template-{type}.md`.
5. Validate parents and required metadata against the active team or tracker policy.
6. Gather only the missing details for the tier.
7. Apply generic defaults unless the user or tracker policy overrides them:
   - State defaults to `Todo`.
   - Assignee defaults to unassigned.
   - Suggested tags: Epic, Feature, Task, Bug, or Spike.
8. Build body from the selected template:
   - Feature estimate uses T-shirt sizing unless another estimate scheme is specified.
   - Keep drafts self-contained and understandable without chat history.
   - Do not duplicate parent, assignee, label, or project metadata that the target tracker already shows separately.
9. Run `references/validation-checklist.md`.
10. **Review before creation**: Show full draft and intended metadata. Do not create until user explicitly approves.
11. **Create after approval**:
    - Use the requested tracker integration when available.
    - If no suitable integration is available, stop after the approved draft and state what must be entered manually.
12. After creation, report the new issue ID and link.
13. If the request violates policy, refuse and provide the next valid action.

## Editing Constraints

- Follow team or tracker permission rules when known.
- If editing a parent ticket would change product scope or stakeholder commitments, show the proposed diff and require explicit approval.
- Do not change assignment, priority, state, labels, dates, or parent links unless the user asked for those metadata changes or they are required by the target workflow.

## Writing Standard

- Make the ticket understandable without the chat history.
- Prefer concise problem statements and expected outcomes over implementation plans.
- Explain the need and the success condition, not what to type.
- Use `Notes` only for constraints, context, or evidence that materially changes understanding.
- Do not inspect the repo or add file paths, modules, routes, docs, or implementation hints by default.
- Include concrete files, docs, or implementation details only when the user explicitly asks or omitting them would be misleading.
- Keep scope tight. Split unrelated work into separate tickets.

## Portability

- Keep the drafting workflow tool-agnostic.
- Use plain Markdown for the final ticket body so it can be copied into any tracker.
- Treat tracker integrations as execution options, not requirements for drafting.
- If no tracker integration is available, the approved draft should still be usable without rewriting.
- Keep company-specific, customer-specific, or private details out of reusable templates unless the user intentionally provides those details for the ticket content.

## Example Invocations

- `Use $ticket-building-system to draft a bug ticket for the tenant switcher 500 error.`
- `Use $ticket-building-system to create an issue under the parent ticket I linked for improving audit log filters.`
- `Use $ticket-building-system to draft a task ticket for cleaning up stale feature flags.`
- `Use $ticket-building-system to create a spike for evaluating caching strategies.`
