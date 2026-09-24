---
name: tdd
description: Use for software development feature or bugfix work that should follow a strict red, green, refactor loop with isolated subagents, verified failing tests, minimal implementation, review gates, commits, pull requests, and ticket observations.
---

# TDD

## Purpose

Use this skill to run behavior-testable software development through a red, green, refactor loop. Each loop proves one behavior with a failing test, makes the smallest implementation change, reviews the result, removes unnecessary code, and repeats for the next uncovered requirement. Opening a pull request is a final, authorization-gated action after all requirements and verification gates pass.

## Operating Definitions

- **Behavior slice:** one independently testable acceptance behavior, including required backend or data effects even when there is no direct UI.
- **Relevant verification gate:** the repository-documented test, lint, typecheck, build, or integration checks required by the changed surface.
- **Fresh verification:** a newly executed command against the final diff, with command, exit status, and result recorded.
- **Authorized mutation:** a commit, external comment, or pull request permitted by the user or active repository workflow.
- **Stable state:** all required behavior slices pass, review is complete, refactor findings are resolved or documented, and no blocking risk remains.

If TDD is explicitly disabled for an identified emergency, record the authorization and use the minimum approved alternative verification; do not silently claim a red-green-refactor cycle occurred.

## When to Use

- Use for feature and bugfix implementation.
- Use when the user asks for TDD, red/green/refactor, failing tests first, or behavior-first development.
- Use when a ticket or acceptance criteria must be implemented incrementally.
- Do not use for read-only reviews, planning-only work, pure documentation edits, or emergency changes where the user explicitly disables TDD.

## Core Rules

- Work from the ticket, issue, prompt, acceptance criteria, and current branch.
- Prefer the smallest behavior slice that can be independently tested.
- For every non-trivial loop phase, use an available isolated subagent when delegation is authorized; if delegation is unavailable, perform the phase in the parent context and record the fallback.
- Isolate agents by write scope. If two active agents could modify the same file, assign one owner unless a recorded coordination plan defines sequencing and conflict resolution.
- Apply the `naming` skill to test names: describe expected user behavior, not implementation details.
- The red agent may only edit test files.
- The green agent may not edit test files.
- Do not commit until the relevant verification gate passes and the staged diff contains only authorized paths.
- Do not broaden scope to issues better handled by another ticket; record related blockers or observations instead.
- Before final completion claims, run fresh verification and report exact commands, exit statuses, and results.

## Working-tree and handoff protocol

Before the first mutation, record `git status --short` and the diff for the task-owned paths. Never revert, stage, commit, or overwrite paths outside the current owner’s approved scope. Every agent handoff reports: status (`passed`, `failed`, or `blocked`), changed paths, exact commands, exit statuses, findings, and next action. A pre-existing change is not an agent-owned change unless explicitly adopted.

If an agent, test command, or reviewer is unavailable, retry according to the repository workflow; after the configured limit, stop as `blocked` and report the owner and recovery action rather than treating silence or skipped work as approval.

## Test at the Smallest Trustworthy Boundary

For each risk, write the test at the narrowest boundary that can reliably
expose the intended failure.

Keep a dependency real when its behavior is itself part of the risk being
tested. Use broader integration or end-to-end tests only when they validate
something lower-level tests cannot, such as dependency wiring,
cross-component behavior, or a complete user journey.

Do not duplicate lower-level test cases at higher levels unless the
higher-level test provides distinct, additional confidence.

## Loop

### 1. Select One Behavior

Identify the smallest unmet user-visible behavior from the ticket. If requirements are ambiguous, inspect the code and tests first, then ask only the narrow question needed to avoid building the wrong behavior.

### 2. Red Agent: Add One Failing Test

Spin up a subagent to add only the first failing behavior test.

Red agent constraints:

- Own only test files or approved test fixtures.
- Do not change production code, scripts, configuration, snapshots, or generated outputs unless the test framework requires a fixture update and the parent agent approves it first.
- Add one behavioral test, or the smallest set of assertions needed to prove one behavior.
- Run the narrowest relevant test command and report the exact failure.
- If the test cannot be written without product clarification, stop and report the blocker.

### 3. Red Verifier: Prove the Failure Is Right

Spin up a second subagent to verify the red result.

Verifier checks:

- Exactly the intended test or assertion fails, unless the test framework necessarily reports a known grouped failure.
- The failure reason matches the missing behavior, not bad setup, broken imports, brittle timing, leaked state, or an unrelated regression.
- The test name describes user behavior.
- The test is scoped to the ticket and does not encode implementation details.
- Only allowed test-scope files changed.

If valid, stage only the approved red-test paths with `git add` but do not commit. Confirm the staged diff excludes pre-existing and unrelated changes.

If invalid:

1. Revert only the red agent's test changes.
2. Record why the failure was invalid.
3. Send the red agent back to retry with the correction.

### 4. Green Agent: Smallest Passing Code

After the red test is staged, spin up a coding subagent to make the smallest production-code change that passes the staged test.

Green agent constraints:

- Own only the implementation files needed for the behavior.
- Do not edit test files, fixtures, snapshots, or test configuration.
- Do not refactor beyond what is required to pass the behavior test.
- Run the narrowest relevant test command first, then broader tests if the touched area warrants it.
- Explain any production code that appears extra but is required for correctness.

If the green agent cannot pass the test without changing the test, stop and send the result back to the parent agent for diagnosis rather than weakening the test.

### 5. Reviewer: Verify Code Quality

Spin up a reviewer subagent after tests pass.

Reviewer checks:

- The implementation satisfies the staged behavior test and ticket slice.
- The test still proves the behavior for the right reason.
- The code is minimal, maintainable, and consistent with existing patterns.
- Edge cases introduced by the change are either handled or documented as valid follow-up observations.
- No unrelated files changed.

If an authorized reviewer provides evidence-backed approval, and committing is authorized, commit the red and green changes together using a conventional commit message. Otherwise report the reviewed, uncommitted state.

If the reviewer rejects, send the green agent back with only the specific fixes needed, then rerun tests and review. If repeated review attempts exceed the configured limit, stop as `blocked` and escalate.

### 6. Refactor Gate: Remove Unneeded Code

After the passing commit, inspect the diff against the requirement slice for unnecessary instructions, unused branches, defensive code without a demonstrated need, duplication, or abstractions introduced too early.

If cleanup is needed:

1. Send the coding agent back to remove the unneeded code or explain why each questioned piece is necessary.
2. Do not alter the behavior test unless the test itself is proven incorrect.
3. Run fresh verification.
4. If cleanup changed tracked files and verification passes, commit the cleanup separately with a conventional commit message.

If no cleanup is needed, state that the refactor gate passed.

### 7. Coverage Decision

Compare completed behavior against the ticket requirements using a checklist that maps every acceptance criterion to its test, implementation, and verification evidence.

- If requirements remain, loop back to Step 1 for the next smallest behavior.
- If requirements are complete, run the final verification suite appropriate to the change.
- If the final suite passes and pull-request creation is authorized, create a pull request from the branch using the repo's PR template.
- If verification passes but pull-request creation is unavailable or unauthorized, report `ready-but-pr-blocked` with the recovery action.
- Use a conventional PR title that communicates client-visible value, not just implementation mechanics.

## Ticket Observations

Any red, green, verifier, reviewer, or risk-review agent may identify a meaningful gap while working. Add a ticket comment only when the observation is:

- related to the current ticket area,
- actionable,
- not already covered by another ticket,
- not inconsequential cleanup,
- and likely to affect correctness, reliability, security, data integrity, or user experience.

Good observations include missing null handling, an exception path that can break the flow, validation drift, a race condition, or a test gap that could hide the ticket's behavior. Avoid comments for personal preference, speculative rewrites, or unrelated future ideas.

If creating or editing an external ticket comment is visible to other people, follow the active client or repo policy for approval before posting. Without recorded authorization, draft the comment locally rather than posting it.

## Risk Review Extension

After the normal TDD loop is stable, run a risk review when the ticket or repository policy marks the changed surface as requiring it (for example, security, data integrity, concurrency, or externally visible API behavior). If delegation is unavailable, perform the review in the parent context or record the approved waiver.

Risk-review agent responsibilities:

- Look for defects and gaps directly related to the ticket.
- Ignore issues outside the ticket unless they block the ticket's correctness.
- For each meaningful finding, attempt to build the smallest behavior test that proves it.
- Hand the proposed failing test to the red verifier.

If the risk-review test fails for the expected reason and is aligned with the ticket, run the normal red verifier, green agent, reviewer, refactor, and commit flow for that failure.

If the finding is real but outside scope, leave a ticket observation instead of expanding the implementation.

## Completion Report

End with:

- terminal state: `complete`, `blocked`, or `ready-but-pr-blocked`;
- behavior slices completed;
- acceptance-criteria coverage mapping;
- commits created, or explicit uncommitted status;
- PR link if opened, or the creation blocker;
- ticket observations posted or drafted;
- exact verification commands, exit statuses, and results;
- any remaining requirements or risks.

Use `none` with a reason for any inapplicable item.
