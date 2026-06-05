# Test Evidence Reference

Add this section to implementation-relevant leaf tickets and bugs.

```markdown
## Test Evidence

| AC | Test type | Test name/path | Expected red failure | Verification command/status |
|----|-----------|----------------|----------------------|-----------------------------|
| AC1 | unit/integration/e2e/feature/manual-vet | path/to/test.ext::test_name or TBD | Fails because... | command/status or TBD |
| AC2 | unit/integration/e2e/feature/manual-vet | TBD | Fails because... | TBD |
```

## Guidelines

- Use one row per numbered acceptance criterion.
- Prefer automated tests over manual checks.
- Automated coverage should be planned for every acceptance criterion unless an explicit approved exception exists.
- Manual review/testing may supplement automated tests.
- `Test name/path` may be `TBD` during triage drafting, but `Expected red failure` should still describe the behavior that would fail before implementation.
- `TBD` evidence is acceptable for triage drafting only; it is not enough for objective-check implementation readiness.
- If a codebase feature file already covers the requirement, reference the feature/scenario path.
- If verification depends on code review or vetting, state what evidence that workflow must inspect.
