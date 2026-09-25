# Inventory lane

## Objective

Build or update the one parent-owned behavior inventory before implementation. This lane does not write production code or tests.

## Steps

1. Read the task packet, acceptance criteria, current code/tests, and relevant repository guidance.
2. Split the request into the smallest observable behavior slices. Keep independent boundaries separate when they can fail independently.
3. Reuse existing tests as `existing` rows; do not manufacture a red test for behavior already covered.
4. Record each row's source and planned test path/name.
5. Mark newly discovered behavior `candidate`. Decide scope from authoritative evidence; ask the parent when evidence does not settle it.
6. Select exactly one `planned` row for the next red lane.

## Row lifecycle

`planned -> red -> green -> reviewed -> verified`

Alternative terminal states are `existing` with evidence and `out-of-scope` with an authorized decision. `candidate` and `blocked` are not complete.

## Stop conditions

Stop if acceptance behavior is ambiguous, the requested change spans incompatible scopes, or no behavior row can be selected safely.

## Return

Return the inventory delta, selected row, evidence sources, unresolved scope questions, and the standard handoff from `handoff.md`.
