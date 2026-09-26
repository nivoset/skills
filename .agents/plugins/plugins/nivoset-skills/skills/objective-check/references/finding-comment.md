# Objective Check Finding Comment

Use this shape for tracker comments when objective-check finds missing evidence, ambiguous scope, dependency problems, or coverage gaps. Before posting, search for an existing objective-check finding with the stable marker; update the agent-owned comment when possible instead of posting duplicates. Do not comment solely because a ticket is triage/review-needed.

```markdown
## Objective check finding
<!-- agent:objective-check-finding v1 -->

Status: <needs-revision / blocked / needs-revision+blocked / informational>
Scenario/AC: <SCN-X / AC-Y / objective name>
Problem: <missing evidence / uncovered behavior / dependency conflict / ambiguous scope / sequencing issue>
Evidence: <ticket/code/test/feature-file/PR/reference>
Question or decision needed: <specific decision or refinement needed>
Run impact: <continue elsewhere / skip this leaf / stop affected branch / stop root run>
Refinement priority: <priority/order when manual refinement is needed>
Suggested next action: <clarifying comment / new triage child ticket / split proposal / dependency update / explicit deferred note>
Last checked: <ISO timestamp>
Comment state: <new finding / updated existing finding>
```

## Routing

- Comment on the most specific leaf when the issue affects one implementation slice.
- Comment on the parent when the issue affects behavior coverage, child decomposition, or multiple descendants.
- Comment on the root when the issue changes the overall feature contract or blocks the whole run.
- For Linear, prefer discovered existing `NeedsRevision` / `Blocked` equivalents when manual planning/refinement or blocking status is needed; do not create new labels by default.

## Tone

- Be concise and evidence-first.
- Do not blame the ticket author.
- Do not silently change scope.
- Do not require the current run to stop unless the root contract or dependency graph is blocked.
- Keep resolved historical findings under a `Resolved` subsection instead of deleting evidence.
