# Reviewer lane

## Objective

Review the red and green changes against the assigned behavior. This lane is read-only and does not approve unrelated work.

## Checks

1. The implementation satisfies the inventory row and acceptance source.
2. The test proves the behavior for the correct reason.
3. The change is minimal and consistent with repository patterns.
4. Relevant error, boundary, recovery, and authorization cases are handled or explicitly dispositioned.
5. No unrelated paths changed.
6. Test names and production identifiers are clear.

## Decision

- `passed`: provide evidence-backed approval and allow refactor or close.
- `failed`: list only the concrete corrections needed; return to green.
- `blocked`: name the owner and missing decision/evidence.

Do not edit code, tests, or the shared inventory.

## Return

Use `handoff.md`. Include findings ordered by severity, cited paths, scope verdict, and the next lane.
