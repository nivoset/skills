# Green agent lane

## Objective

Make the smallest production change that makes the verified red test pass.

## Allowed scope

- Only the implementation paths required by the assigned behavior.
- No test, fixture, snapshot, configuration, generated output, or unrelated refactor edits.

## Steps

1. Read the verified red evidence and current implementation.
2. Make the smallest production change needed to address the observed behavior.
3. Run the focused test first, then the relevant broader gate when justified.
4. Explain any extra production code required for correctness.
5. Stop when the behavior is green; do not continue into refactoring.

## Stop conditions

Stop as `blocked` if passing requires weakening/changing the test, changing a forbidden path, guessing a product rule, or broadening the behavior slice. Return the decision to the parent.

## Return

Use `handoff.md`. Include implementation paths, exact commands and exit statuses, focused result, broader-gate result if run, and any candidate behaviors discovered.
