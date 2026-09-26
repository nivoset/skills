# Permission / Role / Access Control

Example: admin can invite users, signer cannot add signer, auth rep can act on account.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- Authorized user can perform action
- Unauthorized user cannot perform action
- User sees only allowed actions
- User sees allowed data only
- Role change updates access
- Permission inheritance works

## Sad cases

- User attempts forbidden action directly by URL/API
- User had permission but lost it
- User is unauthenticated
- User has conflicting roles
- User belongs to multiple groups/accounts
- Backend rejects unauthorized action

## Edge cases

- Admin acting on own account
- Last admin cannot be removed
- Temporary permissions
- Delegated access
- Permission changes during active session
- Cached permission state
- Cross-account access attempt

## Research / decision notes

- What is the source of truth for permissions?
- Are permissions checked in UI, API, or both?
- Are role changes immediate?
- How are conflicts resolved?
- What should forbidden users see?
