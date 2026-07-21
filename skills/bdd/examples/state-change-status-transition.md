# State Change / Status Transition

Example: draft → published, pending → approved, active → suspended.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User moves item from valid state to next valid state
- State change updates UI
- State change triggers side effects
- State change appears in history
- User sees confirmation

## Sad cases

- Invalid transition
- User lacks permission for transition
- Required data missing for transition
- Transition rejected by backend
- Side effect fails
- Item changed state before user submits

## Edge cases

- Reverting state
- Repeating same transition
- Transition from stale page
- Multiple users transition at same time
- Scheduled transition
- Automatic transition
- Manual override
- Transition with warnings

## Research / decision notes

- What is the full state machine?
- Which transitions are allowed?
- Which transitions are reversible?
- What side effects happen?
- Are transitions audited?
