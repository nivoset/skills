---
name: bdd
description: Use when writing, reviewing, or refining Gherkin, BDD scenarios, acceptance criteria, feature files, behavior specs, examples, user journeys, business rules, edge cases, or Given/When/Then wording.
---

# BDD

## Purpose

Use this skill to turn user functionality into clear Gherkin behavior specifications. The goal is shared product understanding: scenarios describe observable user, stakeholder, or system-domain behavior, not implementation mechanics.

## Core Rule

A scenario is valid only when a domain stakeholder could understand it without knowing the codebase. Follow the `test-name` principle: behavior-first wording, no vague assertions, and no implementation details.

Reject or rewrite scenarios that mention functions, classes, services, components, APIs, database rows, mocks, selectors, framework plumbing, internal state, or private methods unless those words are part of the user's visible domain.

## When to Use

Use this skill when the task involves:

- Gherkin, BDD, Given/When/Then, feature files, examples, scenarios, or Scenario Outlines
- acceptance criteria that need concrete examples
- business rules, permission behavior, state transitions, recovery paths, or cross-role workflows
- reviewing behavior specs for missed gaps, edge cases, vague wording, or implementation leakage

Do not use Gherkin by default for internal refactors, low-level unit behavior, framework mechanics, or implementation-only checks. Use [`references/when-to-use-gherkin.md`](./references/when-to-use-gherkin.md) when the format choice is unclear.

## Workflow

1. **Decide if Gherkin fits.** If the request is implementation-only, explain why Gherkin is the wrong format and offer behavior-level acceptance criteria instead.
2. **Extract observable behavior.** Identify actors, goals, business rules, permissions, states, and user-visible outcomes.
3. **Draft in business language.** Use Feature, optional Rule, Scenario, Scenario Outline, Given, When, Then, And, and But consistently. See [`references/format-and-wording.md`](./references/format-and-wording.md).
4. **Review for missed cases.** Check negative paths, authorization, boundaries, duplicates, expired states, unavailable dependencies, retries, async completion, accessibility-visible feedback, and support/audit outcomes. For risky workflows, do not finalize happy-path-only specs. Risky means safety, allergies, money, privacy, permissions, destructive actions, legal/compliance, cross-role effects, or irreversible outcomes. Include the most important failure, denial, unavailable-resource, or recovery example, or list the missing product question. See [`references/common-missed-items.md`](./references/common-missed-items.md).
5. **Rewrite weak scenarios.** Replace vague or implementation-heavy text with concrete domain examples and observable results.

## Quality Bar

Before finalizing, every scenario should answer:

- Who is trying to do what?
- What relevant state or business rule matters before the action?
- What one user/stakeholder action or domain event occurs?
- What observable outcome proves the behavior?
- What important negative, boundary, permission, or recovery case would users expect?

## Red Flags

Stop and rewrite when you see:

- `works`, `handles errors`, `validates input`, `returns correct result`, or `should behave correctly`
- `clicks the button`, `calls the API`, `writes to the database`, `mocks the service`, or `renders the component`
- multiple unrelated user actions in one `When`
- assertions about implementation side effects instead of user-visible results
- only a happy path for a risky workflow
- happy-path-only coverage for safety, allergy, financial, privacy, permission, destructive, compliance, cross-role, or irreversible workflows
- no permissions, invalid input, unavailable dependency, duplicate, expired, or boundary coverage where those states matter

## Output Shape

When writing specs, return scenarios first. Include missed gaps, edge cases, or product questions when drafting reveals important ambiguity; do not hide unresolved behavior by inventing it.

Prefer:

```gherkin
Feature: <capability users or stakeholders care about>

  Rule: <business rule, permission, or policy>

    Scenario: <observable outcome for a concrete example>
      Given <relevant context>
      When <one user action or domain event>
      Then <observable outcome>
```

When useful, append:

```md
## Missed gaps or edge cases
## Product questions
```

When reviewing specs, return:

```md
## BDD Review
### Format decision
### Rewritten scenarios
### Missed gaps and edge cases
### Wording changes made
### Remaining product questions
```

Omit sections that do not apply.

## References

- [`references/when-to-use-gherkin.md`](./references/when-to-use-gherkin.md)
- [`references/format-and-wording.md`](./references/format-and-wording.md)
- [`references/common-missed-items.md`](./references/common-missed-items.md)
