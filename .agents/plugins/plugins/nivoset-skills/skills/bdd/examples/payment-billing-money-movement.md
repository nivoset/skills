# Payment / Billing / Money Movement

Example: checkout, subscription, refund, bank transfer.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User makes payment successfully
- User sees receipt/confirmation
- Payment status updates
- Subscription starts/renews
- Refund succeeds
- Failed payment can be retried

## Sad cases

- Card declined
- Insufficient funds
- Payment provider error
- Duplicate payment attempt
- Refund rejected
- User cancels during payment
- Payment succeeds but local update fails

## Edge cases

- Pending payment
- Partial refund
- Chargeback
- Currency handling
- Tax/fee calculation
- Expired payment method
- Saved payment method removed
- Idempotent payment submit

## Research / decision notes

- What payment states exist?
- Who is source of truth?
- How are duplicates prevented?
- What financial events are audited?
