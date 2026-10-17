# Process roles

Process roles run the board. They are never counted in the 3–5 active experts, and they never make domain claims of their own. The controller usually plays facilitator, curator, and stopper; the verifier should be an agent that did not produce the work it checks; the decider is the user unless they delegate.

## facilitator

- **Goal:** each cycle's focus is the activation with the highest expected value, the active panel stays within 3–5, and every expert gets a turn proportional to the triggers it owns.
- **Does:** observes the delta, generates activation records, requests response frames or posts open requests for volunteers, selects the wave, dispatches with a bounded brief, runs fan-out-then-converge, opens sidebars for real conflicts, drafts decision records, maintains the coverage matrix and contribution ledger, recruits and benches.
- **Must not:** settle material decisions, invent evidence, average disagreements away, or let one expert dominate turns.
- **Brief template for a dispatch:**

```text
You are <role-id> on blackboard <board-id>, board version <v>, mode <mode>.
Goal for this activation: <definitive observable outcome>.
Trigger: <artifact IDs and why>.
Question: <bounded question>.
Objectives served: <obj IDs>. Tradeoff axis you own: <criterion>.
Read: <paths/artifacts>. Do not modify: <paths>. Bound: <time/attempts>.
Documents expected: <standard + path under documents/>.
Assess independently; you have not been shown other experts' drafts.
Return the contribution contract (YAML) with evidence; mark unsupported claims unverified.
```

## curator

- **Goal:** experts receive a board view that contains everything relevant to their activation and nothing redundant, and the human summary of each cycle fits on one screen.
- **Does:** dedupes and merges equivalent artifacts (via `duplicates` relations), builds per-activation views, writes cycle notes, keeps the decision index and document index current, flags stale artifacts.
- **Must not:** delete events or change meaning; pruning affects views, never storage.

## verifier

- **Goal:** every contribution and document accepted onto the board meets its role goal, its evidence rules, and its documentation standard checklist, with each failure returned as a specific finding.
- **Does:** checks return schema, evidence existence and freshness, traceability links, documentation checklists (see `references/documentation/`), whether `passed` contributions actually met their goal, and whether plan steps have checkable exit criteria.
- **Independence:** use a separate agent from the producer for one-way-door decisions, final-ready checks, and any high-stakes document.
- **Returns:** `support` or `challenge` operations with per-checklist findings.

## decider

- **Goal:** each material decision has exactly one accepting authority who chose with the evidence and dissent visible.
- **Played by:** the user by default. They may delegate classes of two-way-door decisions to the facilitator; record the delegation as an event.
- **Receives:** the decision record draft with options, Y-statement, stances, contra-memo (one-way doors), and the confirmation check.

## stopper

- **Goal:** the run stops exactly when readiness, blocked, budget, round-cap, or stall rules say so, and the stop reason is recorded.
- **Does:** enforces the round cap (default 4 waves per question), detects stalls (no-delta activations, circular challenges, duplicate findings), runs the readiness questions and the final completeness cycle, and checks sidebars and the parking lot before any readiness verdict.
