# Split Proposal Template

Use this before creating new child tickets or splitting a mixed leaf. Ask for approval after presenting the proposal.

```markdown
## Questline split proposal

Root/parent ticket: <ticket-id/title>
Reason for split: <mixed behavior / uncovered parent objective / dependency boundary / testability issue>

### Proposed child tickets

| Proposed ticket | Parent | Type | Initial status | Covers | Depends on | Why separate/testable |
|-----------------|--------|------|----------------|--------|------------|-----------------------|
| <title> | <parent> | <feature/task/bug> | triage | SCN-1 / AC1 | <ticket or none> | <one red-green-refactor-sized reason> |
| <title> | <parent> | <feature/task/bug> | triage | SCN-2 | <ticket> | <reason> |

### Questions before creation

- <decision needed>
- <scope boundary or dependency question>

### Approval request

Please approve, revise, or reject this split. New tickets will be created as triage/review-needed and must be manually promoted before implementation.
```

## Rules

- Do not create or validate the proposed tickets until the user approves the split.
- Keep each proposed leaf independently testable.
- Use parent scenario IDs and child AC IDs to show coverage.
- Include dependencies between features, tickets, or mixed feature-ticket blockers when they affect sequence.
- If the split changes product scope, call that out explicitly.
