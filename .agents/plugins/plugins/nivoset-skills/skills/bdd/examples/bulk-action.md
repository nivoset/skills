# Bulk Action

Example: bulk delete, bulk approve, bulk assign, bulk export.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User selects multiple items
- User performs bulk action
- All selected items succeed
- User sees summary
- Items update correctly

## Sad cases

- Some selected items fail
- User lacks permission for some items
- Invalid item state for some items
- Backend rejects bulk request
- Bulk action times out

## Edge cases

- Select all visible
- Select all matching filter
- Very large selection
- Mixed statuses
- Partial success
- Retry failed items
- Undo bulk action
- Confirmation with impact count

## Research / decision notes

- Is partial success allowed?
- How are failures reported?
- Is bulk action async?
- Is undo supported?
