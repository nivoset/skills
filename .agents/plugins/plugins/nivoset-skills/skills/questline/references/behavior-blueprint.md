# Behavior Blueprint Reference

Add this section to parent/roll-up tickets when the parent describes user-visible or system-visible behavior across multiple child tickets.

```gherkin
## Behavior Blueprint

Feature: <parent capability>

  @SCN-1
  Scenario: <behavior slice name>
    Given <starting context>
    When <user or system action>
    Then <observable outcome>
    And <important invariant>

  @SCN-2
  Scenario: <another behavior slice>
    Given <starting context>
    When <user or system action>
    Then <observable outcome>
```

## Guidelines

- Keep scenarios behavior-level: what the user or system does and observes.
- Do not describe selectors, component IDs, low-level API calls, or implementation steps unless those are the user-visible contract.
- Use 3-7 high-signal scenarios for most parent tickets.
- Give every scenario a stable ID (`SCN-1`, `SCN-2`, ...).
- Child tickets should reference covered scenario IDs: `Covers: SCN-1, SCN-2`.
- Parent verification requires every scenario ID to map to child acceptance criteria and test evidence, or to an explicit deferred/non-goal note.
- If implementation discovery finds a mismatch, comment at the lowest correct ticket level with the question, problem, evidence, and suggested next action.
