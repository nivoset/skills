---
name: questline
description: Use when building, grooming, or refining an Epic, Feature, parent ticket, or ticket tree before implementation so work can be manually reviewed, promoted from triage, and later executed with TDD.
---

# Questline

## Overview

Questline turns an Epic/Feature/ticket tree into a reviewed, behavior-backed, testable set of child tickets. It is a grooming skill, not an implementation skill: map the tracker tree, propose changes, ask before splitting, create only triage tickets after approval, and leave targeted comments for actionable mismatches, ambiguities, uncovered behavior, or workable-ticket readiness gaps.

## Use With

- **REQUIRED VALIDATION PARTNER:** Use `objective-check` after mapping or changing a questline to validate objective coverage, dependencies, acceptance criteria, and test evidence.
- Use `ticket-building-system` for generic ticket wording/templates when drafting individual tickets.
- Use `tdd` only after a manually reviewed ticket is promoted to the tracker workflow's implementation-ready status.
- Use `ticket-master` only for implementation sequencing after the questline is vetted.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Start point | Accept an Epic, Feature, or parent ticket as the root. |
| Tracker source | Pull status names, labels, workflow rules, blocker types, hierarchy, comments, PR links, and dependencies from the tracker itself when available; do not hardcode Linear-specific mappings. Do not maintain a durable local manifest or second tracking system. |
| Recursive tree | Fetch all descendants, not only direct children. Re-query the tracker before each grooming pass instead of trusting cached local state. |
| Creation default | New tickets are created only as triage/review-needed items unless the user explicitly says otherwise. Manual review promotes them to Todo/ready; for current Linear TDD orchestration, Todo is the runnable leaf status. |
| Parent behavior | Parent Gherkin describes expected user/system behavior in plain English, not DOM selectors, component internals, or API step scripts. |
| Splitting | If child tickets need to be split or added, propose the breakdown and ask for approval before creating or validating them. |
| Missing evidence | Do not silently change scope or promote readiness. For actionable mismatches, ambiguity, uncovered behavior, or workable-ticket readiness gaps, update the stable finding comment and continue reviewing the next eligible parent/ticket when safe. Do not comment on triage tickets solely because they block implementation. |
| No runnable work | If no tracker-confirmed runnable leaf remains, do not hand off to implementation. Return a per-ticket state summary and refinement priority list. |
| Readiness verdict | Do not select, run, sequence, or mark leaves implementation-ready based only on Questline; `objective-check` owns the final validation verdict. |
| Implementation WIP | Patch/gist capture belongs to the implementation agent, not Questline. Do not recommend local stashes for v1 orchestration. |

## Workflow

1. **Resolve tracker rules**
   - Identify available ticket types, statuses, labels, hierarchy links, blocker/dependency links, comments, PR links, and status semantics from the active tracker.
   - Record which statuses mean triage/review-needed, implementation-ready/Todo, in-progress, done, canceled, and verification-ready. If uncertain, ask.
   - Treat the tracker as durable source of truth; local notes are temporary scratch only.
2. **Map the quest tree**
   - Fetch the root ticket and every descendant recursively.
   - Classify each item as parent/non-leaf, leaf, triage/review-needed, implementation-ready/Todo, blocked, done, canceled, or PR-owned using tracker rules.
   - Capture cross-tree dependencies: feature-to-feature, ticket-to-ticket, and mixed feature-ticket blockers.
3. **Shape parent objectives**
   - Ensure parent tickets have a concise Summary, Desired/Expected Outcome, Scope Boundaries, and behavior-level blueprint when they coordinate multiple children.
   - Use stable scenario IDs such as `SCN-1` only for behavior coverage mapping.
4. **Shape leaves**
   - Leaf tickets should have numbered acceptance criteria, explicit scope boundaries, dependencies/blockers, code references when known, and Test Evidence for each AC.
   - Automated tests should cover all acceptance criteria. Manual review/testing may supplement but should not replace planned automated coverage unless explicitly accepted.
5. **Propose splits before changing structure**
   - If a leaf mixes unrelated behaviors or parent objectives are uncovered, draft a split proposal using `references/split-proposal-template.md`.
   - Ask for approval before creating child tickets or validating the new breakdown.
6. **Create/update conservatively**
   - New tickets default to triage/review-needed.
   - Do not auto-promote tickets to Todo/ready.
   - Leave new or updated tickets in triage/review-needed until manual review and `objective-check` both pass.
   - Update stable comments for actionable mismatches, ambiguity, uncovered behavior, or workable-ticket readiness gaps at the most specific ticket level, using the `objective-check` finding marker/template when possible.
   - If triage/review-needed items block all runnable leaves, report them in the final state summary and refinement priority list instead of commenting solely because they block implementation.
7. **Hand off to objective-check**
   - Run or request `objective-check` before any implementation/TDD orchestration.
   - Treat Questline output as a proposed/groomed structure until `objective-check` validates it.

## Behavior Blueprint

Use the format in [`references/behavior-blueprint.md`](./references/behavior-blueprint.md) for parent tickets that coordinate multiple child behaviors.

## Ticket Evidence

Use the format in [`references/test-evidence.md`](./references/test-evidence.md) for leaf tickets and bugs.

## Split Proposal

Use [`references/split-proposal-template.md`](./references/split-proposal-template.md) when decomposition is needed.

## Common Mistakes

| Mistake | Correct behavior |
|---------|------------------|
| Treating an Epic as directly implementable | Recursively map descendants and only consider vetted implementation-ready leaves. |
| Creating Todo tickets immediately | Create triage/review-needed tickets first; manual review promotes them. |
| Writing precise implementation Gherkin | Keep scenarios behavior-level and user/system observable. |
| Auto-splitting tickets | Propose the split, ask, then create only after approval. |
| Blocking the whole run on one gap | Update the stable finding for actionable issues and continue with the next eligible branch unless the root contract is blocked. |
| Using Linear-only status names | Discover tracker-specific mappings or ask. |
