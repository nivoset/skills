# When To Use Gherkin

## Use Gherkin When Examples Clarify Behavior

Gherkin is useful when a concrete example helps product, design, QA, support, and engineering agree on expected behavior before implementation.

Use it for:

- business rules with clear outcomes
- user journeys with meaningful states
- acceptance criteria that are too vague without examples
- permission, role, ownership, or account-boundary behavior
- state transitions such as draft, pending, approved, expired, cancelled, failed, or completed
- error and recovery paths users or support teams need to understand
- cross-role workflows where one person's action affects another person's experience
- policies where edge cases matter, such as billing, invitations, imports, exports, destructive actions, privacy, and notifications

## Do Not Use Gherkin For Implementation-Only Work

Avoid Gherkin when the requested behavior cannot be expressed as stakeholder-visible behavior.

Usually do not use it for:

- low-level unit behavior that only checks a helper, parser, class, or private method
- internal refactors with no behavior change
- framework mechanics, rendering plumbing, dependency injection, mocks, or routing internals
- implementation-only checks such as database indexes, API contracts, cache keys, or queue names
- purely technical cleanup where the acceptance test is better stated as a verification command or engineering checklist

If the user asks for Gherkin anyway, translate the request upward:

- Bad: `Scenario: BillingService uses InvoiceRepository`
- Better acceptance criterion: `Existing billing outcomes remain unchanged after the billing persistence refactor.`
- Better Gherkin only if there is a real behavior: `Scenario: A customer sees the same invoice total after billing records are reorganized`

## Wording Rules In Domain Language

Use words the actor or stakeholder would recognize:

- user, member, owner, admin, support agent, customer, patient, applicant
- invitation, workspace, invoice, subscription, order, claim, report
- pending, expired, cancelled, approved, unavailable, duplicate, overdue

Avoid code words unless they are visible domain terms:

- API, endpoint, component, service, store, query, selector, mock, fixture, database row, event handler, repository

## Decision Check

Before writing Gherkin, ask:

1. Is there an actor, stakeholder, or external system with a visible goal?
2. Is there a meaningful business rule, permission, state, or outcome?
3. Would an example reduce ambiguity better than prose?
4. Can the `Then` be observed without inspecting internals?

If any answer is no, prefer plain acceptance criteria, a technical checklist, or a test plan instead of Gherkin.
