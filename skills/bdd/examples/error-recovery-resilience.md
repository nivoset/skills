# Error / Recovery / Resilience

This can be attached to almost every story.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy-ish recovery cases

- User retries after failure
- User refreshes and state is correct
- User resumes after interruption
- System recovers from temporary failure

## Sad cases

- Backend unavailable
- Timeout
- Validation service unavailable
- Dependency unavailable
- Unknown error
- Data conflict
- Partial write

## Edge cases

- Duplicate submit after retry
- Offline behavior
- Slow response
- Error after success
- Success after UI timeout
- Stale cache after failure
- Error message exposes sensitive data

## Research / decision notes

- What errors are user-actionable?
- What errors should be logged only?
- What can be retried safely?
- What must be idempotent?
