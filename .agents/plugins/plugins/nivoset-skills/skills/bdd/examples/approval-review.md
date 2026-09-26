# Approval / Review

Example: approve request, reject application, review change.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- Reviewer approves item
- Reviewer rejects item with reason
- Reviewer requests changes
- Submitter resubmits
- Approval changes item status
- Decision appears in history

## Sad cases

- Reviewer lacks permission
- Reviewer approves own request when not allowed
- Required review fields missing
- Item already decided
- Backend rejects decision
- Notification fails

## Edge cases

- Multiple reviewers
- Any-one approval
- All-reviewer approval
- Approval expires
- Reviewer changes decision
- Submitter edits after approval
- Escalation path

## Research / decision notes

- Who can approve?
- Can approver be submitter?
- Is rejection reason required?
- Are decisions reversible?
- What is the approval state machine?
