# Edit / Update Something

Example: edit profile, update form settings, change account role.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User edits one field
- User edits multiple fields
- User edits optional field
- User clears optional field
- User saves without changes
- User saves and sees confirmation
- User edits and changes are reflected elsewhere
- User cancels and changes are discarded

## Sad / validation cases

- Invalid updated value
- Missing required value after edit
- User loses permission before saving
- Item was deleted before saving
- Item was changed by another user
- Backend rejects update
- Network failure during save
- Save succeeds but page state does not refresh

## Edge / boundary cases

- Concurrent edits
- Stale data
- Undo / revert behavior
- Large field update
- Rapid repeated saves
- Edit while dependent workflow is active
- Edit locked field
- Edit archived item

## Research / decision notes

- Is optimistic update allowed?
- Does edit require confirmation?
- Are changes audited?
- Are previous values retained?
- What fields are immutable?
