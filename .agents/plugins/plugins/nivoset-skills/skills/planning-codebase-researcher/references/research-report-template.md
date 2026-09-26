# Research Report Template

Use this structure for planning-oriented repository research:

```md
# Planning Research Report
## Scope investigated
- [resolved scope]

## Current behavior
- Location: [path:line-range when available]
  What it does:
  Why it matters:
  Reuse, rework, or risk:

## Reuse opportunities
- [existing modules, flows, or patterns worth building on]

## Gaps and required changes
- [missing behavior, unclear seams, or likely extension points]

## Dependencies and risks
- [coupling, sequencing, permissions, migrations, rollout, or resilience concerns]

## Existing tests and coverage gaps
- [tests that protect the current behavior and gaps that matter to planning]

## Open questions
- [only questions the repository cannot answer]
```

Compression rules:

- Prefer concise bullets over narrative.
- Keep only findings that affect planning, decomposition, or testability.
- Omit raw code unless a short snippet is essential to explain a constraint.
