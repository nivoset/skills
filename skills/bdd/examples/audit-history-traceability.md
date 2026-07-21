# Audit / History / Traceability

Example: who changed role, who approved request, who edited data.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- Action creates audit entry
- Audit entry includes actor
- Audit entry includes timestamp
- Audit entry includes before/after values
- Authorized user can view history

## Sad cases

- Audit write fails
- User lacks permission to view audit
- Actor unknown/system actor
- Sensitive value should not be logged

## Edge cases

- Bulk changes
- Automated changes
- External integration changes
- Impersonation/delegated access
- Redacted values
- Time zone display
- Immutable audit records

## Research / decision notes

- Which actions require audit?
- What values are redacted?
- Who can view history?
- Is audit write required for action success?
