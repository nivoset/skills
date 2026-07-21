# Configuration / Settings

Example: form settings, account preferences, feature toggles.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User changes setting
- Setting persists after refresh
- Setting affects behavior
- User resets to default
- User cancels setting change

## Sad cases

- Invalid setting combination
- User lacks permission
- Save fails
- Setting conflict
- Setting unavailable for plan/account

## Edge cases

- Default inheritance
- Account-level vs user-level settings
- Feature flag disabled
- Setting changed in another tab
- Setting migration from old value
- Dependent settings enabled/disabled

## Research / decision notes

- What is the default?
- Who owns the setting?
- Is setting per-user, per-team, or global?
- Are invalid combinations prevented or warned?
