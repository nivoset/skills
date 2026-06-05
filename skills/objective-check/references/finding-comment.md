# Objective Check Finding Comment

Use this shape for tracker comments when objective-check finds missing evidence, ambiguous scope, dependency problems, or coverage gaps. Before posting, search for an existing objective-check finding with the same Scenario/AC and Problem; update it when possible instead of posting duplicates.

```markdown
## Objective check finding

Scenario/AC: <SCN-X / AC-Y / objective name>
Problem: <missing evidence / uncovered behavior / dependency conflict / ambiguous scope / sequencing issue>
Evidence: <ticket/code/test/feature-file/PR/reference>
Question or decision needed: <specific decision or refinement needed>
Run impact: <continue elsewhere / skip this leaf / stop affected branch / stop root run>
Suggested next action: <clarifying comment / new triage child ticket / split proposal / dependency update / explicit deferred note>
Status: <new finding / updated existing finding>
```

## Routing

- Comment on the most specific leaf when the issue affects one implementation slice.
- Comment on the parent when the issue affects behavior coverage, child decomposition, or multiple descendants.
- Comment on the root when the issue changes the overall feature contract or blocks the whole run.

## Tone

- Be concise and evidence-first.
- Do not blame the ticket author.
- Do not silently change scope.
- Do not require the current run to stop unless the root contract or dependency graph is blocked.
