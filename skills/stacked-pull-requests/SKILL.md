---
name: stacked-pull-requests
description: Use when a change is too large for one review, when work has ordered dependencies across branches, or when creating, maintaining, reviewing, rebasing, syncing, or merging stacked GitHub pull requests.
---

# Stacked Pull Requests

Use a stack when a large change can be split into small, independently reviewable layers that must land in dependency order. Each branch contains one concern and is based on the branch immediately below it; the bottom branch targets the trunk.

## Guardrails

- Keep foundational work lower in the stack: schema/types → core logic → API → UI/tests/docs.
- Put code only in the same branch or a lower branch when it depends on that code.
- Keep each pull request focused and describe its position and dependency in the PR body.
- All branches must be in the same repository; cross-fork stacks are unsupported.
- Treat stacked PRs as public-preview GitHub behavior and verify current CLI flags when behavior matters.
- Before rebasing or force-pushing, inspect the stack and ensure the worktree is clean. Prefer `--force-with-lease`.

## Choose the workflow

Prefer GitHub CLI when local branch management is part of the task. Use the GitHub website when creating or linking existing branches without local stack tracking. Do not use GitHub Desktop for stacks.

### Initialize and submit with `gh stack`

Check prerequisites: GitHub CLI, authentication (`gh auth status`), a pushable repository, and the extension.

```sh
gh extension install github/gh-stack
gh auth status
gh stack init --base main feature-foundation
# implement, test, commit
gh stack add feature-api
# implement, test, commit; repeat for each logical layer
gh stack view
gh stack submit
```

For a commit plus the next branch in one step, use `gh stack add -Am "message" branch-name` (or `-um` for tracked files only). Use `gh stack view --json` when machine-readable state is needed.

### Create from the website

Create the bottom PR against the trunk. For every next layer, create a PR whose base is the branch below it and choose “Create stack” or “Add to stack.” Confirm the stack map and order before asking for review.

## Maintain the stack

Always edit a change on the branch that owns it, then cascade upward:

```sh
gh stack checkout branch-name
# edit, test, commit
gh stack rebase --upstack
gh stack push
```

Use `gh stack down`, `up`, `top`, and `bottom` for navigation. Use `gh stack rebase` to rebase the full stack; `--downstack` or `--upstack` limits the range. After conflicts: resolve, `git add`, then `gh stack rebase --continue`; use `gh stack rebase --abort` to restore the pre-rebase state.

For structural changes, require a clean worktree, no active rebase, no queued PR, and linear history, then run `gh stack modify`. Use it to drop, fold, insert, reorder, or rename layers; push and recreate/update the remote stack with `gh stack submit`.

After someone merges lower layers, run:

```sh
gh stack sync --prune
```

If local and remote stack composition diverges, stop and resolve deliberately; do not overwrite either side blindly. In CI/non-interactive contexts, resolve by coordinating the remote stack, unstacking/recreating it, or choosing a single source of truth.

## Review and merge

Review each PR as its layer diff, while consulting the stack map for context. When feedback targets a middle layer, fix that branch, test it, rebase the upstack, and push; do not duplicate the fix in a higher branch.

Merge only from the bottom upward. A selected PR may merge together with a contiguous group below it, but a middle PR cannot merge in isolation. Before merging, confirm the lower PRs are approved and passing, the stack is linear, and branch protection requirements are satisfied. Stacks support merge queues; auto-merge is not supported. After a merge, sync/rebase the remaining stack and verify retargeted PRs and CI.

## Diagnosis checklist

When asked to operate on a stack, first run `gh stack view` and inspect `git status`, current branch, PR bases/heads, and CI/review state. Then identify the affected layer and every dependent layer above it. State the planned cascade before mutating branches.

Do not flatten the stack merely to avoid maintenance. Flatten only when the user explicitly wants one PR or the dependency boundaries no longer provide review value.

## Source

Based on GitHub’s stacked pull request documentation:

- https://docs.github.com/en/pull-requests/get-started/about-stacked-prs
- https://docs.github.com/en/pull-requests/get-started/stacked-prs-quickstart
- https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-stacked-pull-requests
- https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/managing-stacked-pull-requests
- https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-stacked-pull-requests
- https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-stacked-pull-requests
- https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands
