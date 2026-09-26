# Comment Contract

Use concise comments that another coding agent can execute without private context.

## Blocker Comment

```md
Blocker: [behavior-focused title]

Repair prompt:
[Imperative sentence naming the user-facing behavior to restore.]

Failure mode:
[Specific user action or system event] can [bad outcome] because [specific code path].

Why this matters:
[Security, privacy, data, money, reliability, or user impact.]

Test to add or update:
- Name: `[expected_user_behavior_test_name]`
- Assertions must prove: `[observable outcome, persisted state, external side effect, rendered UI, or API contract]`

Verification:
- Command: `[command run locally]`
- Current result: `[failure, reproduction, or static proof]`
- Expected after fix: `[passing behavior]`

Fix boundary:
[Smallest acceptable change and anything that should not be changed.]
```

## Suggestion Comment

```md
Suggestion: [behavior or test-quality title]

[One paragraph explaining the concrete risk or coverage gap.]

Test to add or update:
- Name: `[expected_user_behavior_test_name]`
- Assertions must prove: `[specific observable behavior]`

Verification:
- Checked locally with: `[command or static inspection]`
```

## Name-Only Test Comment

Use only when the test is otherwise solid.

```md
Suggested test name:

`[expected_user_behavior_test_name]`
```

## Code Suggestion

Only include a GitHub suggestion block when the exact replacement is small, local, safe, and verified against the surrounding hunk.

```suggestion
[replacement lines]
```

Before including a suggestion block, verify the replacement applies to the exact changed hunk and is syntactically plausible in the surrounding file. Do not include suggestion blocks for unrun, unformatted, or context-dependent patches; describe the fix boundary instead.

## Strong Test Callout

Use sparingly.

```md
Strong test: this test has a behavior-focused name, clear setup/action/assertion flow, and assertions that would fail if [specific user guarantee] regressed.
```

## Comment Quality Gate

Before posting or returning a comment, confirm:

- It is tied to a changed line or clear PR-scoped path.
- It names a user-visible failure, data/security risk, or concrete maintenance hazard.
- It includes local verification evidence or states why local verification is not possible.
- It suggests a behavior-focused test name when a test is missing or weak.
- It is not a style preference owned by formatter/linter.
