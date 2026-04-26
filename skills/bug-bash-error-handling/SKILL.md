---
name: bug-bash-error-handling
description: Review a whole codebase or named area for unhandled exceptions, swallowed failures, and unclear recovery behavior using the shared bug bash report format.
---

# Bug Bash Error Handling

## Purpose

Use this skill to investigate whether failures are thrown, hidden, misclassified, or surfaced without a usable recovery path.

## When to Use

- Use for exception handling, async failures, retries, parser failures, network failure handling, and user-facing error states.
- Use when the user names an integration, route, UI workflow, worker, or parser.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names a `path`, `module`, `route`, `workflow`, `screen`, `job`, or `integration`.

## Core Rules

- Inspect real error paths, not only happy paths.
- Prefer existing tests, logs, and error contracts where available.
- Do not commit or repair code.
- If the code lacks stable error-path tests, explain the minimum additions needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- unhandled exceptions
- rejected promises or missing awaits
- swallowed errors
- fallback behavior that hides meaningful failure
- parser or deserialization crashes
- non-recoverable UI error states
- retry loops without user or operator visibility
- tests that assert success paths only

Attack vectors to emphasize:

- silent failure
- unhandled exception
- swallowed error
- external dependency failure
- background job failure
- configuration or environment assumption
- observability gap
- test could pass while product is broken

## Workflow

1. State the resolved scope.
2. Map likely failure points across request, async, and background execution.
3. Inspect catch blocks, error boundaries, retries, and tests.
4. Verify whether failures are surfaced, logged, and recoverable.
5. Report impact on users, operators, and downstream systems.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Call out places where the UI or API claims success while the underlying action can fail invisibly.
