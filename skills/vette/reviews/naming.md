# Naming Review

## Lane Id

`naming`

## Purpose

Apply deterministic naming lint: misleading identifiers, vague test names, unclear user-facing wording, or names that hide behavior.

## Topic Scope

Apply deterministic naming lint/rule checks only: misleading identifiers, vague test names, unclear user-facing wording, or names that hide behavior.

## When to Use

- Use when the diff introduces or renames functions, helpers, props, UI labels, aria text, or tests.
- Use alongside the `naming` and `test-name` skills in PR workflows.
- Do not use for structural maintainability critique unrelated to naming clarity.

## Core Rules

- Flag names that could mislead a person or agent during future review, repair, or test extension.
- Prefer concrete replacement suggestions when domain intent is clear from surrounding code.
- Downgrade pure style preferences to suggestions unless the name hides a defect risk.
- For test names, escalate when the name is so vague that future confusion is effectively certain (`works`, `handles errors`, `validates input`, or promises different coverage than assertions provide).
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

Look for:

- helpers that hide branching, such as `getPath` when edit vs view is conditional
- permission helpers that mask derived rules, such as `canRename` that is only `canEdit`
- vague test names that do not state the exercised behavior
- ambiguous button or dialog labels such as `OK` instead of `Rename` or `Confirm`
- long concatenated aria-labels that mix content identity with control hints
- branch, ticket, PR title, or body wording that disagrees with implementation
- identifiers that imply a guarantee the code does not provide

Attack vectors to emphasize:

- product copy mismatch
- weak assertion when the test name overpromises coverage
- maintainability risk hiding defects through misleading names

## Workflow

1. State resolved scope and changed paths.
2. Scan new or renamed identifiers, labels, test names, and user-facing strings in the diff.
3. Ask whether a future maintainer could misunderstand behavior from the name alone.
4. Provide a concrete replacement when possible.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`.

## Reporting

Return lane findings for parent merge. For PR workflows, substantive naming suggestions on changed lines should become inline `suggest` comments when posting is enabled.
