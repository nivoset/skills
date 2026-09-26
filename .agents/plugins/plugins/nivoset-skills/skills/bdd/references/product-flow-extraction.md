# Product Flow Extraction

Use this reference when turning a website, product description, requirements, notes, screenshots, transcript, or structured data into BDD scenarios.

## Analysis Before Gherkin

Before writing final Gherkin, identify:

1. distinct user goals or flows
2. actors involved
3. user expectations
4. user-facing preconditions for each flow
5. observable outcomes
6. missing information needed for precise scenarios

Prefer the user story lens: who wants what, and why. Split flows when the actor, goal, starting condition, business rule, or expected outcome changes.

## Clarifying Questions And Suggestions

Ask clarifying questions before final Gherkin when missing information affects scenario correctness or when a simple goal has common user-facing variations that change the expected result, such as:

- who can perform an action
- what option, preference, or variation the user wants when several common versions are plausible
- what message, status, or recovery path appears when an action cannot be completed
- what exact boundary values matter
- whether a risky action needs confirmation, cancellation, or support/audit visibility
- whether delayed work has pending, complete, failed, or needs-action states

For underspecified everyday goals, offer the most likely meaningful options instead of treating the shortest literal interpretation as sufficient. Ask about variations that would change the main happy path before writing final scenarios. A request is too underspecified when multiple common user-facing versions would produce different observable outcomes.

When the input is sufficient, produce Gherkin directly and list only meaningful gaps or assumptions afterward.

When the missing choice determines the main happy path, output `## Clarifying Questions` only. Do not draft a default scenario and bury the choice under gaps.

When likely coverage is missing but not enough detail exists to write a supported scenario, suggest the overlooked scenario instead of inventing it. If the missing choice determines the main happy path, ask before final Gherkin; if it is secondary coverage, list it as a suggested overlooked scenario. Phrase suggestions as product questions or candidate flows, for example:

- `Should there be a scenario for invited users whose invitation has expired?`
- `Consider adding a denial scenario for members who can view a workspace but cannot invite others.`
- `The input implies a pending state, but does not say what the user sees while export generation is still in progress.`
- `Should the main scenario cover the plain version only, or should it include common variations that change the expected outcome?`

## Output Format For Extraction Tasks

Use this output shape unless the user asks for a different one:

````md
## Identified Flows

- Flow name: <specific flow>
- User goal: <goal in user language>
- Actor: <actor>
- Source evidence from the provided input: <quote, screenshot note, transcript moment, or concise reference>
- Notes or assumptions, if any: <only if needed>

## Gherkin Specifications

```gherkin
Feature: <clear user-facing capability>

  Background:
    Given <shared user-facing precondition>

  Rule: <specific business rule or expectation>

    Scenario: <specific user goal and outcome>
      Given <observable starting state>
      When <user action>
      Then <observable result>
      And <additional observable result>

    Scenario Outline: <specific variation-based user goal>
      Given <observable starting state>
      When <user performs action with "<input>">
      Then <observable result involving "<outcome>">

      Examples:
        | input | outcome |
        |       |         |
```

## Gaps or Assumptions

- <meaningful gap, uncertainty, assumption, or suggested overlooked scenario>
````

If the input is insufficient to write scenarios, output only:

```md
## Clarifying Questions

1. <question needed to write precise Gherkin>
```

Use the extraction sections exactly as named above for product-material extraction tasks. Reserve alternate headings such as `## Product questions` or `## Missed gaps or edge cases` for standalone drafting or review tasks where the extraction format was not requested.

## Gherkin Quality Rules

- Use clear, specific names for every `Feature`, `Rule`, `Scenario`, and `Scenario Outline`.
- Keep each scenario focused on one behavior and one `When` event.
- Keep scenarios self-contained; the `Given` steps must include enough user-facing context to understand the behavior without relying on another scenario.
- Use third-person, present-tense, declarative wording.
- Do not mention code, APIs, databases, services, components, page internals, selectors, or technical architecture unless explicitly visible to the user.
- Do not use vague assertions such as `the system works correctly`, `the user has a good experience`, `the data is processed`, `the page loads successfully`, or `the user is notified appropriately`.
- Describe messages, statuses, choices, confirmations, delivered artifacts, denied access, visible history, or other observable outcomes.
- Use `Scenario Outline` only when one rule is proven by multiple meaningful variations.
- Do not invent unsupported business rules. Mark uncertain details as assumptions or questions.
