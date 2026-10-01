---
name: handler
description: Use when taking a bug or feature ticket through delegated investigation, behavior testing, implementation, browser evidence, and pull-request validation.
---

# Handler

Coordinate ticket delivery from verified failure to reviewed, tested pull request. The orchestrator owns sequencing and decisions; specialists own isolated evidence or implementation lanes. Do not treat urgency, plausible intent, or a green partial check as authorization to guess behavior or claim completion.

## Start and scope

1. Confirm the ticket identifier, canonical ticket, current repository/worktree, branch, repository instructions, acceptance criteria, and existing changes. Preserve pre-existing work. Do not take ownership of another agent’s files or ticket.
2. Inspect relevant code, tests, product rules, PR template, naming rules, CI checks, and project browser setup. Build a behavior matrix: each affected user-observable behavior, inputs/boundaries, routes/consumers, fallback and recovery paths, expected result, evidence source, and planned test.
3. If acceptance or authoritative behavior is ambiguous, stop before implementation and ask a narrow question. Existing tests/code may provide evidence, not permission to invent a product rule. Record assumptions only when a human explicitly authorizes them.
4. Check out the task branch and establish a clean, isolated worktree. Record baseline HEAD and status. Avoid concurrent writes to the same files.
5. Keep planning notes, scratch files, temporary scripts, logs, browser traces, and generated artifacts out of commits and pushes. Store temporary work outside the repository or in ignored paths; store required review evidence in an agreed artifact location. Before staging, inspect the full diff and staged file list. Stage only the intended implementation, tests, and explicitly requested durable documentation. Never use blanket staging (`git add .` / `git add -A`) when temporary or unrelated files may exist. If any planning or temporary file was staged, unstage it before commit; do not commit or push it.

## Delegated lanes

The main agent is an orchestrator. Delegate each substantive phase to a uniquely named specialist whose name includes the ticket ID and role. Every handoff states objective, exact behavior row, allowed/forbidden paths, relevant skill, exact verification command, prior evidence, stop conditions, and required return fields. Require status, claims, evidence (path/symbol/command/result), uncertainty, changed files, blockers, and next action. Specialists propose evidence; parent controls scope and integrates only after review.

1. **Failure test (red):** a test specialist creates the smallest user-behavior test for the reported defect, preferably reusable unchanged for after-fix validation. Use the repository’s naming and test conventions. Parent verifies the test fails for the claimed defect, and that it fails for the intended reason rather than setup, selector, timing, or environment noise. Do not implement until this is established.
2. **Before evidence:** independently delegate a browser specialist to run that same test against the unfixed state and record a video using Playwright. Install the required Playwright browser only through the project-supported setup when needed; do not silently skip. Preserve the exact command, browser/runtime version, URL or fixture, ticket/commit, artifact path, and result. If a reproducible browser capture is impossible, stop and report the blocker for an authorized decision; do not claim the defect was visually verified.
3. **Plan and edge cases:** delegate a test/behavior reviewer to validate the matrix, failure test and implementation plan, including boundary, negative, duplicate, stale, recovery, and authorization cases that apply. Parent reconciles evidence and resolves scope questions before implementation.
4. **Implementation:** use the `tdd` skill and its lane contracts. Assign the green implementer only production paths; tests remain owned by the red lane. Verify each inventory row through red, red-verifier, green, reviewer, and close as applicable. Do not weaken or delete a valid failing test to get green.
5. **After evidence:** run the same browser test against the fixed candidate and record the after video. Confirm the test actually exercises the same scenario, and compare artifacts. If a different test is required, explain why and retain evidence for both behaviors. Do not claim success from a stale capture or a different commit.

No two active delegates may write the same path. Parent owns integration, scope changes, ticket/PR actions, and final claims. Stop on ambiguous behavior, invalid red, unavailable verification commands after project retry, unrelated dirty changes, or required paths outside the lane.

## Pull request and checks

1. Inspect repository contribution instructions, strict branch/commit/test naming rules, PR template, target branch, and required checks. Do not guess conventions; cite the source used. Use neutral wording in new external-facing artifacts where project policy requires it.
2. Once the fix, focused review, and before/after evidence are ready, create or update a **draft** PR so a human can review code while broader checks run. Include the ticket link, concise behavior summary, test evidence, and accessible before/after videos (attach or link artifacts with permissions verified). Follow every required PR-template field. Do not mark ready yet.
3. Run required static, unit, and applicable integration/e2e checks on the pushed candidate. If a check is deferred, failed, unavailable, or inconclusive, keep the PR draft and report it; never represent a partial suite as all checks passing. Confirm checks apply to the exact current commit and rerun/invalidate after relevant changes.
4. Mark the PR ready only after required checks pass, code review findings are resolved, both videos are posted and accessible, the PR template and naming rules are satisfied, and ticket acceptance is verified. Parent records check names, commit SHA, commands/results, and unresolved risks.
5. Do not merge unless explicitly requested and authorized. Do not claim the ticket is complete before the defined PR/ticket completion state is observed.

## Required handoff

Return: ticket and branch; behavior matrix; delegation roster and lane results; reproduced failure and exact red evidence; before/after video paths and accessibility; changed files; plan/review and edge-case outcomes; PR URL/state and template compliance; candidate SHA; checks with exact commands/results; blockers, assumptions, and unresolved risks; next action. Label overall state `blocked`, `draft-review`, `ready-for-human`, or `complete` and explain the gate met.

## Stop conditions

- Acceptance is ambiguous: ask; do not infer and implement under pressure.
- Browser setup/capture fails: report blocker; do not omit the before/after evidence silently.
- Red test does not fail for the ticket defect: fix test setup or return to scope discovery.
- Required checks or review are outstanding: keep PR draft.
- Pre-existing changes overlap: stop and coordinate ownership; never overwrite or stage them.
