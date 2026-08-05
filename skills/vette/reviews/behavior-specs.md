# Feature Behavior Specs Review

## Lane Id

`behavior-specs`

## Purpose

Detect behavior-spec drift by comparing matching Gherkin or feature-file scenarios against the diff and changed-code behavior.

## Topic Scope

Detect behavior-spec drift only: compare matching Gherkin/feature-file scenarios against the diff and changed-code behavior; report behavior that violates scenarios, missing scenario coverage for changed behavior, or ambiguous spec matches that need review.

## When to Use

- Use when the repo contains `.feature`, `.feature.md`, or similar behavior specs.
- Use when the review bundle includes matched feature files related to the diff.
- Do not invent scenario expectations when no relevant feature files were matched.

## Core Rules

- Treat matched feature files as behavioral contracts, not implementation scripts.
- Compare scenario intent to observable outcomes in the diff.
- If no feature files match, report uncertainty instead of inventing scenarios.
- Do not attach behavior-spec expectations to an empty diff.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- changed behavior with no corresponding scenario update or new scenario
- implementation that violates an existing scenario's Given/When/Then intent
- label or action text changes that break step definitions or docs (`Open` vs `Open in new tab`)
- missing accessibility or keyboard scenarios for new interactive affordances
- scenarios that cover editor-only paths but not newly added home/surface flows
- ambiguous matches where multiple scenarios could apply and expectations conflict

Attack vectors to emphasize:

- product copy mismatch
- core flow happy-path breakage relative to scenarios
- negative-path gap when scenarios describe failure or edge behavior

## Workflow

1. State resolved scope, changed paths, and matched feature files.
2. Read scenarios most lexically related to the diff tokens and changed paths.
3. Trace whether the diff satisfies, violates, or leaves scenarios uncovered.
4. Flag ambiguous matches that need human review.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Quote or cite the scenario path and the behavior drift or missing coverage.
