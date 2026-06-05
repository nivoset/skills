---
name: objective-check
description: Use when validating that an Epic, Feature, parent ticket, or ticket subtree is coherent, dependency-safe, testable, and ready before implementation or TDD orchestration.
---

# Objective Check

## Overview

Objective Check validates whether a quest's objectives are covered by descendants, dependencies, blockers, acceptance criteria, and automated test evidence. It is an audit skill: do not silently change scope, do not implement code, and do not auto-promote tickets. Comment precise issues, keep blocked work visible, and continue to the next eligible ticket when safe.

## Use With

- Use after `questline` maps, grooms, or proposes a ticket tree.
- Use before `ticket-master`, `tdd`, or any implementation agent starts work from a parent ticket.
- Use alongside tracker integrations that can fetch hierarchy, statuses, labels, dependencies, comments, branches, PRs, and workflow rules.

## Validation Inputs

Require or discover:

- Root Epic, Feature, or parent ticket ID.
- Tracker workflow rules: statuses, labels, ticket types, done/canceled semantics, triage/review-needed semantics, implementation-ready semantics, blocker/dependency relation types.
- Full recursive descendant tree.
- Cross-tree dependencies and blockers.
- Existing PR/branch links and tracker automation rules when visible.
- Parent Summary, Desired/Expected Outcome, Scope Boundaries, and Behavior Blueprint if present.
- Child `Covers: SCN-*` references, numbered ACs, dependencies, and Test Evidence.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Recursive | Validate all descendants, not only direct children. |
| Tracker-neutral | Use tracker-discovered statuses/labels/rules; ask when mappings are ambiguous. |
| Manual promotion | Do not move triage/review-needed tickets to Todo/ready. |
| Missing evidence | Leave or keep affected work in progress when applicable, comment the blocker, and continue to the next eligible branch unless the root contract is blocked. |
| Triage blockers | Stop the affected branch when a triage/review-needed ticket blocks remaining descendant work; comment the blocker and continue only with unrelated branches. |
| Parent behavior | Validate behavior-level Gherkin/objectives, not implementation-step precision. |
| Test standard | For pre-implementation readiness, planned automated tests must cover every AC. For parent verification/QA readiness, executed passing evidence or approved exceptions must exist for every descendant AC. |
| Dependencies | Features may block features; tickets may block tickets; feature-ticket mixed blockers are valid. |
| PR automation | Treat linked PR/tracker automation as status/readiness evidence only; do not manage PRs from this skill. If automation owns transitions, note it and skip direct processing when safer. |
| Scope changes | Ask before creating/splitting tickets or changing the breakdown. |

## Objective Validation Workflow

1. **Discover workflow mappings**
   - Pull tracker statuses, labels, ticket types, hierarchy, blockers, and automation rules.
   - Map triage/review-needed, Todo/implementation-ready, in-progress, verification-ready, done, and canceled. Ask if uncertain.
2. **Fetch the graph**
   - Load the root ticket, recursive descendants, dependencies, blockers, linked branches/PRs, and relevant comments.
   - Classify each node as parent/non-leaf, leaf, blocked, triage/review-needed, implementation-ready, in-progress, done, or canceled.
3. **Extract objectives**
   - List parent outcomes, scope boundaries, behavior scenarios (`SCN-*`), and explicit non-goals/deferred notes.
4. **Build the coverage matrix**
   - Map each parent objective/scenario to child tickets.
   - Map each child ticket to numbered ACs.
   - Map each AC to Test Evidence and verification commands/statuses.
5. **Check dependencies and sequence**
   - Detect circular blockers, unavailable prerequisites, parent objectives blocked by sibling/dependent features, duplicate/conflicting work, and stranded leaves.
   - If a ticket is already linked to an active PR and tracker automation owns its status, record that and skip direct processing when safer.
6. **Decide readiness**
   - Pre-implementation ready leaf: implementation-ready status, unblocked, numbered ACs, planned Test Evidence per AC, expected red failures specific enough to write/identify tests, and parent coverage clear.
   - Parent verification/QA ready: all descendant requirements are implemented, unblocked, and verified with executed passing evidence or approved exceptions; canceled/deferred items are explicitly marked non-goal.
   - Not ready: missing/ambiguous ACs, missing Test Evidence, uncovered parent objectives, unresolved blockers, conflicting dependencies, mixed unrelated behaviors, unclear tracker mappings, or triage blockers in the selected branch.
   - Parent with uncovered direct work: classify as requiring decomposition or explicitly approved direct parent work; do not silently treat the parent as ready.
7. **Comment issues at the right level**
   - Before posting, search for an existing objective-check finding on the same scenario/AC/problem and update it when possible instead of duplicating comments.
   - Leaf-local gap: comment on the leaf.
   - Scenario coverage/decomposition gap: comment on the parent.
   - Root contract or whole-run blocker: comment on the root.
   - Use [`references/finding-comment.md`](./references/finding-comment.md).
8. **Report and continue**
   - Report ready leaves, skipped/done/canceled items, blocked items, comments needed/posted, and unresolved questions.
   - Continue to the next eligible parent/ticket unless the root contract is blocked.

## Readiness Checklist

Use [`references/readiness-checklist.md`](./references/readiness-checklist.md) for the detailed audit.

## Output Contract

Return a concise report with:

```markdown
## Objective Check Result

Root: <ticket>
Tracker mappings: <confirmed/unknown items>
Ready leaves: <ticket IDs and covered SCN/AC IDs>
Blocked/not ready: <ticket IDs and reason>
Coverage gaps: <SCN/objective -> missing/conflict/deferred>
Dependency risks: <blockers/cycles/conflicts>
Comments: <posted/prepared comment links or targets>
Next action: <continue / ask for split approval / stop root run>
```

## Common Mistakes

| Mistake | Correct behavior |
|---------|------------------|
| Validating only direct children | Traverse the full descendant tree. |
| Treating manual testing as a replacement for automated evidence | Require planned automated coverage for every AC unless explicitly waived; require executed passing evidence for verification readiness. |
| Auto-fixing scope gaps | Comment and ask/propose via `questline`; do not silently change scope. |
| Stopping all work for a local leaf issue | Comment the leaf and continue elsewhere unless the root contract is blocked. |
| Hardcoding Linear statuses | Discover tracker mappings or ask. |
| Processing PR-linked tickets unnecessarily | Respect tracker/PR automation when visible; skip direct processing if safer. |
