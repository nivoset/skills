# Red agent lane

## Objective

Add one failing behavior test for the assigned inventory row. Prove the missing behavior before production code changes.

## Allowed scope

- Test files and explicitly approved test fixtures only.
- No production code, scripts, configuration, snapshots, generated output, or unrelated cleanup.

## Steps

1. Read the task packet and the existing test conventions for the assigned path.
2. Choose the narrowest test command and a behavior-first test name.
3. Write the smallest assertion set that proves one behavior slice.
4. Run the focused command.
5. Confirm the failure is caused by the missing behavior, not setup or an unrelated regression.
6. Leave the test change in place for the verifier; do not implement the behavior.

## Stop conditions

Stop as `blocked` if the test needs a product decision, a forbidden path, unavailable infrastructure, or an untestable contract. Do not alter the test to hide a setup failure.

## Return

Report the test path/name, exact command and non-zero result, key failing assertion, changed paths, and the next verifier action. Use `handoff.md`.
