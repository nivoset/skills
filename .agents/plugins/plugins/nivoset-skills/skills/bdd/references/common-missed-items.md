# Common Missed Items

Use this checklist before finalizing Gherkin scenarios. Add scenarios only for cases that materially affect user, stakeholder, support, security, or business outcomes.

## Common Gaps

### Negative Paths

- invalid input
- missing required information
- required resource, ingredient, inventory item, document, or prerequisite is missing
- unsupported values
- cancellation or abandonment
- denied action
- failed confirmation

Prompt: What would the user expect to see when the action cannot be completed, and what recovery path is visible?

### Authorization And Ownership

- wrong role
- correct role in the wrong workspace/account/tenant
- invited or pending user instead of active member
- owner-only actions
- self-action restrictions
- support/admin impersonation limits

Prompt: Who is allowed, who is denied, and what does each person observe?

### Validation Boundaries

- minimum and maximum length
- empty or whitespace-only values
- invalid format
- duplicate values
- reserved names
- unsupported files, currencies, locales, or time zones

Prompt: Which exact boundary values change the expected outcome?

### Empty, Duplicate, Expired, Unavailable, And Partial States

- no results or empty list
- duplicate request or duplicate record
- expired invitation, link, session, subscription, trial, token, or offer
- unavailable product, provider, account, file, ingredient, inventory item, or dependency
- required item is unavailable, out of stock, missing, unsafe, or unusable
- partially completed import, payment, export, upload, or background job

Prompt: What does the actor see, what alternative or recovery path is offered, and can they proceed without guessing?

### Retries And Idempotency

- user submits twice
- browser refreshes after submission
- network retry repeats an action
- payment, invitation, email, or destructive action is triggered more than once

Prompt: Does repeating the same action create duplicates or change the result incorrectly?

### External Dependency Failures

- email/SMS/push provider is unavailable
- payment processor declines or times out
- third-party API returns stale, partial, or unauthorized data
- file storage, search, map, AI, or analytics dependency fails

Prompt: What should users and support teams know when the dependency fails?

### Async Or Background Completion

- queued import/export/report generation
- delayed email or notification
- long-running sync
- webhook arrives late or out of order
- background job fails after the user leaves the page

Prompt: How does the user learn whether the work is pending, completed, failed, or needs action?

### Accessibility-Visible Feedback

- errors visible without relying on color alone
- focus moves to useful feedback after failure
- loading and completion states are perceivable
- disabled actions explain what is missing when appropriate

Prompt: Can the user perceive what happened and what to do next?

### Audit, Support, And Observability Outcomes

Include these only when they are stakeholder-relevant, not as implementation logging.

- support can see why an import failed
- admins can review who performed a destructive action
- users receive a confirmation number or status history
- compliance-relevant actions are visible to authorized staff

Prompt: Who needs evidence later, and what outcome must be visible to them?

## Final Edge-Case Sweep

Ask these before finalizing:

1. What is the most important happy path?
2. What is the most likely user mistake?
3. What required item, resource, ingredient, document, or prerequisite can be missing?
4. What is the most harmful permission mistake?
5. What boundary value changes the outcome?
6. What state can expire, be duplicated, unsafe, unusable, or unavailable?
7. What happens if the same action is repeated?
8. What external system can fail?
9. What work finishes later, and how is the user informed?
10. What message, status, alternative, or recovery path proves the outcome?
11. What scenario would catch a product bug while still avoiding implementation details?

## Scenario Selection Rule

Do not create a scenario for every checklist item. Create scenarios for the smallest set of examples that protects the important business rules and user outcomes.
