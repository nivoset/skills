# List / Search / Filter / Sort

Example: user list, transaction search, form response table.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User sees default list
- User searches by keyword
- User filters by one field
- User filters by multiple fields
- User sorts ascending
- User sorts descending
- User clears filters
- User pages through results
- User changes page size

## Sad cases

- No results
- Search backend fails
- Filter combination invalid
- User lacks access to some results
- Partial results fail
- Slow query timeout

## Edge cases

- Large result set
- Exact match vs partial match
- Case sensitivity
- Special characters in search
- Empty search
- Whitespace search
- Saved filters
- URL-preserved filters
- Browser back/forward with filters
- Pagination after deleting item
- Sorting with null values

## Research / decision notes

- What is searchable?
- What is filterable?
- What is default sort?
- Is search fuzzy or exact?
- Should filters persist?
- Should results be exportable?
