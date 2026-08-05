# Contracts Review

## Lane Id

`contracts`

## Purpose

Detect public compatibility changes introduced by the diff: API, CLI, config, event, schema, payload, status-code, or backwards-compatibility breaks.

## Topic Scope

Detect public compatibility changes only: API, CLI, config, event, schema, payload, status-code, or backwards-compatibility contract breaks.

## When to Use

- Use when component props, public APIs, CLI flags, config keys, event names, schemas, or test IDs change.
- Use when consumer code, automation, or downstream services may depend on prior shapes or behavior.
- Do not use for internal refactors with no public surface change.

## Core Rules

- Focus on surfaces other code, tests, operators, or automation may depend on.
- Distinguish intentional breaking changes with migration notes from accidental drift.
- Prefer read-only investigation and contract/docs comparison.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- changed function, component, hook, or module signatures without caller updates
- removed props, fields, endpoints, commands, or events still used elsewhere
- changed response shapes, status codes, error codes, or enum values
- changed config keys, defaults, or environment assumptions
- changed test IDs, menu labels, or automation-facing strings without downstream updates
- behavioral contract changes such as same-tab navigation becoming new-tab-only
- schema or migration changes without backward compatibility or rollout plan

Attack vectors to emphasize:

- validation drift
- configuration or environment assumption
- product copy mismatch when labels promise different behavior
- file, import, or export failure for public surfaces

## Workflow

1. State resolved scope and changed paths.
2. Identify public surfaces touched by the diff.
3. Search for inbound references, automation strings, and docs that still assume the old contract.
4. Classify each change as safe internal refactor, documented break, or accidental compatibility risk.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. State the old contract, the new contract, who breaks, and the smallest migration or compatibility shim.
