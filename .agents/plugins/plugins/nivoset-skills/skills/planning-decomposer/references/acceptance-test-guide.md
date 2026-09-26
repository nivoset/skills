# Acceptance Test Guide

Each leaf ticket should include one primary plain-English acceptance test unless more than one scenario is required to remove ambiguity.

Use this format:

```text
Given [actor/context/precondition]
When [actor action or system event]
Then [observable result]
```

Rules:

- Write from the point of view of the user, customer, admin, support agent, or other relevant actor.
- Describe expected behavior, not implementation.
- Avoid class names, endpoints, tables, framework methods, internal services, or file paths.
- Avoid vague phrases such as `works correctly`, `handles errors`, `is performant`, or `is user friendly`.
- Split separate behaviors into separate tickets instead of hiding them in one long test.

Examples:

- `Given I am an account owner viewing an expired teammate invitation`
  `When I choose to resend the invitation`
  `Then the teammate receives a new invitation and the invitation status shows that it was resent`

- `Given a customer account with 10,000 reports`
  `When the customer opens the reports dashboard`
  `Then the dashboard is ready to use within 2 seconds`
