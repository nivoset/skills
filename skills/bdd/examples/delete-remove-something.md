# Delete / Remove Something

Example: delete file, remove signer, cancel event.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User deletes item
- User confirms deletion
- User cancels deletion
- Deleted item disappears from list
- Related state updates correctly
- Deletion creates audit/event record

## Sad cases

- User lacks permission
- Item already deleted
- Item is locked / in use
- Item has dependencies
- Backend rejects delete
- Network failure during delete
- Delete succeeds but UI still shows item

## Edge cases

- Soft delete vs hard delete
- Restore deleted item
- Delete parent with children
- Delete last remaining item
- Delete while another user is viewing/editing
- Double-click delete
- Delete from list vs detail page

## Research / decision notes

- Is delete reversible?
- What dependencies block deletion?
- Should user see impact summary?
- What happens to historical records?
