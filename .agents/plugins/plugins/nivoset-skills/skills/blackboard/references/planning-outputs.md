# Planning outputs

The plan is the deliverable the user acts on. Project it from the board: every step is a `plan-step` artifact that traces to objectives, questions or asks, decisions, and documents. Pick the template for the mode; chained modes produce one section per mode.

## Contents

- Step fields
- Investigation plan
- Decision plan
- Implementation plan
- Rendering rules
- Worked mini-example

## Step fields

| Field | What good looks like | Weak version to rewrite |
| --- | --- | --- |
| `id` | `S3` or `inv-3`, stable across revisions | — |
| objective / question | `obj-2 / q-2.1` | none: the step serves nothing |
| owner | `sre-reliability` or a named human; decider when the step decides | "team" |
| inputs | Specific evidence, documents, access, prior steps | "context" |
| actions | Ordered, concrete, startable by someone else | "investigate the issue" |
| outputs | Board artifacts and documents by standard and path | "notes" |
| exit criterion | Observable condition that ends the step | "when done" |
| redirect if | Result that changes the plan, and where it goes | missing on investigations |
| verification | How someone else checks the output | "looks right" |
| depends on | Step IDs | implicit ordering |
| effort | Fibonacci comparative signal (1, 2, 3, 5, 8, 13) | hours promised as fact |
| risks | What could go wrong and the mitigation | none |

Keep steps small enough that the exit criterion is checkable in one sitting or one PR. Split a step whose actions serve two objectives with different owners.

## Investigation plan

Use in `investigate` mode. Order by **information gain per unit cost**: cheap steps that can kill or confirm a central hypothesis come first. Every step names the hypothesis or question it discriminates and what each plausible result means.

```markdown
## Investigation plan — <mission>

### Hypotheses under test
| ID | Hypothesis | Evidence for | Evidence against | Status |
| --- | --- | --- | --- | --- |
| H1 | ... | ... | ... | live |

### Steps
#### inv-1 — <short name>  (obj-1 / q-1.1, H1 vs H2) · owner: evidence-researcher · effort 2
- Inputs: ...
- Actions:
  1. ...
  2. ...
- Outputs: finding artifacts with evidence IDs; updated hypothesis table
- Exit: <observable condition>
- Redirect if: <result> → skip to inv-4 / close H2 / escalate to user
- Verification: <how another person reproduces it>
- Depends on: —
- Risks: ...

### Decision points
- After inv-2: if <condition>, switch to `decide` mode with options A/B; otherwise continue inv-3.

### Stop conditions
- Objective success measures met, or budget <bound> reached (persist and report).
```

## Decision plan

Use in `decide` mode. The plan gets to a well-formed decision record and then hands off.

```markdown
## Decision plan — <decision question>

- Door: one-way | two-way · Decider: <name> · Consulted: <roles> · Informed: <roles>
- Evaluation criteria (weights only if the decider sets them): ...

### Options
| Option | Summary | Criteria scores with evidence | Owner of strongest case |
| --- | --- | --- | --- |

### Steps
#### dec-1 — Independent assessments  · owners: <3–5 experts> · effort 3
- Actions: each expert assesses every option against the criteria without seeing the others; cites evidence.
- Exit: one assessment per expert per option on the board.
#### dec-2 — Targeted critique / sidebars
- Actions: open a disagreement sidebar only where assessments conflict on facts.
- Exit: every conflict harvested.
#### dec-3 — Contra-memo (one-way doors only)
- Owner: strongest dissenter. Output: the full case for the leading alternative.
#### dec-4 — Decision record
- Owner: facilitator drafts; decider accepts. Output: decision record with Y-statement, stances, confirmation check.
#### dec-5 — Follow-on
- Implementation or validation steps that the decision triggers, with owners.
```

## Implementation plan

Use in `implement` mode. The central artifact is the validation plan: every objective/ask maps to at least one observable check, and every step maps back to an objective. Reach a first end-to-end validated slice before breadth.

```markdown
## Implementation plan — <outcome>

### Validation plan
| Ask / objective | Acceptance check | Method | Layer | Runs in | Evidence when done | Status |
| --- | --- | --- | --- | --- | --- | --- |
| obj-2 | Denied role sees an explanation and no data | features/access.feature scenario "…" + integration test | backend, UI | PR pipeline | test IDs | planned |

### Documentation set
| Document | Standard | Owner | Serves |
| --- | --- | --- | --- |
| features/access.feature | Gherkin | requirements-analyst | obj-2 |
| docs/adr/0007-*.md | MADR + Y | solution-architect | dec-0007 |
| docs/architecture/c4-container.mmd | C4 (Mermaid) | solution-architect | obj-1 |

### Steps
#### impl-1 — Walking skeleton  (obj-1, obj-2) · owner: <role> · effort 5
- Inputs: ...
- Actions:
  1. ...
- Outputs: ...
- Exit: first scenario of features/access.feature passes end to end in CI
- Verification: CI run link; reviewer re-runs locally
- Depends on: —
- Risks: ...

### Lanes and join points
- Lane A (backend) impl-2, impl-3 · Lane B (UI) impl-4 · Join at impl-5: integration review against shared invariants.

### Release and rollback
- Stages, proceed/hold/abort gates, rollback steps, owner.
```

When the user asks for tickets, project each step into one ticket with the same fields; don't invent work that has no step.

## Rendering rules

- Lead with the mission, objective tree, and verdict; the steps follow.
- Use tables for hypotheses, options, validation, and documents; use numbered actions inside steps.
- Show the critical path explicitly (e.g. `inv-1 → inv-2 → dec-4 → impl-1`).
- Mark steps that need human authority with the decider's name.
- Keep the plan honest: unresolved questions appear as steps with exit criteria, not as hidden assumptions.

## Worked mini-example

Mission: "Decide whether to move nightly batch reports to streaming." Mode `investigate → decide`.

- `inv-1` (data-analyst, effort 2): measure which reports users open within an hour of generation. Exit: usage table for all 14 reports. Redirect if fewer than 2 reports are time-sensitive → recommend closing as non-goal.
- `inv-2` (solution-architect, effort 3): map current pipeline as a C4 container view and list coupling points. Exit: diagram reviewed by sre-reliability.
- `dec-1..4`: options "status quo", "stream the 3 time-sensitive reports", "full streaming"; finance-analyst owns cost, sre-reliability owns operability; decision record dec-0003 with Y-statement and stances.
- `impl-1` (follow-on, only if streaming wins): walking skeleton for one report with a Gherkin freshness scenario.
