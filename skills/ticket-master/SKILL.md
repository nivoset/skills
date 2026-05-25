---
name: ticket-master
description: Use when a parent ticket already has child tickets and a Codex/cmux orchestrator must sequence implementation PRs across ticket systems, branches, blockers, and worker tabs.
---

# Ticket Master

## Purpose

Use this skill to coordinate existing child tickets under one parent ticket into a chained series of implementation branches and PRs.

The agent using this skill is an orchestrator only. It inspects, orders, launches, monitors, and updates ticket metadata. It does not implement application changes.

## Inputs

Require these inputs from the user or surrounding prompt:

- Parent ticket ID
- Integration branch, defaulting to `dev` when specified by the prompt
- Reference app or product source of truth
- Exact cmux/Codex full-auto launch instructions
- PR creation command or expectation
- Ticket system CLI, MCP, API, or web workflow details

Use the currently authenticated ticket-system account. Ask which account to use only when the account cannot be detected.

## Ticket Metadata Rules

Read these metadata fields when the ticket system exposes them:

- Assignee, status, parent, child order, blocker links, branch links, PR links, review state, CI state, labels or workflow fields that affect readiness, and comments that contain implementation decisions.

At the start:

- Assign the parent ticket to the current ticket-system account.
- Set the parent ticket status to the project's equivalent of `In Progress`.

For each child ticket, immediately before launching its worker:

- Assign that child ticket to the current ticket-system account.
- Set that child ticket status to the project's equivalent of `In Progress`.
- Do not set future child tickets to `In Progress` before their turn starts.

Assignee safeguards:

- If a ticket is already assigned to the current account, leave it as-is.
- If a ticket is assigned to someone else, do not overwrite it silently. Report the conflict and stop before launching that ticket.
- Do not reassign tickets to another user.

Allowed metadata updates:

- Current-account assignment for the parent and the child ticket that is about to start.
- Status change to the project's equivalent of `In Progress` for the parent and current child.
- Branch URL/name, PR URL, skip reason, blocker reason, or human-follow-up comment when the ticket system has a field or comment convention for that information.

Do not change parent links, child order, blocker links, labels, priority, estimates, status-to-done, or ownership by another user unless the user or project workflow explicitly instructs it.

After a worker opens a PR, leave the child ticket in progress unless the project's workflow explicitly requires a different status. Record evidence for every metadata mutation: field changed, old value when visible, new value, command/tool used, and resulting ticket URL or response.

## Hard Boundaries

- Do not modify application code.
- Do not edit repository files.
- Do not create commits.
- Do not implement the parent ticket.
- Do not invent a new ticket breakdown when child tickets already exist.
- Do not create new child tickets, merge child tickets, split child tickets, or re-plan the parent unless the user explicitly asks for planning work.
- Do not launch more than one implementation worker at a time.
- Do not continue a child ticket that is blocked, already finished, or missing enough detail to implement.

Allowed work:

- Inspect repository state, ticket state, git state, PR state, CI state, and reference app behavior.
- Determine execution order from existing ticket order and blocker relationships.
- Launch one Codex worker in a new cmux tab for the current child ticket.
- Update ticket metadata when the workflow explicitly calls for it.
- Leave clarifying comments on unclear tickets when the ticket system supports comments.

## Parent And Child Ticket Reading

Load the parent ticket, then read:

- Parent ticket title and description
- Direct child tickets in the ticket system's visual/list order

For every direct child ticket, read:

- Ticket ID, title, description, and acceptance criteria
- Status and assignee
- `blocked-by` and `blocking` relationships
- Linked branch, if any
- Linked PR, if any
- Relevant comments that affect readiness or scope

Direct child tickets are the execution queue. Do not treat nested grandchildren as top-level work unless they explicitly block a direct child ticket.

## Branch And PR Rules

Every child ticket gets exactly one branch and one PR.

Use precise Git terms:

- Source branch: the child ticket branch containing the work.
- Branch base: the branch or commit used to create the source branch.
- PR target: the branch the pull request will merge into.
- Merge base: the computed commit used for diff or review comparisons.

The branch chain is linear:

1. Start the first child branch from the integration branch.
2. Start each later child branch from the previous child branch.
3. Target every PR at the integration branch.

Do not confuse branch base with PR target.

- Branch base changes after each child ticket.
- PR target stays the integration branch for every PR.
- Do not infer PR target from branch base, branch name, or merge-base output.
- Before launching a worker or preparing a PR, state the source branch, branch base, PR target, and merge base when available.
- Later PRs are intentionally cumulative until earlier PRs are merged.
- No PR targets the previous child branch.
- The "previous child branch" means the previous implemented source branch in the ordered chain. A skipped blocked or unclear ticket does not become the branch base unless it already has a usable source branch that represents that child ticket's completed work.
- Reuse linked existing source branches and PRs when they are valid for the child ticket; do not create duplicates.

Example with `dev` as the integration branch:

```text
dev
  child-1 branch starts from dev
  child-2 branch starts from child-1
  child-3 branch starts from child-2

PR child-1 -> dev
PR child-2 -> dev
PR child-3 -> dev
```

Expected review shape:

- PR 1 shows child 1.
- PR 2 shows child 1 plus child 2.
- PR 3 shows child 1 plus child 2 plus child 3.
- The final PR shows the full chain.

Valid merge paths:

- Piece-by-piece: merge each PR into the integration branch in child-ticket order.
- Short-circuit: merge a later cumulative PR, then close or supersede earlier PRs already included.

If the repository uses squash merge, downstream PRs may not shrink automatically after an earlier PR merges. After a squash merge, fetch the integration branch and refresh the next branch before continuing review or merge. The refresh must preserve only the current child ticket's intended changes on top of the updated integration branch or confirmed chain state, then verify that the PR diff no longer includes already-merged predecessor work. If the safe refresh path is ambiguous, stop and report the ambiguity instead of rewriting history.

## Branch Naming

For every child ticket, use:

```text
feature/{{lowercase-ticket-id}}-{{slugified-ticket-title}}
```

Example:

```text
DELTA-6144 Add shared revision metadata and lineage fields
feature/delta-6144-add-shared-revision-metadata-and-lineage-fields
```

Branch-name rules:

- Lowercase the ticket ID.
- Slugify the title with lowercase ASCII words separated by hyphens.
- Remove punctuation that is unsafe in branch names.
- Keep the name deterministic; if truncation is needed, preserve the ticket ID and the beginning of the title slug.
- Check local and remote branches before creating a branch.
- If the ticket already links to a valid branch, reuse it.
- If the generated branch name collides with unrelated work, stop and report the collision unless the ticket system clearly links that branch to the same child ticket.

## Workflow

1. Detect ticket-system account and confirm access to the parent ticket.
2. Inspect the parent ticket and list all existing child tickets.
3. Read each child ticket for status, ticket order, explicit blockers, acceptance criteria, branch or PR links, and comments.
4. Build the execution queue from a dependency graph, using existing child-ticket order to break ties.
5. Classify every child ticket as ready, blocked, finished, or unclear.
6. Assign branch names and branch bases from the final ordered list.
7. Print an execution plan before launching any worker.
8. For finished tickets, record the existing branch or PR evidence and skip worker launch.
9. For unclear tickets, leave concise questions as a ticket comment when possible, then skip until clarified.
10. For blocked tickets, record the blocker and skip until unblocked.
11. Pick the first ready child ticket in queue order.
12. Apply the ticket metadata rules for that child ticket.
13. Launch exactly one Codex worker in a new cmux tab using the exact provided cmux/Codex instructions.
14. Submit the generated worker prompt into that tab. Creating the tab is not enough.
15. Verify the worker has started.
16. Monitor the worker, PR, and checks until the child ticket is complete or needs human follow-up.
17. Continue to the next child ticket only after the current child has a branch and PR or has been skipped with a recorded reason.

## Execution Plan

Before launching workers, print:

- Parent ticket ID and title
- Current account being used
- Ordered child-ticket list
- Blocker and blocking relationships
- Branch name for each child ticket
- Branch base for each child ticket
- PR target for each child ticket
- Whether each child is complete, open, blocked, unclear, or ready
- Existing branch or PR decision for each child
- Planned metadata updates for the parent and next child
- Exact cmux/Codex launch command or interaction
- Exact next child ticket to start

Do not ask for confirmation unless:

- Ticket data is inconsistent.
- The assignee conflicts with another user.
- The blocker graph has a cycle.
- No authenticated ticket-system account can be detected.
- The required cmux or Codex command is unavailable.
- The ticket system cannot be reached.

## Cmux Launch Verification

After opening a new cmux tab:

- Record the tab, pane, session, or surface identifier exposed by cmux.
- Confirm the tab exists and is the intended new worker tab.
- Confirm Codex full-auto mode is running or that the provided full-auto command was accepted.
- Confirm the generated worker prompt was submitted, not merely pasted or prepared.
- Confirm the worker is in the intended repository or cwd when visible.
- Treat failed tab creation, failed prompt submission, missing Codex process, wrong cwd, or unclear worker state as not started.

Do not launch another implementation worker while the current worker is running or in an unknown state.

## Worker Prompt Contract

Every worker prompt must state:

- The worker runs in Codex full-auto mode and owns exactly one child ticket.
- The worker implements only the assigned child ticket, not the parent ticket as a whole and not sibling or future tickets.
- The worker must verify the worktree is clean and fetch latest remote state before branching.
- The worker must create or continue only the supplied source branch from the supplied branch base.
- The worker must stop before code changes if the supplied branch base, source branch, PR target, ticket assignment, or ticket status does not match the prompt.
- The worker must use TDD for feature or bugfix work when applicable.
- The worker must keep tests, ports, caches, browser profiles, services, fixtures, and writable paths isolated unless the repo has an explicit isolation mechanism.
- The worker branch starts from the branch base supplied by the orchestrator.
- The worker PR targets the integration branch, usually `dev`.
- The worker must not retarget the PR to the previous child branch.
- The worker must create or prepare exactly one PR for the child ticket.
- The worker must not merge, squash, close, or retarget its own PR.
- The worker must not merge earlier PRs or manually copy earlier-ticket changes except as already present through branch ancestry.
- The worker must compare its work against the assigned ticket's acceptance criteria and stop if the diff clearly includes unrelated sibling-ticket work.
- The worker must include a cumulative-PR note in every PR after the first.
- The worker must report ticket ID, branch name, branch base, PR URL, PR target branch, summary of changes, tests added or changed, validation commands and results, known risks or follow-ups, and whether the next child ticket can safely begin.

Include these fields in the prompt:

- Parent ticket ID and title
- Child ticket ID, title, description, and acceptance criteria
- Reference app or product source of truth
- Execution position, such as `2 of 6`
- Branch base, new branch name, and PR target
- Previous child ticket, branch, and PR, or `none`
- Known blockers and tickets this child blocks
- Ordered sibling ticket list
- PR tooling instructions

Required branch instruction:

```text
Create your branch from {{BRANCH_BASE}}.
Open your PR against {{INTEGRATION_BRANCH}}.
Do not open your PR against {{BRANCH_BASE}} unless {{BRANCH_BASE}} is {{INTEGRATION_BRANCH}}.
The branch chain is stacked. The PR targets are flat.
```

Required setup instruction:

```text
If this is the first child ticket:
git fetch origin
git checkout {{INTEGRATION_BRANCH}}
git pull --ff-only origin {{INTEGRATION_BRANCH}}
git checkout -b {{CHILD_BRANCH_NAME}}

If this is not the first child ticket:
git fetch origin
git checkout {{BRANCH_BASE}}
git pull --ff-only origin {{BRANCH_BASE}}
git checkout -b {{CHILD_BRANCH_NAME}}

If {{BRANCH_BASE}} only exists on origin, check it out from origin first.
```

Required PR body fields:

- Ticket ID
- What changed and why
- Tests added or updated
- Validation commands run
- Known risks
- Branch base
- PR target
- Previous child PR, if any
- Note that the PR is cumulative because the branch builds on the previous child branch

Required PR body note for every PR after the first:

```text
This PR intentionally builds on {{BRANCH_BASE}} but targets {{INTEGRATION_BRANCH}}.
Its diff is cumulative until earlier PRs are merged.
Review order should follow the parent ticket chain.
```

## Ordering Rules

Build a dependency graph from `blocked-by` and `blocking` relationships.

Rules:

- If ticket A blocks ticket B, ticket A must come before ticket B.
- If ticket B is blocked by ticket A, ticket A must come before ticket B.
- Add graph edges as `blocker -> blocked`.
- Topologically sort the direct child tickets using a stable sort.
- When multiple child tickets have no dependency relationship, preserve the visual/list order shown under the parent ticket.
- Blocker relationships determine order.
- Parent-ticket visual order breaks ties.
- The final ordered list determines branch ancestry.
- If blocker data forms a cycle, stop and report the cycle instead of guessing.
- If a blocker relationship points outside the direct child-ticket set, report that external blocker and stop unless the external blocker is already complete.

After determining the ordered child-ticket list, assign branch bases like this:

- `ordered_children[0].branch_base = integration_branch`
- `ordered_children[1].branch_base = ordered_children[0].branch_name`
- `ordered_children[2].branch_base = ordered_children[1].branch_name`
- Continue until the list ends.

This adjacent ancestry rule applies even when there is no formal blocker relationship between adjacent tickets.

## Existing And Non-Ready Work

Finished:

- Skip implementation.
- Record status, branch, PR, merge state, and verification evidence when available.
- If the child ticket is complete and its PR is merged, mark it complete in the local execution plan and continue to the next uncompleted child using the correct chain branch base.

Open PR:

- Confirm the PR target is the integration branch.
- Confirm the branch name.
- Confirm the PR state, draft/readiness state, CI status, review state, and whether comments indicate unresolved implementation work.
- Confirm whether the next child branch should use that branch as its branch base.
- Do not create a duplicate branch or duplicate PR.
- If the PR is valid and still in progress, monitor it or report the current state rather than launching another worker for the same child.

Existing branch without PR:

- Inspect enough to determine whether to continue that branch.
- If safe, instruct the worker to continue from that branch.
- If unsafe, stop and report the ambiguity.

Closed PR, failed CI, or partial worker output:

- Inspect the linked PR, CI result, branch state, and worker report.
- Decide whether the child is complete, needs monitoring, needs a follow-up worker on the same branch, is blocked, or must stop for human input.
- Record the evidence behind the decision.
- Do not launch a duplicate branch for the same child ticket.

Unclear:

- Leave a ticket comment with the minimum questions needed to make the ticket implementable.
- Do not launch a worker for the ticket.

Blocked:

- Name the blocking ticket, PR, decision, or missing dependency.
- If the blocker is another direct child ticket, start the blocker first according to the ordered queue.
- If the blocker is outside the direct child-ticket queue, stop and report the blocking chain.
- Do not launch a worker until the blocker clears.

No child tickets:

- Stop and report that the parent has no existing child tickets.
- Do not invent a breakdown.

## Reference App Rules

Use the reference app as the source of truth for:

- Product behavior
- UX flows
- Terminology
- Validation behavior
- Edge cases
- Expected data shape
- Compatibility requirements

Pass the exact reference app path, URL, or description into every worker prompt. Treat the reference app as read-only unless the user explicitly says otherwise. Require workers to inspect it when relevant to product behavior before implementing. If the reference app cannot be accessed or the source of truth is ambiguous, stop for clarification before launching the affected worker.

Do not ask the user product-behavior questions unless the ticket, repository, and reference app conflict or are insufficient.

## After Each Worker Finishes

Record:

- Ticket ID
- Branch name
- Branch base
- PR URL
- PR target
- Tests run
- Known risks
- Cmux tab or session identifier
- CI/review state when available
- Whether the PR diff is cumulative, clean after predecessor merge, or needs post-squash refresh

Confirm:

- The branch was created from the correct branch base.
- The PR targets the integration branch.
- The worker did not implement unrelated sibling tickets.
- The worker did not skip required tests without explanation.
- The PR body includes branch base, PR target, previous child PR when applicable, and the cumulative-PR note.

Before launching the next worker:

- Select the next child ticket from the ordered queue.
- Assign it to the current account.
- Set it to the project's equivalent of `In Progress`.
- Set its branch base to the branch from the child ticket that just completed.
- Start exactly one new cmux tab and submit the next worker prompt.

## Final Status Format

Report in these sections:

- Queue: parent ticket ID and title, current account, integration branch, ordered child-ticket queue, and ordering rationale.
- Processed ticket: current or last processed child ticket, state, branch name, branch base, merge base, PR target, PR URL, and whether it is cumulative.
- Branch/PR chain: branch chain, predecessor PR state, PR URL for each child ticket, and confirmation that every PR targets the integration branch.
- Existing work handled: reused branches, open PRs, closed PRs, failed CI, partial worker outputs, skipped tickets, and the evidence for each decision.
- Ticket metadata updates: assignments, status changes, branch/PR fields, comments, commands/tools used, and resulting ticket URLs or responses.
- Commands and cmux tabs: exact cmux/Codex launch command or interaction, tab/pane/session identifiers, and worker-start verification.
- Verification/CI: validation commands and results, CI/review state, PR diff state, and post-squash refresh command/result when applicable.
- Blocked or unclear items: blocker chain, questions left as comments, and human decisions needed.
- Next action: recommended merge order, cumulative PR behavior, cleanup after merges, and unresolved risks.
