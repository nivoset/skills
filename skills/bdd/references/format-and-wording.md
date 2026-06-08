# Format And Wording

## Structure

Use the smallest structure that explains the behavior.

```gherkin
Feature: Capability users or stakeholders care about

  Rule: Business rule, permission, or policy

    Scenario: Observable outcome for one concrete example
      Given relevant context only
      When one user action or domain event occurs
      Then observable outcome
      And another observable outcome from the same event
      But excluded or prevented outcome when useful
```

Use `Scenario Outline` only when the same behavior must be proven across multiple meaningful examples. This is especially useful when the same rule applies to multiple unsafe, unavailable, expired, duplicate, or invalid examples and only the example value or visible message changes.

```gherkin
Scenario Outline: Invite addresses are checked before invitations are sent
  Given the workspace owner is inviting a new member
  When the owner submits "<email>"
  Then the owner sees "<message>"

  Examples:
    | email              | message                         |
    | not-an-email       | Enter a valid email address     |
    | existing@team.test | This member is already invited  |
```

## Step Rules

- `Given` = relevant context only. Do not include actions the user performs in the scenario.
- `When` = one user/stakeholder action or domain event. Split `does X and Y` into separate scenarios unless the phrase names one domain action.
- `Then` = observable result, decision, message, state, permission outcome, notification, or support-visible record. A `Then` should be an outcome, not another action.
- `And` = more of the same step type.
- `But` = a contrast or prevented outcome, used sparingly.
- Name both the actor and affected recipient when they differ. For safety, preference, permission, or cross-role scenarios, make clear who acts and who experiences the outcome.

## Wording Rules

Prefer concrete examples over vague assertions. Define safety, readiness, and validity through observable checks, labels, warnings, visible conditions, or accepted/rejected outcomes.

Avoid:

- `works`
- `handles errors`
- `validates input`
- `returns correct result`
- `knows`, `understands`, or `realizes` without a visible message, choice, or artifact
- ambiguous possibilities such as `may have peanut butter on it` unless the precautionary rule is the behavior being specified
- `the API is called`
- `the database row is created`
- `the component renders`
- `the mock email service receives a request`

Prefer:

- `the owner sees that the invitation is pending`
- `the invited person receives an invitation email`
- `the member cannot access the workspace after the invitation expires`
- `the user sees that two usable slices of bread are required`
- `the sandwich is prepared only on equipment reserved for the non-allergic eater`
- `support can see why the import failed`

## Good And Bad Rewrites

### Implementation Details

Bad:

```gherkin
Scenario: Create invite row
  Given the InviteService is mocked
  When the client calls POST /api/invites
  Then an invite row is inserted in the database
  And the email mock is called
```

Good:

```gherkin
Scenario: Workspace owner invites a new member
  Given Alex owns the workspace "Design Team"
  And Priya is not a member of the workspace
  When Alex invites Priya to the workspace
  Then Alex sees that Priya's invitation is pending
  And Priya receives an invitation to join "Design Team"
```

### Vague Assertions

Bad:

```gherkin
Scenario: Validate input
  Given a user is on the form
  When they enter bad data
  Then it handles errors
```

Good:

```gherkin
Scenario: Owner sees which invitation address must be corrected
  Given Alex owns the workspace "Design Team"
  When Alex tries to invite "not-an-email"
  Then Alex sees "Enter a valid email address"
  And no invitation is sent
```

### Too Many Actions

Bad:

```gherkin
Scenario: Reset password and sign in
  Given Morgan forgot their password
  When Morgan requests a reset link and opens the email and chooses a new password and signs in
  Then Morgan can use the app
```

Good:

```gherkin
Scenario: User receives a password reset link
  Given Morgan has an active account
  When Morgan requests a password reset
  Then Morgan receives instructions for choosing a new password
```

```gherkin
Scenario: User signs in with a new password after reset
  Given Morgan has chosen a new password using a valid reset link
  When Morgan signs in with the new password
  Then Morgan can access their account
```

### Wrong Tool

Bad:

```gherkin
Scenario: Refactor BillingService
  Given BillingService uses the old repository
  When the service is refactored
  Then the tests pass
```

Better as a technical acceptance criterion:

```md
Existing billing behavior remains unchanged after persistence code is reorganized, verified by the billing regression suite.
```

If behavior must be documented, write the observable behavior instead:

```gherkin
Scenario: Customer sees the same invoice total after billing data is recalculated
  Given a customer has a monthly subscription with a prorated upgrade
  When the customer views the invoice for that month
  Then the invoice total matches the agreed subscription charges and prorated adjustment
```
