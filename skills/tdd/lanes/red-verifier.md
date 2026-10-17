# Red verifier lane

## Objective

Prove that the red agent produced a valid, focused failure. This lane is read-only.

## Checks

- The assigned behavior fails for the expected reason; grouped failures are acceptable when they still isolate that behavior.
- The failure reason matches the missing behavior.
- Imports, fixtures, timing, and environment are valid.
- The test name describes user behavior and avoids implementation details.
- Only approved test-scope paths changed.
- The test does not silently encode an unresolved product rule.

## Decision

- Valid red: record the failure evidence and move the inventory row to `red`.
- Invalid red: explain the defect, return the row to `planned`, and send the red agent back with one correction.

Do not edit tests, production code, or the shared inventory.

## Return

Use `handoff.md`. Include the exact command, exit status, failure classification, and whether the green lane may start.
