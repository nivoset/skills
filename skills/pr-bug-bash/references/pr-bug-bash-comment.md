# PR Bug Bash Comment

Use this format for each verified PR bug-bash finding. Keep the comment concise enough to post on GitHub, but complete enough for a repair agent to execute without hidden context.

## Blocker With Verified Test

````md
Blocker: [behavior-focused title]

Requirement source:
[PR checklist item, Linear issue ID/title, acceptance criterion, API contract, or product copy that promises this behavior.]

Bug report:
- Summary: [one-line defect and impact]
- Steps to reproduce:
  1. [user or system action]
  2. [next action]
- Current behavior: [what happens on this branch]
- Expected behavior: [what should happen instead]
- Severity: [Critical / High / Medium / Low]
- Notes: [changed path, code path, logs, screenshots, or related ticket context]

Verification:
- Command: `[exact command]`
- Current result: [failing test name and failure reason]
- Expected after fix: [same test passes while preserving existing behavior]

Fix boundary:
[Smallest acceptable repair scope and anything that should not change.]

Generated failing test:

```[language]
[full verified test code]
```
````

## Suggestion With Verified Test

````md
Suggestion: [behavior-focused title]

[One short paragraph explaining the concrete risk and why the current PR does not satisfy the discovered requirement.]

Requirement source:
[PR, Linear, contract, test, or code evidence.]

Verification:
- Command: `[exact command]`
- Current result: [failing test name and failure reason]

Test to keep or adapt:

```[language]
[full verified test code]
```

Fix boundary:
[Smallest safe repair scope.]
````

## Static-Proof Fallback

Use this only when a failing test is impractical and the code evidence is decisive.

```md
Blocker: [behavior-focused title]

Requirement source:
[source of expected behavior]

Failure mode:
[Specific user action or system event] can [bad outcome] because [specific changed code path].

Verification:
- Static proof: [file:line evidence, contract mismatch, missing branch, or unreachable state]
- Test not generated because: [short reason]

Fix boundary:
[Smallest safe repair scope.]
```

## Quality Gate

Before returning or posting a comment, confirm:

- The finding is in source-vs-target scope.
- The requirement source is named.
- The generated test has a behavior-focused name.
- The failure was verified for the expected reason.
- The test code in the footer matches the code that was actually run.
- Temporary test files or edits were removed or explicitly accounted for.
- The comment does not reveal secrets, private tokens, or unrelated local paths.
