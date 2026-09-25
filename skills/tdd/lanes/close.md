# Close lane

## Objective

The parent closes the TDD loop only after every inventory row is dispositioned and fresh verification passes on the final diff.

## Steps

1. Recheck the final diff and staged paths against the authorized scope.
2. Run the repository's relevant verification commands from the inventory header.
3. Set in-scope rows to `verified` only from fresh passing evidence.
4. Keep `candidate`, `red`, `green`, `reviewed`, and `blocked` rows open.
5. Record `existing` and `out-of-scope` evidence explicitly.
6. Commit only when authorized, using a conventional commit message.
7. Open or update a PR only when authorized; report the PR link and checks.

## Completion report

Return terminal state (`complete`, `blocked`, or `ready-but-pr-blocked`), inventory summary, commits, PR status, observations, exact commands/results, and remaining risks. Use `handoff.md` for the lane record.
