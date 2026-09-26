# Leaf Ticket Template

Use this structure for every leaf ticket:

```md
## Ticket: [plain outcome-oriented title]
Parent:
Goal:
User or stakeholder benefit:
Acceptance test:
Dependencies:
Useful code references:
- [path:line-range when available] Description: [why useful] Reuse/rework/risk: [note]
Suggested verification area:
Out of scope:
Assumptions or open questions:
```

Dependency format:

- `[ticket title]` because [specific reason]

Preferred verification areas:

- `UI`
- `API`
- `permissions`
- `data model`
- `background job`
- `notification`
- `integration`
- `import/export`
- `reporting`
- `migration`
- `observability`
- `resilience`
- `performance`
- `accessibility`
- `security`
