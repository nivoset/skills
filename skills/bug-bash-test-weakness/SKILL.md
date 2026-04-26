---
name: bug-bash-test-weakness
description: Review a whole codebase or named area for misleading tests, weak assertions, and false confidence using the shared bug bash report format.
---

# Bug Bash Test Weakness

## Purpose

Use this skill to find tests that appear to protect important behavior but would still pass while the product is broken.

## When to Use

- Use for test suite quality reviews, regression confidence checks, and suspected over-mocking or happy-path bias.
- Use when the user names a test folder, suite, feature area, or coverage concern.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `workflow`, `route`, `screen`, `integration`, or `data model`.

## Core Rules

- Investigate tests and the behavior they claim to protect.
- Prefer repo-standard testing practices and compare tests against real code paths.
- Do not commit or rewrite tests as part of the review.
- If strong coverage is not currently possible, describe the smallest stable additions or rewrites needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- assertions that only check truthiness
- assertions that only check existence
- assertions that only check status codes
- snapshot-only tests
- tests with no meaningful assertions
- tests that only assert mock calls
- tests that mock away the behavior they claim to verify
- happy-path-only coverage
- missing negative, boundary, permission, persistence, or async failure coverage
- tests that verify implementation detail instead of user-visible outcome

For each weak test finding, explain:

1. what confidence the test appears to provide
2. why that confidence is false or incomplete
3. what bug could escape
4. whether an existing production bug is visible
5. what stronger assertion or test would catch it

Attack vectors to emphasize:

- weak assertion
- mock honesty
- negative-path gap
- test could pass while product is broken
- observability gap when failures are hard to diagnose through tests

## Workflow

1. State the resolved scope.
2. Map the important behavior a test suite claims to protect.
3. Compare assertions, mocks, fixtures, and setup against real code paths.
4. Identify false confidence and the bugs that could escape.
5. Rank findings by business impact, not by test style preference.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Treat missing or weak tests around billing, permissions, destructive actions, and core workflows as potentially `High` severity even without a reproduced production bug.
