# Import / Upload

Example: upload CSV, import users, upload document.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User uploads valid file
- User previews import
- User confirms import
- System imports all valid rows
- System reports success
- Uploaded data appears in target location

## Sad cases

- Invalid file type
- File too large
- Malformed file
- Missing required columns
- Invalid row data
- Duplicate rows
- Upload fails
- Import partially fails
- User lacks permission

## Edge cases

- Empty file
- Huge file
- Mixed valid/invalid rows
- Special characters
- Encoding issues
- Duplicate detection
- Retry same file
- Cancel upload
- Upload interrupted
- Import in progress while user leaves page

## Research / decision notes

- Is partial import allowed?
- Is preview required?
- Are imports reversible?
- How are row errors shown?
- What file types are supported?
