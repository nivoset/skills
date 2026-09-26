---
name: tdd
description: Use when implementing software features or bug fixes with behavior tests, acceptance criteria, or changing requirements that need traceable test coverage.
---

# TDD orchestrator

Use a parent-owned behavior inventory and one isolated lane at a time. This file defines the state machine and dispatch contract. The detailed instructions live in `lanes/` so an orchestrator can pass one lane file with a small task packet instead of repeatedly loading the whole workflow.

## When to use

- Feature or bugfix implementation with behavior tests.
- Acceptance criteria that must be delivered incrementally.
- Work where coverage can change as code, review, or risk analysis reveals conditions.

Do not use for read-only reviews, planning-only work, pure documentation edits, or an explicitly authorized emergency bypass.

## State machine

```text
inventory -> red -> red-verifier -> green -> reviewer -> refactor -> close
               ^         |             |          |          |
               |         |             v          |          |
               +---------+         reviewer <- reject      skip if no change
```

- Invalid red: return to `red` with the verifier evidence.
- Valid red: continue to `green`.
- Green failure: return to `green` or mark the row `blocked`; never weaken the test.
- Reviewer rejection: return to `green` with only the requested correction.
- No useful refactor: record `refactor: skipped`, then close.
- Any unresolved scope question: stop at `inventory` and ask the narrow question needed.

## Parent-owned inventory

Create one row per independently testable behavior before the first red test. Keep it in the parent work log or handoff, not a new repository file unless explicitly authorized.

| Field | Required value |
|---|---|
| ID | Stable short ID |
| Behavior | Observable outcome and conditions |
| Source | Acceptance criterion, scenario, existing test, or evidence |
| Test | Planned or existing test path/name |
| Status | `planned`, `red`, `green`, `reviewed`, `verified`, `existing`, `candidate`, `out-of-scope`, or `blocked` |
| Evidence | Command/result, review, or authorized scope decision |

`candidate` requires a scope decision. A row is complete only when it is `verified`, `existing` with passing evidence, or `out-of-scope` with an authorized reason.

## Dispatch contract

Before dispatching a lane, send only:

```yaml
lane: inventory|red|red-verifier|green|reviewer|refactor|close
behavior_id: stable-row-id
behavior: observable expected outcome
source: acceptance criterion or evidence
allowed_paths: []
forbidden_paths: []
commands: [exact command(s)]
prior_evidence: concise results from the previous lane
stop_conditions: [conditions that require blocked/parent decision]
```

The agent reads this file only as needed plus the selected `lanes/<lane>.md`. Do not send the entire ticket, repository history, or prior lane transcripts when the task packet contains the required facts.

## Ownership and isolation

- Parent owns the inventory, scope decisions, staging, commits, and final claims.
- Red owns test files and approved fixtures only.
- Red verifier and reviewer are read-only.
- Green owns the smallest production paths needed for the selected behavior and cannot edit tests.
- Refactor owns only explicitly approved cleanup paths after review.
- No two active agents may write the same path.
- Apply the `naming` skill to test names: describe user behavior, not implementation details.
- A pre-existing change is never agent-owned unless explicitly adopted.

## Lane files

- `lanes/inventory.md` — build and update the behavior inventory.
- `lanes/red-agent.md` — write one failing behavior test.
- `lanes/red-verifier.md` — prove the failure is valid.
- `lanes/green-agent.md` — make the smallest implementation pass.
- `lanes/reviewer.md` — review intent, test proof, minimality, and scope.
- `lanes/refactor.md` — improve design without changing behavior.
- `lanes/close.md` — fresh verification, inventory closure, commit, and PR handoff.
- `lanes/handoff.md` — common return schema.

## Global stop rules

Stop and report `blocked` when product behavior is ambiguous, the required command is unavailable after the repository retry limit, the failure cannot be isolated, a lane needs forbidden paths, or final verification fails. Do not claim red-green-refactor completion from skipped or silent work.
