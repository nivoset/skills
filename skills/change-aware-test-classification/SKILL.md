---
name: change-aware-test-classification
description: Use when classifying tests, reviewing a code or business-rule change, designing test-selection tags, auditing coverage, or deciding which confidence suites should run in CI.
---

# Change-Aware Test Classification

## Purpose

Use a small, stable vocabulary to connect changed code, business rules, feature specifications, and tests. Test names and scenarios describe exact behavior; tags describe reusable responsibilities that justify selecting a group of tests together.

The goal is to answer:

- Which confidence areas does this change affect?
- Which tests run beyond the permanent baseline?
- Are important business rules represented by suitable tests?
- Are tags missing, duplicated, too broad, or too specific?
- Does a changed rule imply verification in neighboring areas?

Do not try to give every behavior a unique tag.

## Core model

Tests may have tags from two categories:

- **Baseline:** `@important` — a major normal-use path whose failure would prevent ordinary use or cause immediate, significant user complaints. These are normally representative happy paths.
- **Change area:** broad, stable responsibilities such as `@authentication`, `@authorization`, `@persistence`, `@validation`, `@pricing`, `@calculation`, `@publishing`, `@notifications`, `@search`, `@reporting`, `@imports`, and `@exports`. Use the project’s catalog when one exists.

`@important` is not a synonym for serious, secure, high-risk, edge-case, validation, or expensive. Apply it only to the permanent user-impact baseline.

### Selection rule

For every meaningful change, select the union of:

1. directly related tests;
2. every `@important` test; and
3. all tests carrying affected change-area tags, including areas reached through approved `expandsTo` relationships.

Change-area suites are additive; the baseline always runs.

```text
run = directTests ∪ @important ∪ affectedTags ∪ expandedTags
```

Do not automatically select `related` tags. They are review guidance only unless the project explicitly says otherwise.

## Classification workflow

### 1. Inspect the project vocabulary

Find the existing tag catalog, test metadata conventions, suite-level tags, CI selection syntax, and representative tests. Reuse the project’s spelling and storage format. If no catalog exists, propose one in the project’s established configuration location rather than inventing a parallel system.

### 2. Identify responsibility and direct tests

For each changed file, symbol, rule, contract, or scenario, ask:

- What business decision or technical responsibility is exercised?
- What broad area would lose confidence if this failed?
- Which tests directly cover the changed behavior?
- What group should run when this responsibility changes?

Trace beyond the nearest folder. Check shared services, persisted shapes, callers, authorization or eligibility effects, and downstream business behavior.

### 3. Reuse or propose tags

Prefer one canonical existing term; do not create synonyms such as `@auth`, `@authentication`, and `@login`. Propose a new tag only when all are true:

- multiple tests can belong to it;
- a code or business-rule change could select it;
- the full group provides meaningful additional confidence;
- its meaning survives implementation refactors;
- it is broader than one case but narrower than the application.

Assign the minimum useful set. Tag a test only when that tag would reasonably justify selecting it after a related change.

### 4. Evaluate baseline membership

Add `@important` only if the test represents a major, ordinary user journey. Remove or flag it on minor validation cases, rare administrative behavior, implementation details, low-frequency edge cases, or expensive recovery scenarios.

### 5. Determine impact and expansion

Classify impact explicitly:

- **Direct:** changed code belongs to the area, e.g. an encryption adapter → `@encryption`.
- **Business rule:** changed logic implements a named decision, e.g. discount eligibility → `@discounts`, possibly `@pricing`.
- **Shared responsibility:** one service supports several areas, e.g. date calculation → `@scheduling`, `@billing`, `@retention`.
- **Contract:** a changed data shape or interface affects consumers, e.g. account status → `@accounts`, `@authorization`, `@workflow`.

Use `expandsTo` only when one area should normally select another area’s tests. Use `related` for non-automatic review prompts. Keep the graph small.

### 6. Review neighboring behavior

Ask whether the change alters persisted data, a shared contract, authorization, eligibility, pricing, a permanent important path, or another business area fed by the changed rule. Explain every affected or assigned tag with a brief reason.

## Catalog rules

Maintain the catalog in version control. Each entry should have this shape (catalog keys omit the display `@`):

```yaml
tags:
  authorization:
    definition: Rules controlling whether an actor may perform an action or access a resource.
    include:
      - role checks
      - ownership checks
      - policy evaluation
    exclude:
      - identity verification
      - encryption
    owners: []
    expandsTo: []
    related:
      - accounts
      - workflow
```

Good tags name responsibilities: `@permissions`, `@encryption`, `@tax`, `@inventory`, `@scheduling`, `@workflow`, `@eligibility`, `@approval`, `@allocation`, `@scoring`, `@retention`, or `@compliance`.

Avoid behavior- or implementation-specific tags such as `@login-button`, `@rejects-empty-name`, `@bcrypt`, `@user-service`, or `@ticket-123`.

Add tags when real selection or incident-investigation needs appear. As a guideline, keep roughly 5–20 tags in a small system and 10–40 in a medium system.

For a proposed tag, include:

```yaml
tag: pricing
definition: Rules that determine monetary amounts presented, charged, or stored.
include:
  - base price calculation
  - discounts
  - price adjustments
exclude:
  - payment transport
  - invoice delivery
triggerExamples:
  - pricing rule changes
  - rounding changes
  - price input changes
```

## Review checks

Flag, with evidence and a suggested correction:

- **Missing classification:** a test has no meaningful change-area tag and is not covered by a clear parent or suite-level tag.
- **Over-specific tag:** replace a single-case tag with responsibility tags such as `@validation` and `@submissions`.
- **Over-broad tag:** split `@application` into independently selectable responsibilities.
- **Duplicate concepts:** choose one canonical tag and plan migration from synonyms.
- **Misused `@important`:** remove it from minor, rare, implementation-specific, edge, or recovery tests.
- **Missing impact expansion:** a changed area clearly alters another area’s behavior but that area is not selected.
- **No selection value:** remove or challenge tags that nobody would intentionally use to run or report on tests.

Do not flag a test as missing classification when a clear suite-level or parent tag already selects it.

## Output formats

When analyzing a change, return concise YAML-like data and reasons:

```yaml
baseline:
  - important
directTests:
  - path/to/related.test.ts
affectedTags:
  - encryption
  - persistence
expandedTags:
  - security
runExpression:
  any:
    - important
    - encryption
    - persistence
    - security
reasons:
  encryption: The changed code transforms protected values.
  persistence: The encrypted representation is stored and retrieved.
  security: The change alters protection of sensitive data.
review:
  - Verify important journeys still work.
  - Verify backward compatibility with previously stored values.
```

When reviewing a test:

```yaml
test: stores the adjusted price
recommendedTags:
  - pricing
  - persistence
important: false
reason:
  pricing: The test verifies a calculated business amount.
  persistence: The amount is stored for later use.
warnings: []
```

When proposing a tag, use the catalog shape above and explain why existing tags do not fit. If definitions remain unclear, ask focused questions about primary journeys, independently changing decisions, shared services, expensive suites, permanent baseline tests, CI selection, and production-incident investigation. Do not require exhaustive architecture documentation before making an incremental, evidence-based proposal.

## Final rule

Always run `@important`, directly related tests, and all tests for affected responsibilities. Use names and scenarios for exact behavior; use broad responsibility tags for reusable change selection.

