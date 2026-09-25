---
name: tdd
description: Use when implementing software features or bug fixes with behavior tests, acceptance criteria, or changing requirements that need traceable test coverage.
---

# TDD

## Purpose

Use a living test inventory to run behavior-testable software development through a red, green, refactor loop. The inventory starts before the first red test, records the source and evidence for each required behavior, and changes as understanding improves. It is the single coverage record—not a replacement for tests.

## Operating Definitions

- **Behavior slice:** one independently testable acceptance behavior, including required backend or data effects even without direct UI.
- **Relevant verification gate:** repository-documented test, lint, typecheck, build, or integration checks required by the changed surface.
- **Fresh verification:** a newly executed command against the final diff, with command, exit status, and result recorded.
- **Authorized mutation:** a commit, external comment, scope decision, or pull request permitted by the user or active repository workflow.
- **Stable state:** every in-scope inventory row is `verified`; already-covered rows are `existing` with evidence; excluded rows have an authorized, recorded scope decision; review is complete; refactor findings are resolved or documented; and no blocking risk remains.

If TDD is explicitly disabled for an identified emergency, record the authorization and use the minimum approved alternative verification; do not claim a red-green-refactor cycle occurred.

## When to Use

- Use for feature and bugfix implementation.
- Use when a ticket, request, or acceptance criteria must be implemented incrementally.
- Use when behavior or test coverage may change as code, review, or risk analysis reveals conditions.
- Do not use for read-only reviews, planning-only work, pure documentation edits, or emergency changes where the user explicitly disables TDD.

## Core Rules

- Work from the ticket, issue, prompt, acceptance criteria, and current branch.
- Prefer the smallest behavior slice that can be independently tested.
- Maintain one parent-owned inventory; agents report discoveries and evidence to its owner rather than editing a shared tracker.
- Keep the inventory in the active work log or handoff, not a new committed file unless the task explicitly authorizes one.
- For every non-trivial loop phase, use an available isolated subagent when delegation is authorized; if unavailable, perform the phase in the parent context and record the fallback.
- Isolate agents by write scope. If two active agents could modify the same file, assign one owner unless a recorded coordination plan defines sequencing and conflict resolution.
- Apply the `naming` skill to test names: describe expected user behavior, not implementation details.
- The red agent may only edit test files; the green agent may not edit test files.
- Do not commit until relevant verification passes and the staged diff contains only authorized paths.
- Do not broaden scope based on a newly noticed edge case. Classify it and record the source-backed decision first.
- Before final completion claims, run fresh verification and report exact commands, exit statuses, and results.

## Working-Tree and Handoff Protocol

Before the first mutation, record `git status --short`, the diff for task-owned paths, and the initial inventory. Never revert, stage, commit, or overwrite paths outside the current owner's approved scope. Every agent handoff reports status (`passed`, `failed`, or `blocked`), changed paths, exact commands and exit statuses, findings, inventory discoveries, and next action. A pre-existing change is not agent-owned unless explicitly adopted.

If an agent, test command, or reviewer is unavailable, retry according to repository workflow; after the configured limit, stop as `blocked` and report the owner and recovery action rather than treating silence or skipped work as approval.

## Loop

### 0. Build the Test Inventory

Before the first red test, list one row per behavior slice. Derive initial rows from acceptance criteria, explicit user scenarios, known edge cases, existing tests that cover the changed behavior, and required verification gates. Capture conditions that affect outcomes (for example, exact size boundaries, network failure, malformed responses) as distinct behavior rows when they can fail independently; do not enumerate every theoretical input combination.

Use these fields:

| Field | Record |
|---|---|
| ID | Stable short ID, retained if a row is edited or revisited |
| Behavior / conditions | Observable expected behavior and relevant condition or boundary |
| Source | Acceptance criterion, explicit scenario, known edge, existing test, or discovered observation |
| Test | Planned behavior test, or existing test and its coverage |
| Status | One status from the lifecycle below |
| Evidence / decision | Test path/name, command and result, reviewer result, or authorized scope decision |

Statuses:

- `planned`: required behavior has no verified red test yet.
- `red`: the red verifier confirmed the intended test fails for the missing behavior.
- `green`: implementation makes the focused test pass.
- `reviewed`: the behavior and test passed review; record review evidence.
- `verified`: the behavior remains covered by fresh verification on the final diff.
- `existing`: an existing test already covers this behavior and passes; cite it and its command. Do not manufacture a red test for behavior already implemented.
- `candidate`: a newly discovered behavior whose scope is not yet decided.
- `out-of-scope`: excluded by an identifiable authorized decision; record the owner, reason, and decision evidence.
- `blocked`: work cannot safely proceed; record the blocker owner and recovery action.

`candidate` is not a completion state. If scope cannot be determined from the request or authoritative project evidence, ask the narrow question needed; do not silently assume it is out of scope. A scope decision may move a candidate to `planned` (in scope) or `out-of-scope` (explicitly excluded). If the observation is relevant but belongs in follow-up, record it as a ticket observation and link that evidence before closing the row as out of scope.

Keep the inventory lightweight and in the parent context or handoff record; no separate repo file is required. The parent updates it from agent reports. Record required broad verification commands once in the inventory header or run notes rather than repeating them in every row.

### 1. Select One Behavior

Select the smallest `planned` inventory row. If the request or observed behavior is ambiguous, inspect code, tests, and authoritative project evidence first, then ask only the narrow question needed to avoid building the wrong behavior. Do not guess product rules such as byte units, MIME/extension policy, or error semantics from implementation details alone; use an existing contract or mark the row blocked pending an authorized decision.

### 2. Red Agent: Add One Failing Test

Spin up a subagent to add only the first failing behavior test for the selected row.

Red agent constraints:

- Own only test files or approved test fixtures.
- Do not change production code, scripts, configuration, snapshots, or generated outputs unless the framework requires a fixture update and the parent approves it first.
- Add one behavioral test, or the smallest set of assertions needed to prove one behavior.
- Run the narrowest relevant test command and report the exact failure.
- If the test cannot be written without product clarification, stop and report the blocker.

### 3. Red Verifier: Prove the Failure Is Right

Spin up a second subagent to verify the red result.

Verifier checks:

- Exactly the intended test or assertion fails, unless the framework necessarily reports a known grouped failure.
- The failure reason matches the missing behavior, not bad setup, broken imports, brittle timing, leaked state, or an unrelated regression.
- The test name describes user behavior and is scoped to the ticket, not implementation details.
- Only allowed test-scope files changed.

For a valid red, record test path/name, narrow command, non-zero exit status, and the relevant failure reason; then set the row to `red`. Stage only approved red-test paths without committing, and confirm the staged diff excludes pre-existing and unrelated changes.

For an invalid red, revert only the red agent's test changes, record why it was invalid, reset the row to `planned`, and send the red agent back to retry. Never leave an invalid failure recorded as proof of the behavior.

### 4. Green Agent: Smallest Passing Code

After the red test is staged, spin up a coding subagent to make the smallest production-code change that passes it.

Green agent constraints:

- Own only the implementation files needed for the behavior.
- Do not edit tests, fixtures, snapshots, or test configuration.
- Do not refactor beyond what is required to pass the behavior test.
- Run the narrowest relevant test command first, then broader tests if the touched area warrants it.
- Explain any production code that appears extra but is required for correctness.

If the green agent cannot pass the test without changing it, stop and send the result to the parent for diagnosis rather than weakening the test. When the focused test passes, record implementation paths, command, and exit status; set the row to `green`.

### 5. Reviewer: Verify Code Quality

Spin up a reviewer subagent after tests pass. The reviewer checks that implementation satisfies the inventory row, the test proves the behavior for the right reason, the change is minimal and consistent with existing patterns, newly introduced edge cases are handled or dispositioned, and no unrelated files changed.

If an authorized reviewer provides evidence-backed approval, record it and set the row to `reviewed`. If committing is authorized, commit the red and green changes together using a conventional commit message. Otherwise report the reviewed, uncommitted state.

If review rejects, send the green agent back with only the specific fixes needed, then rerun tests and review. If repeated attempts exceed the configured limit, stop as `blocked` and escalate.

### 6. Refactor Gate: Improve Design Without Changing Behavior

After the focused behavior test is green and review is complete, refactor only to make the changed code easier to understand or modify. Refactoring changes internal structure, not externally observable behavior. Keep this separate from feature work: if inspection reveals a missing behavior or bug, add a `candidate` inventory row and resolve its scope; an in-scope behavior returns to the normal red-green loop.

If a concrete improvement is warranted:

1. Name the design problem and the smallest task-owned change that addresses it. Do not broaden into adjacent flows, speculative abstractions, performance optimization, or unrelated cleanup.
2. Make one small, reversible transformation at a time. Keep the existing behavior assertions and test intent intact. Run the focused relevant tests after each transformation; run the broader relevant suite and repository gates before closing the gate.
3. If a test fails, stop refactoring. Preserve the failure output and test assertions; do not update snapshots or weaken tests just to regain green. Determine whether the last transformation caused the failure. If it did, either correct that transformation or revert only that refactor-owned change, then rerun the failing test. Prefer reverting the recorded patch or exact hunks. Restore a whole file only after confirming that every staged, unstaged, and untracked change in that file belongs to this refactor; never overwrite pre-existing or unrelated work. If the cause is uncertain or cannot be safely isolated, mark affected rows `blocked` and report the owner and recovery action.
4. Test code may receive a separate, narrowly scoped cleanup when it improves readability without changing the behavior asserted. Give its owner an explicit test-only write scope. Keep setup and assertions easy to understand; avoid helpers that hide a test's purpose. If an edit changes expected behavior or coverage, it is not test refactoring—record a behavior row and use the red-green loop.
5. Review the final refactor diff. Record the improvement and reviewer evidence; rerun verification after any review fix. If a refactor attempt is fully reverted, restore the affected row's prior status only after confirming the reviewed diff is back and its focused tests pass. If refactoring is retained or changed after review, reopen affected rows and obtain review of the new diff before marking them `reviewed`; only fresh final verification makes them `verified`. Commit cleanup separately only when authorized.

Stop when the named improvement is achieved, behavior remains unchanged, relevant tests pass, and the final diff is reviewed. If you cannot confidently tell whether behavior was preserved, stop and back out or mark the work blocked; do not keep making speculative changes. If no concrete improvement is needed, state that the refactor gate passed without cleanup.

### 7. Update and Close the Inventory

When any agent, test failure, reviewer, risk review, or code inspection reveals a behavior or condition, add a `candidate` row before continuing. Preserve its source and evidence. Decide whether it is in scope from acceptance criteria, user direction, and authoritative project evidence—not because the implementation happens to expose it. Ask the user when that evidence does not settle scope. Do not silently add work or waive a required behavior.

Use one inventory as the coverage decision; do not create a second checklist at the end:

- Continue with the next `planned` row; return unresolved `candidate` rows to the scope-decision step.
- A row is complete only when it is `verified`, `existing` with passing evidence, or `out-of-scope` with an authorized reason and any required follow-up observation recorded.
- `red`, `green`, `reviewed`, `candidate`, or `blocked` rows are not complete.
- After all rows are dispositioned, run the final verification suite appropriate to the change. Set in-scope rows to `verified` only when fresh verification passes against the final diff. If it fails, reopen affected rows and fix before claiming completion.
- If pull-request creation is authorized, create it from the branch using the repo's PR template. Otherwise report `ready-but-pr-blocked` with the recovery action.
- Use a conventional PR title that communicates user-visible value, not just implementation mechanics.

## Ticket Observations

Any red, green, verifier, reviewer, or risk-review agent may identify a meaningful gap. Add a ticket comment only when the observation is related to the current area, actionable, not already covered by another ticket, not inconsequential cleanup, and likely to affect correctness, reliability, security, data integrity, or user experience.

Good observations include missing null handling, an exception path that can break the flow, validation drift, a race condition, or a test gap that could hide the ticket's behavior. Avoid personal preference, speculative rewrites, and unrelated future ideas. If a discovered behavior is outside scope, preserve it as an observation rather than silently expanding implementation.

If an external ticket comment is visible to others, follow active client or repo policy for approval before posting. Without recorded authorization, draft the comment locally rather than posting it.

## Risk Review Extension

After the normal TDD loop is stable, run a risk review when the ticket or repository policy marks the changed surface as requiring it (for example, security, data integrity, concurrency, or externally visible API behavior). If delegation is unavailable, perform the review in the parent context or record the approved waiver.

Risk-review agent responsibilities:

- Look for defects and gaps directly related to the ticket.
- Ignore issues outside the ticket unless they block correctness.
- For each meaningful finding, report evidence and propose the smallest behavior test that would prove it.
- Add each finding to the inventory as `candidate`; do not edit the shared inventory.

If the risk-review finding is in scope, run the normal red verifier, green agent, reviewer, and refactor flow for that row. If it is real but outside scope, leave a ticket observation instead of expanding implementation.

## Completion Report

End with:

- terminal state: `complete`, `blocked`, or `ready-but-pr-blocked`;
- final inventory or concise inventory summary with every row's status and evidence/scope decision;
- commits created, or explicit uncommitted status;
- PR link if opened, or the creation blocker;
- ticket observations posted or drafted;
- exact final verification commands, exit statuses, and results;
- remaining requirements, unresolved candidates, or risks.

Use `none` with a reason for any inapplicable item.
