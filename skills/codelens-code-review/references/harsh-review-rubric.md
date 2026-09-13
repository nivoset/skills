# Harsh Review Rubric

## What deserves a finding

A finding must identify a behavior or risk that matters. Strong findings show one or more of:

- A reachable path to incorrect output, data loss, security exposure, financial error, outage, or user confusion.
- A changed contract, schema, state transition, or permission rule that is not enforced.
- A failure path that is swallowed, retried unsafely, made non-idempotent, or left unobservable.
- A test that can pass while the product behavior is broken, especially because it mocks the boundary under review.
- A repeated or coupled implementation that creates a concrete drift or blast-radius risk.
- A structural regression that makes the changed behavior materially harder to understand or modify.

Do not report “this is ugly,” “I would refactor it,” or “an AI probably wrote this” without a specific consequence.

## Suggestion standard

For each accepted finding, provide:

1. The smallest safe repair that removes or contains the failure mode.
2. The test, assertion, analyzer query, or operational check that should prove the repair.
3. A material tradeoff or deferred follow-up, if one exists.

Separate required repair from optional cleanup. A harsh review is useful when it makes the next decision easier, not when it produces an indiscriminate rewrite plan.

## AI-slop indicators

Treat these as prioritization signals only:

- Boilerplate wrappers that add no domain behavior.
- Repeated validation, mapping, or error-handling blocks that can drift.
- Abstractions used once with generic names and no stable contract.
- Long functions with shallow branching, redundant comments, or obvious restatement.
- Happy-path tests with no boundary, failure, authorization, retry, or persistence assertions.
- New code that ignores established helpers, conventions, schemas, or error types.
- Broad generated-looking changes that alter many files without corresponding behavior coverage.
- Health or complexity regressions concentrated in a new patch.

The correct conclusion is “likely under-reviewed or low-quality code,” followed by proof of the actual risk. Never infer authorship from style, commit timing, token patterns, or formatting.

## Severity test

- **P0:** catastrophic or irreversible impact; likely security breach, corruption, financial loss, or critical outage.
- **P1:** important workflow breakage, silent loss, unsafe permission behavior, or repeated operational failure.
- **P2:** meaningful edge-case defect, missing validation, weak negative-path coverage, or maintainability risk with a credible failure path.
- **P3:** localized real issue with limited impact; use sparingly.

Severity is impact, not how surprising the code looks. Confidence is separate from severity.

## Evidence ladder

Rank evidence from strongest to weakest:

1. Reproduced failure or focused failing test.
2. Deterministic static proof through a reachable code path, contract, or analyzer.
3. Existing test, log, trace, or metric that demonstrates the behavior.
4. Strong structural signal plus a directly connected missing guard or assertion.
5. CodeLens score, hotspot, coupling, or authorship concentration alone.

Items at level 5 are investigation targets, not confirmed findings.

## Delegation quality bar

Delegates should be judged on evidence and useful disagreement, not finding volume. A good delegate can return “no issue found” for a bounded path, identify uncertainty, and suggest the next proof. The parent should reject:

- duplicate findings with different wording,
- findings based only on a CodeLens metric,
- suggestions that expand scope without reducing a verified risk,
- fixes that mask the symptom without testing the underlying behavior,
- AI-authorship claims presented as technical evidence.
