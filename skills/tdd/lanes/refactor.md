# Refactor lane

## Objective

Improve clarity or maintainability after green and review without changing observable behavior. This lane is optional.

## Preconditions

- The focused behavior test is green.
- Reviewer approval is recorded.
- The parent names the concrete design problem and approved cleanup paths.

## Steps

1. Make one small, reversible transformation.
2. Run the focused test after each transformation.
3. Run broader relevant gates before closing the lane.
4. Preserve test intent and assertions.
5. Review the final refactor diff.

If a test fails, stop. Determine whether the transformation caused it; correct or revert only that refactor change. If cause is uncertain, mark the row `blocked`.

Do not add features, speculative abstractions, performance work, or unrelated cleanup. A newly discovered behavior becomes a `candidate` row and returns to inventory.

## Return

Use `handoff.md`. State `refactor: applied` with the improvement and evidence, or `refactor: skipped` with the reason.
