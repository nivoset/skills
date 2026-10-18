# BDD and Gherkin standard

Gherkin captures shared understanding of observable behavior. A scenario is valid only when a domain stakeholder could understand it without knowing the codebase. If the `bdd` skill is installed, follow it as the authoritative guide; this file is the board's summary and verifier checklist.

## When Gherkin fits

Use it for user- or stakeholder-observable behavior: business rules, permissions, state transitions, money, safety, privacy, cross-role workflows, failure and recovery. Don't use it for internal refactors, framework mechanics, or unit-level logic — write behavior-level acceptance criteria or test plans instead, and say why.

## Discovery before writing

Run a short example-mapping pass on the board (Matt Wynne's technique):

- **Story / capability** (yellow) — the behavior being specified.
- **Rules** (blue) — business rules that constrain it.
- **Examples** (green) — concrete cases per rule, including at least one negative or boundary case.
- **Questions** (red) — unknowns; these become board `question` artifacts, not invented rules.

Too many rules means the story should split; too many questions means it isn't ready.

## File shape

```gherkin
# serves: obj-2, dec-0007   source: q-2.1, evidence-support-tickets-q3
Feature: Refund a delivered order
  Customers can request a refund within 30 days of delivery
  so that they trust buying from us.

  Background:
    Given Dana is a signed-in customer
    And Dana has an order delivered 10 days ago for $40.00

  Rule: Refunds are allowed within 30 days of delivery

    Scenario: Customer requests a refund inside the window
      When Dana requests a refund for the order
      Then Dana sees the refund is approved for $40.00
      And Dana receives a refund confirmation email

    Scenario: Customer requests a refund after the window closes
      Given the order was delivered 31 days ago
      When Dana requests a refund for the order
      Then Dana sees the refund is not available
      And Dana is offered a way to contact support

  Rule: An order can be refunded only once

    Scenario Outline: Repeat refund requests are refused
      Given the order was already refunded <status>
      When Dana requests a refund for the order
      Then Dana sees the order "<message>"

      Examples:
        | status    | message                  |
        | in full   | has already been refunded |
        | partially | has a refund in progress  |
```

## Wording rules

- **Given** = relevant prior state or business context; **When** = one actor action or domain event; **Then** = an observable outcome. One `When` per scenario.
- Use named personas and concrete values (`Dana`, `$40.00`, `31 days`), not `a user`, `valid data`, `some amount`.
- Business language only: no functions, classes, endpoints, DB rows, selectors, mocks, or "clicks the button" unless those words are the user's domain.
- Declarative, not imperative: "Dana requests a refund", not "Dana clicks Refund, then clicks Confirm".
- Scenario titles state the rule outcome ("…is refused"), not "test 3" or "happy path".
- Use `Rule:` to group scenarios by business rule; `Background:` only for setup shared by every scenario in the feature and kept to a few lines.
- Scenario Outlines only when examples vary data, not behavior.

## Coverage expectations

For each rule, consider: happy path; boundary values; invalid input; permission denied; duplicate or repeated action; expired or stale state; unavailable dependency; concurrent action; partial failure and recovery; accessibility-visible feedback; audit or support outcome. Risky workflows (money, safety, allergies, privacy, permissions, destructive, legal, cross-role, irreversible) must not be happy-path-only — include the most important failure, denial, or recovery scenario or record the missing product question.

## Mechanical check

Scenario Outlines, `Background:` and multi-step setups make it easy to lose or double the `When`. Before handing over a feature file, count steps per scenario: exactly one `When` (an `And` directly after `When` counts as a second action — split the scenario or move it into `Given`). If Node is available, parse the file with `@cucumber/gherkin` (`npm i @cucumber/gherkin @cucumber/messages`) and walk each scenario counting `When` and `And`-after-`When` steps; a parse error also catches syntax mistakes. Report the result; don't claim a check you didn't run.

Also re-read the numbers in every scenario against the rule it illustrates (thresholds, percentages, dates). A scenario whose arithmetic contradicts its own rule is worse than a missing one.

## Verifier checklist

- [ ] Header comment names the objectives/decisions served and the source evidence.
- [ ] Feature description states the business value.
- [ ] Every scenario has exactly one `When` and an observable `Then`.
- [ ] No implementation vocabulary; no vague assertions (`works`, `handles errors`, `correct result`).
- [ ] Concrete personas and values throughout.
- [ ] Each `Rule:` has at least one negative or boundary scenario where it matters.
- [ ] Open questions are on the board, not silently assumed.
- [ ] Every scenario maps to a row in the validation plan (or is marked documentation-only with reason).
- [ ] Each scenario stands alone; no hidden dependency on another scenario's run order.
