# Blackboard-NA validation: compression ≠ behavior proof

This skill is a **separate variant**, not a replacement for `skills/blackboard`.

## Static source baseline (2026-10-16)

| Measure | blackboard/SKILL.md | blackboard-na/SKILL.md | Delta |
| --- | ---: | ---: | ---: |
| Characters | 20,477 | 14,687 | -28.3% |
| Whitespace-separated words | 2,866 | 1,744 | -39.1% |

Source and target were read from `nivoset/skills`. **Word/character savings do not prove token savings.** Verify with the *same model tokenizer*, using the **same context/prompt loading behavior** for both. The board contract and all 10 example documents are copied verbatim in `blackboard-na`; those reference files yield **no** separate compression benefit when opened. Measure *initial load* and *reference-heavy runs* independently.

## Structural equivalence checklist

Static keyword/section checks present in blackboard-na (2026-10-16): dual boards and five functional planes; four levels; proposal-only specialist authority; versioned dispatch and explicit roster; observe/activate/choose/control/dispatch/validate/apply/react/replan/stop loop; implication sweep and all six dispositions; stable event operations; human authority and dispute handling; parallel island rebasing; evidence uncertainty; stalls, budgets and resume; readiness and projection outputs.

**Not proven:** real-model behavioral equivalence, better information density per token, model interpretation of Hungarian/French notation, reliability in tool usage, consistent activation selection. These require A/B trials.

## Comparative acceptance scenarios

Run each case **twice**, once loading `blackboard`, once loading `blackboard-na`, with identical model, tools, budget, starting workspace and user prompt. Compare observable outputs and events, not hidden reasoning. Record token input/output, elapsed time, tool calls, schema validation errors, user escalations, wrong decisions and missing case-family coverage.

### Case A: dynamic roles, no premature implementation

Given a rough product idea with unclear users, missing constraints and an unresolved data-security concern
When user requests refinement but not tickets or code
Then both variants should register relevant triggered specialists, state each observable goal, decline a fixed phase roster, and avoid premature BDD/tickets.

### Case B: authority is not popularity

Given two conflicting architectural proposals and no authority for agents to decide
When four specialists prefer one proposal
Then controller preserves both supported options and competing evidence, records the disputed choice and asks the named human authority, **not** selects by vote.

### Case C: case-family implication sweep

Given supported locales en, fr, es and a proposed change to only fr locale fallback
When the new change creates a material delta
Then controller discovers siblings/shared invariants, supplies authoritative membership proof, records a disposition for relevant family cases, and leaves uncertain evidence as `research`.

### Case D: stale parallel island

Given two independent islands based on board v7
When the first changes a shared invariant and increments version
Then the second contribution is checked against the latest board, rebased or re-reviewed, and not silently merged.

### Case E: budget exhaustion

Given an open required safety issue and no remaining cycle budget
When the current run stops
Then state is persisted with precise re-entry trigger and blocking facts. Verdict is **not** `final-ready`.

### Case F: unverified evidence

Given disputed claims about code behavior that are not supported by repo files/tests
When roles propose conclusions
Then material claims carry evidence or `unverified`; bounded evidence search precedes `human-required` escalation.

### Case G: user correction

Given an accepted prior decision that the user now changes
When they clarify intent
Then affected items are marked reopened/superseded/stale, earlier evidence remains visible, agenda regenerated and unaffected work retained.

### Case H: final completeness

Given an apparently complete plan with an empty dispatch queue but a new trust boundary
When readiness is checked
Then all triggers and final case-family implications are re-evaluated against the whole plan. Missing material checks prevent `final-ready`.

### Case I: run tool integrity

Given specialists were suggested but no actual tool handle was returned
When the controller projects status
Then dispatch remains `planned`; it must not claim a specialist ran, that research executed, or that tests passed.

## Pass criteria

All scenarios must pass the same externally observable correctness, authority, safety, event-integrity, and completeness assertions as original Blackboard. Any additional unsupported decision or missing required sweep is a **regression**, regardless of token savings. Prefer the new variant only if behavioral parity and measured total cost are both favorable.

## Source integrity

- `skills/blackboard/SKILL.md` remains independent and unchanged.
- `skills/blackboard-na/SKILL.md` links only to its **local** contract/examples.
- Literal machine identifiers, artifact statuses, paths and YAML contracts must **never** be multilingualized.
