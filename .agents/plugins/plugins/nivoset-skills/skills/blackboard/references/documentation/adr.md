# Decision records and ADRs

Every material decision on the board becomes a decision record (`decisions/dec-NNNN.yaml`, schema in the board contract). Architecturally significant decisions are also promoted to Markdown ADRs in the repository when the user approves. Both share the same content; the ADR is the human-facing projection.

## When a decision needs an ADR

Write one when the decision is hard to reverse, constrains future work, affects more than one team or container, changes a quality attribute (security, performance, availability, cost), or would make a future engineer ask "why on earth did they do this?". Skip trivial, local, easily reversed choices — record them on the board only.

## Format: MADR 4.0 with a Y-statement

```markdown
---
status: accepted            # proposed | accepted | rejected | deprecated | superseded by ADR-0012
date: 2026-10-15
decision-makers: [Brie]
consulted: [solution-architect, sre-reliability, finance-analyst]
informed: [support-lead]
serves: [obj-1, obj-2]
board: board-refunds v23
---

# ADR-0007: Retry payment-provider refunds asynchronously through a queue

**Y-statement.** In the context of customer refunds, facing payment-provider timeouts
that leave refunds in limbo, we decided for an idempotent queue-backed refund worker
and neglected synchronous retries and manual support handling, to achieve refunds
that complete without customer re-submission, accepting one new queue and worker
to operate.

## Context and problem statement
<2–5 sentences; cite board artifact IDs and evidence.>

## Decision drivers
- crit-reliability: refunds must complete without customer action
- crit-cost: no new paid infrastructure above $X/month
- …

## Considered options
1. Queue-backed worker with idempotency keys
2. Synchronous retries in the API request
3. Manual handling by support

## Decision outcome
Chosen option: "1. Queue-backed worker", because <ties to drivers>.

### Consequences
- Good: …
- Bad: …
- Neutral: …

### Confirmation
<How compliance is checked: test names, a fitness function, a dashboard, a review gate.>

## Pros and cons of the options
### Queue-backed worker
- Good, because …
- Bad, because …
### Synchronous retries
- …

## Stances
| Expert | Stance | Reason |
| --- | --- | --- |
| finance-analyst | disagree-and-commit | adds queue cost; acceptable under budget |
| sre-reliability | agree | removes timeout limbo |

## More information
Links: C4 container view, sequence diagram, Gherkin features, origin sidebar sb-004, superseded ADRs.
```

## Rules

- **Status reflects reality.** A record is `proposed` until the decider actually accepts it. Never mark an ADR `accepted` on the decider's behalf because the board converged.
- **Numbered and immutable.** ADRs are numbered monotonically and never edited to change the decision. Reverse or amend with a new ADR that `supersedes` the old one; update the old one's status line only.
- **Honest options.** At least two real options, including "do nothing" when plausible. An option list that exists only to make the winner look good is rejected by the verifier.
- **Stances recorded.** Each consulted expert's stance (`agree`, `disagree-and-commit`, `block`) with a reason. A `block` must be resolved by the decider before `accepted`.
- **One-way doors** require a contra-memo (the strongest case for the runner-up) linked under More information, and explicit decider sign-off.
- **Confirmation is concrete.** "We'll keep an eye on it" is not a confirmation.
- **Location.** Follow the repo's convention (`docs/adr/`, `doc/architecture/decisions/`, `adr/`). If none exists, propose `docs/adr/NNNN-kebab-title.md` and an index.

## Short form

For non-architectural decision records on the board, the Y-statement plus status, decider, stances, and confirmation is enough.

## Verifier checklist

- [ ] Title is a decision ("Use X for Y"), not a topic ("Database").
- [ ] Y-statement present with all six clauses.
- [ ] Context cites evidence and board IDs; drivers map to evaluation criteria.
- [ ] ≥2 genuine options with pros and cons.
- [ ] Consequences include the bad ones.
- [ ] Confirmation names a check someone can run.
- [ ] Stances recorded; no unresolved `block`.
- [ ] Supersession links correct in both directions.
