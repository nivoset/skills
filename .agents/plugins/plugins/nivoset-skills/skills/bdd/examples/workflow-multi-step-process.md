# Workflow / Multi-Step Process

Example: onboarding, checkout, application flow, publish flow.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User completes all steps in order
- User saves progress
- User resumes later
- User goes back to previous step
- User edits earlier step and continues
- Final submission succeeds
- Final status is correct

## Sad cases

- Required step skipped
- Invalid data blocks progress
- User loses access mid-flow
- Backend failure on one step
- Final submission fails
- User abandons flow
- User refreshes mid-flow

## Edge cases

- Deep link to later step
- Conditional steps
- Step removed due to answer change
- Previous answers become invalid
- Multiple browser tabs
- Expired session
- Autosave conflict
- Draft vs submitted state

## Research / decision notes

- Can steps be skipped?
- Are steps linear or flexible?
- Is progress saved automatically?
- What is the source of truth for current step?
- What states exist: draft, ready, submitted, failed, approved?
