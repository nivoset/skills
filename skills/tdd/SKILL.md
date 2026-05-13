---
name: tdd
description: Use for software development feature or bugfix work that should follow a strict red, green, refactor loop with isolated subagents, verified failing tests, minimal implementation, review gates, commits, pull requests, and ticket observations.
---

# TDD

## Purpose

Use this skill to run software development through a strict red, green, refactor loop. Each loop proves one behavior with a failing test, makes the smallest implementation change, reviews the result, removes unnecessary code, and either opens a pull request or repeats for the next uncovered requirement.

## When to Use

- Use for feature and bugfix implementation.
- Use when the user asks for TDD, red/green/refactor, failing tests first, or behavior-first development.
- Use when a ticket or acceptance criteria must be implemented incrementally.
- Do not use for read-only reviews, planning-only work, pure documentation edits, or emergency changes where the user explicitly disables TDD.

## Core Rules

- Work from the ticket, issue, prompt, acceptance criteria, and current branch.
- Prefer the smallest behavior slice that can be independently tested.
- Use subagents for every non-trivial loop phase.
- Isolate agents by write scope. Never give two active agents overlapping file ownership unless coordination is explicit.
- Test names must describe expected user behavior, not implementation details.
- The red agent may only edit test files.
- The green agent may not edit test files.
- Do not commit until the relevant verification gate passes.
- Do not broaden scope to issues better handled by another ticket.
- Before final completion claims, run fresh verification and report exact commands and results.

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

If valid, stage the red test with `git add` but do not commit.

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

If the reviewer approves, commit the red and green changes together using a conventional commit message.

If the reviewer rejects, send the green agent back with only the specific fixes needed, then rerun tests and review.

### 6. Refactor Gate: Remove Unneeded Code

After the passing commit, inspect the diff against the requirement slice for unnecessary instructions, unused branches, defensive code without a demonstrated need, duplication, or abstractions introduced too early.

If cleanup is needed:

1. Send the coding agent back to remove the unneeded code or explain why each questioned piece is necessary.
2. Do not alter the behavior test unless the test itself is proven incorrect.
3. Run fresh verification.
4. If cleanup changed tracked files and verification passes, commit the cleanup separately with a conventional commit message.

If no cleanup is needed, state that the refactor gate passed.

### 7. Coverage Decision

Compare completed behavior against the ticket requirements.

- If requirements remain, loop back to Step 1 for the next smallest behavior.
- If requirements are complete, run the final verification suite appropriate to the change.
- Create a pull request from the branch using the repo's PR template.
- Use a conventional PR title that communicates client-visible value, not just implementation mechanics.

## Ticket Observations

Any red, green, verifier, reviewer, or bug-bash agent may identify a meaningful gap while working. Add a ticket comment only when the observation is:

- related to the current ticket area,
- actionable,
- not already covered by another ticket,
- not inconsequential cleanup,
- and likely to affect correctness, reliability, security, data integrity, or user experience.

Good observations include missing null handling, an exception path that can break the flow, validation drift, a race condition, or a test gap that could hide the ticket's behavior. Avoid comments for personal preference, speculative rewrites, or unrelated future ideas.

If creating or editing an external ticket comment is visible to other people, follow the active client or repo policy for approval before posting.

## Bug-Bash Extension

After the normal TDD loop is stable, spin up a bug-bash agent for the ticket scope.

Bug-bash agent responsibilities:

- Look for defects and gaps directly related to the ticket.
- Ignore issues outside the ticket unless they block the ticket's correctness.
- For each meaningful finding, attempt to build the smallest behavior test that proves it.
- Hand the proposed failing test to the red verifier.

If the bug-bash test fails for the expected reason and is aligned with the ticket, run the normal red verifier, green agent, reviewer, refactor, and commit flow for that failure.

If the finding is real but outside scope, leave a ticket observation instead of expanding the implementation.

## Completion Report

End with:

- behavior slices completed,
- commits created,
- PR link if opened,
- ticket observations posted or drafted,
- exact verification commands and results,
- any remaining requirements or risks.
