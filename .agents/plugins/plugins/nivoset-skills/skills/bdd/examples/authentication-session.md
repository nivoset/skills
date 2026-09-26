# Authentication / Session

Example: login, logout, expired session, MFA.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User logs in successfully
- User logs out
- User remains logged in across refresh
- User is redirected after login
- User accesses protected page after login

## Sad cases

- Invalid credentials
- Locked account
- Expired password/session
- MFA failure
- Auth provider unavailable
- User tries protected route unauthenticated

## Edge cases

- Session expires mid-action
- Multiple tabs
- Back button after logout
- Deep link before login
- Remember-me behavior
- Token refresh failure
- Role changes during session

## Research / decision notes

- How long do sessions last?
- What happens when session expires?
- Are actions retried after re-auth?
- Are auth errors recoverable?
