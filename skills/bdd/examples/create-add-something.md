# Create / Add Something

Example: create user, add signer, create form, add payment method.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User creates item with all required fields
- User creates item with required + optional fields
- User creates item using defaults
- User creates item from a template / preset
- User creates item after correcting validation errors
- User creates item and sees confirmation
- User creates item and can view it afterward
- User creates item and downstream state changes correctly

## Sad / validation cases

- Missing required field
- Invalid field format
- Field too short / too long
- Duplicate item
- User lacks permission
- User is unauthenticated
- Backend rejects request
- Network failure during submit
- Server succeeds but confirmation fails
- Partial save is not allowed
- Partial save is allowed and marked draft

## Edge / boundary cases

- Maximum allowed fields/items
- Minimum required fields
- Special characters
- Unicode / emoji
- Large text input
- Whitespace-only input
- Case-insensitive duplicate
- Submit clicked multiple times
- User navigates away mid-create
- Browser refresh during create
- Autosave conflict

## Research / decision notes

- What defines uniqueness?
- Are drafts supported?
- Are partial failures possible?
- Who can create this?
- What audit/event/logging is required?
- What confirmation should the user see?
