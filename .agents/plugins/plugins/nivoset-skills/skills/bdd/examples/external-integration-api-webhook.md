# External Integration / API / Webhook

Example: payment provider, DocuSign, CRM sync, webhook callback.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- System sends valid request to integration
- Integration returns success
- System stores external ID
- User sees synced status
- Incoming webhook updates local state

## Sad cases

- Integration timeout
- Integration returns error
- Auth/token failure
- Rate limit
- Duplicate webhook
- Webhook arrives out of order
- External state conflicts with local state

## Edge cases

- Retry behavior
- Idempotency key
- Partial success
- Manual resync
- External item deleted
- External permissions changed
- Sandbox vs production config
- Delayed callback

## Research / decision notes

- What is the source of truth?
- What must be idempotent?
- What retries are safe?
- What events do we subscribe to?
- How are external failures surfaced?
