---
name: objective-check
description: Use when validating that an Epic, Feature, parent ticket, or ticket subtree is coherent, dependency-safe, testable, and ready before implementation or TDD orchestration.
---

# Objective Check

## Overview

Objective Check validates whether a quest's objectives are covered by descendants, dependencies, blockers, acceptance criteria, and automated test evidence. It is an audit skill: do not silently change scope, do not implement code, do not manage PRs, and do not auto-promote tickets. Update stable comments for actionable findings, summarize triage-only blockers without noisy comments, and continue to the next eligible ticket when safe.

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
- Existing objective-check or TDD orchestration comments so repeat runs can update stable findings instead of duplicating them.
- Parent Summary, Desired/Expected Outcome, Scope Boundaries, and Behavior Blueprint if present.
- Child `Covers: SCN-*` references, numbered ACs, dependencies, and Test Evidence.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Recursive | Validate all descendants, not only direct children. |
| Tracker-neutral | Use tracker-discovered statuses/labels/rules; ask when mappings are ambiguous. Treat the tracker as the durable source of truth; do not rely on a local manifest or cached run state for verdicts. |
| Manual promotion | Do not move triage/review-needed tickets to Todo/ready. For current Linear TDD orchestration, Todo is the runnable leaf status after manual review. |
| Missing evidence | Do not advance or promote affected work when evidence is missing. Update the stable finding comment for actionable gaps and continue to the next eligible branch unless the root contract is blocked. |
| Triage blockers | Stop the affected branch when a triage/review-needed ticket blocks remaining descendant work. Do not comment on triage tickets solely because they are triage; summarize them in the report/refinement priorities unless there is a concrete validation finding. |
| Parent behavior | Validate behavior-level Gherkin/objectives, not implementation-step precision. |
| Test standard | For pre-implementation readiness, planned automated tests must cover every AC. For parent verification/QA readiness, executed passing evidence or approved exceptions must exist for every descendant AC. |
| Dependencies | Features may block features; tickets may block tickets; feature-ticket mixed blockers are valid. |
| PR automation | Treat linked PR/tracker automation as status/readiness evidence only; do not manage PRs from this skill. If a Todo/runnable ticket already has a PR, report `todo_has_pr`, include the PR URL/comment target, skip it, and continue. |
| Scope changes | Ask before creating/splitting tickets or changing the breakdown. |

## Objective Validation Workflow

1. **Discover workflow mappings**
   - Pull tracker statuses, labels, ticket types, hierarchy, blockers, comments, PR links, and automation rules.
   - Map triage/review-needed, Todo/implementation-ready, in-progress, verification-ready, done, and canceled. Ask if uncertain.
   - Re-fetch mappings and graph state before each verdict; local notes are scratch, not durable source of truth.
2. **Fetch the graph**
   - Load the root ticket, recursive descendants, dependencies, blockers, linked branches/PRs, and relevant comments.
   - Classify each node as parent/non-leaf, leaf, blocked, triage/review-needed, Todo/implementation-ready, in-progress, done, canceled, or PR-owned.
3. **Extract objectives**
   - List parent outcomes, scope boundaries, behavior scenarios (`SCN-*`), and explicit non-goals/deferred notes.
4. **Build the coverage matrix**
   - Map each parent objective/scenario to child tickets.
   - Map each child ticket to numbered ACs.
   - Map each AC to Test Evidence and verification commands/statuses.
5. **Check dependencies and sequence**
   - Detect circular blockers, unavailable prerequisites, parent objectives blocked by sibling/dependent features, duplicate/conflicting work, and stranded leaves.
   - If a Todo/runnable ticket is already linked to an active PR, classify it as `todo_has_pr`, record the PR URL/comment target, make no other changes from this skill, and continue.
6. **Decide readiness**
   - Pre-implementation ready leaf: Todo/implementation-ready status, unblocked, leaf/no children, no active PR skip, numbered ACs, planned Test Evidence per AC, expected red failures specific enough to write/identify tests, and parent coverage clear.
   - Parent verification/QA ready: all descendant requirements are implemented, unblocked, and verified with executed passing evidence or approved exceptions; canceled/deferred items are explicitly marked non-goal.
   - Not ready: missing/ambiguous ACs, missing Test Evidence, uncovered parent objectives, unresolved blockers, conflicting dependencies, mixed unrelated behaviors, unclear tracker mappings, or triage blockers in the selected branch.
   - Parent with uncovered direct work: classify as requiring decomposition or explicitly approved direct parent work; do not silently treat the parent as ready.
   - No runnable work: if no ready leaf remains after exclusions, return a per-ticket state summary and refinement priority list instead of handing off to implementation.
7. **Comment issues at the right level**
   - Before posting, search for the stable objective-check marker on the ticket and update the existing agent-owned comment when possible instead of duplicating comments.
   - Leaf-local actionable gap: comment on the leaf.
   - Scenario coverage/decomposition gap: comment on the parent.
   - Root contract or whole-run blocker: comment on the root.
   - Triage-only blockers: do not comment solely because they are triage; include them in the state summary/refinement priorities.
   - Use [`references/finding-comment.md`](./references/finding-comment.md).
8. **Report and continue**
   - Report ready leaves, `todo_has_pr` skips, skipped/done/canceled items, blocked/not-ready items, comments needed/posted, unresolved questions, and refinement priorities.
   - If no runnable leaves remain, report `no_runnable_work` with per-ticket state and refinement priority order.
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
Todo with PR: <ticket IDs and PR URLs/comment targets>
Blocked/not ready: <ticket IDs and reason>
No runnable work: <yes/no; per-ticket state summary when yes>
Refinement priorities: <ordered list of manual refinements that unblock future work>
Coverage gaps: <SCN/objective -> missing/conflict/deferred>
Dependency risks: <blockers/cycles/conflicts>
Comments: <posted/prepared/updated comment links or targets>
Next action: <continue / ask for split approval / no_runnable_work / stop root run>
```

## Common Mistakes

| Mistake | Correct behavior |
|---------|------------------|
| Validating only direct children | Traverse the full descendant tree. |
| Treating manual testing as a replacement for automated evidence | Require planned automated coverage for every AC unless explicitly waived; require executed passing evidence for verification readiness. |
| Auto-fixing scope gaps | Comment and ask/propose via `questline`; do not silently change scope. |
| Stopping all work for a local leaf issue | Update the stable leaf finding and continue elsewhere unless the root contract is blocked. |
| Commenting on triage-only blockers | Summarize triage blockers in no-runnable-work/refinement output unless there is a concrete validation finding. |
| Hardcoding Linear statuses | Discover tracker mappings or ask; for current Linear TDD orchestration, Todo is the runnable status. |
| Processing PR-linked tickets unnecessarily | Report `todo_has_pr` with the PR URL/comment target, then skip and continue. |
