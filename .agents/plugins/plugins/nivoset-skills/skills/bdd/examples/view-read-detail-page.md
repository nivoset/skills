# View / Read / Detail Page

Example: view account, view form response, view order.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User views item details
- User sees all expected fields
- User sees empty optional fields handled correctly
- User sees derived/computed values
- User sees related records
- User sees correct status/state

## Sad cases

- User lacks permission
- Item does not exist
- Item was deleted
- Data failed to load
- Related data failed to load
- Partial data available
- User is unauthenticated

## Edge cases

- Very large item
- Missing legacy data
- Deprecated field values
- Slow loading state
- Refresh page directly on detail URL
- Deep link to restricted item
- Mobile/small screen view

## Research / decision notes

- What fields are mandatory to display?
- What can be hidden due to permissions?
- Is partial display acceptable?
- What empty states are needed?
