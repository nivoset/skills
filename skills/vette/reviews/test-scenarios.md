# Test Scenarios Review

## Lane Id

`test-scenarios`

## Purpose

Detect missing regression-catching test scenarios: changed observable behavior with no test that would fail if that behavior regressed.

## Topic Scope

Detect missing regression-catching test scenarios: changed observable behavior with no test that would fail if that behavior regressed, missing edge-case scenario, missing negative-path scenario, missing boundary scenario, or a deleted/disabled test that leaves behavior without equivalent coverage elsewhere. You may call out important pre-existing scenario gaps discovered while reviewing the diff, but mark them as follow-up rather than required for the current change. Do not report test style, weak matcher wording, mocks, snapshots, duplicate tests, or user-event realism; those belong to the test-quality lane.

## When to Use

- Use when the diff changes observable behavior, APIs, UI flows, or persistence outcomes.
- Use when tests were added but may miss negative, boundary, or permission paths.
- Do not use for assertion style, mock honesty, or duplicate test critique.

## Core Rules

- Review only scenario coverage gaps, not test implementation quality.
- Ask whether a regression in the changed behavior would cause an existing or new test to fail.
- Mark pre-existing gaps as follow-up unless the diff directly worsens coverage.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- changed behavior with no new or updated test scenario
- deleted or disabled tests without equivalent coverage elsewhere
- missing negative-path scenarios for new error or permission branches
- missing boundary scenarios for pagination, empty state, max length, or concurrency
- missing scenarios for settings toggles, feature flags, or role-based visibility
- e2e or integration gaps for cross-component flows touched by the diff

Attack vectors to emphasize:

- negative-path gap
- test could pass while product is broken
- core flow happy-path breakage without regression protection

## Workflow

1. State resolved scope and changed paths.
2. List behavior changes introduced by the diff.
3. Map each change to unit, integration, and e2e coverage.
4. Identify scenarios that would fail on regression but are not represented in tests.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. Name the missing scenario in behavior terms, cite the changed files, and suggest the smallest test type that would catch the regression.
