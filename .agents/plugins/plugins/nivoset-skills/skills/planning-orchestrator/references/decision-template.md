# Decision Template

Use this format for branches that affect ticket structure:

```md
Decision: [decision name]
Status: Resolved | Answered by codebase | Needs user decision | Requires spike
Codebase evidence:
- [file path and line when available]

Dependency impact:
- [which tickets or branches change because of this]

Question:
- [only include when unresolved]
```

Ask the user only when:

- the repository cannot answer the question
- multiple valid product behaviors remain
- the answer changes ticket structure or dependencies
- the answer changes acceptance tests
- the answer changes user-visible behavior, permissions, rollout, or non-functional quality bars
