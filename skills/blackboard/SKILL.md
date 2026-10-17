---
name: blackboard
description: Use when a problem is uncertain, multi-step, cross-disciplinary, or hard to frame, including exploring ideas, reproducing failures, investigating complex scenarios, or shaping work into a plan.
---

# Blackboard

Refine an idea through an opportunistic blackboard process. Treat planning as an evolving conversation among specialists, not a fixed sequence of reviews. A contribution can expose a new opportunity, move attention to another level, revive an earlier question, or change which specialist should act next.

The goal is the smallest coherent, evidence-backed model of the idea that satisfies the agreed evaluation criteria. Consensus, activity, and ticket volume are not completion signals.

## Boundaries

Use this skill when the problem is uncertain, multi-step, disputed, cross-domain, or likely to improve through back-and-forth refinement. Valid outcomes include ideation, investigating a complicated scenario, reproducing a failure, comparing explanations, making a decision, and planning delivery. It is not limited to product strategy or ticket planning.

Do not use it for ordinary implementation, a bounded code review, or a request whose behavior and approach are already settled. Match the board method to the requested outcome; capability drafts, BDD, and tickets are optional downstream artifacts, not a required finish.

## Architecture

Maintain two linked boards:

- **Domain board** — the problem and emerging solution: goals, non-goals, observations, evidence, constraints, behaviors, hypotheses, alternatives, risks, dependencies, and partial plans.
- **Control board** — the reasoning process: current focus, triggered specialist opportunities, agenda, active investigations, resource bounds, strategy, stalls, and reasons for selecting the next action.

Preserve five functional planes across those boards:

- **knowledge** — observations, evidence, and computations relevant to the idea;
- **plan abstractions** — candidate patterns, strategies, and desirable properties that could shape a solution;
- **emerging plan** — the partial solution decisions currently being developed;
- **executive** — priorities, focus, eligible specialist activations, and scheduling decisions;
- **meta-plan** — problem framing, reasoning method, policies, and evaluation criteria.

The first three belong to the domain board; the last two belong to the control board. Organize domain artifacts across useful levels of abstraction rather than forcing a top-down hierarchy. At minimum distinguish:

- **outcomes** — what must become true and for whom;
- **designs** — candidate ways to understand or structure the idea;
- **behaviors** — observable flows, boundaries, failures, and recovery;
- **delivery** — capabilities, slices, dependencies, and validation.

Work may move in either direction. A delivery constraint can invalidate a model; a behavior can expose a missing outcome; evidence can revive a rejected alternative. Record these moves instead of smoothing them into a linear story.

Opportunistic does not mean random or hostile to structure. A top-down refinement pass is valid when the meta-plan selects it and it continues to produce useful deltas; it is one available strategy rather than the hard-coded workflow.

Specialists are knowledge sources. They have propose-only authority and communicate material claims through the board. The controller may schedule work, validate contributions, and maintain derived state; it may not settle material product, scope, compatibility, architecture, migration, or operational decisions that belong to the user or another named authority.

Read [references/board-contract.md](references/board-contract.md) before creating or resuming a persisted board. It defines the artifact types, contribution schema, agenda records, version handling, and readiness checks. Use [references/scenario-lab.md](references/scenario-lab.md) for ideation, failure reproduction, hypothesis testing, and complex-scenario mapping.

## Blackboard roster

Select specialists from current evidence and board needs; reconsider the roster after every material change. Delegate only to resolve a specific uncertainty or produce a needed artifact. Specialists propose; the controller validates and schedules but does not make decisions reserved for the user or another authority.

For persisted boards, use the role and dispatch contracts in [references/board-contract.md](references/board-contract.md). Starter rosters and domain overlays are examples, not a fixed team; select only roles whose triggers apply. For user-facing work, distinguish interface design from end-user advocacy, which covers accessibility, trust, agency, failure states, and recovery.

## Opportunistic control loop

Run cycles until a stop condition is met. Do not pre-commit to a phase pipeline or a fixed number of roles.

1. **Observe the delta.** Compare the current board with the prior version. Identify additions, revisions, contradictions, newly answerable questions, reopened items, and stale evidence.
2. **Generate opportunities.** Evaluate every registered or newly useful specialist trigger against that delta. When the delta changes a behavior, rule, setting, variant, boundary, or shared mechanism, trigger an implication sweep unless current evidence proves that no related case exists. Create a knowledge-source activation record for each plausible next contribution; do not dispatch it yet.
3. **Choose focus.** Select the activation most likely to reduce a material uncertainty, resolve a critical conflict, test a central hypothesis, or unblock downstream work. A small set may run in parallel only when scopes do not overlap or share an unresolved decision.
4. **Record control.** Write the selected focus, alternatives considered, evidence-backed priority signals, resource bound, and expected board change to the control board. Scores are signals, never decision authority or truth.
5. **Dispatch.** Announce the wave, then give each role the same current board version plus its trigger IDs, bounded question, evidence requirements, and contribution schema.
6. **Validate.** Reject or retry malformed contributions without filling gaps by inference. Check evidence, scope, authority, changed paths, and base version before merging.
7. **Apply as events.** Append valid contributions, preserve provenance and competing hypotheses, derive a new snapshot, and increment the board version. Never use last-writer-wins.
8. **React.** Let the new artifacts trigger the next cycle. A challenge should normally return to the original proposal for a response; that response may refine, split, defend, or retract it. Material disagreement opens a disagreement room rather than being averaged away.
9. **Reassess strategy.** If progress stalls, change the control approach: move up or down an abstraction level, switch between evidence-first and hypothesis-first work, invoke an adversarial role, split an island, or ask the user for the missing authority. Record why the strategy changed and whether it helped.
10. **Check stopping conditions.** Continue while a useful, authorized activation can materially improve the board. Stop only under the readiness, blocked, budget, or exhaustion rules below.

### Priority order

Prefer the next activation using this order, adjusted by current evidence:

1. correctness, safety, authorization, or irreversible-risk blocker;
2. contradiction affecting the central outcome or critical path;
3. question with high expected information gain;
4. work that unblocks several other artifacts;
5. cheap, reversible exploration that discriminates between live hypotheses;
6. completeness or polish.

Do not let an easy leaf displace a more important unresolved premise merely because it is easier to finish.

## Implication sweeps and balanced coverage

Treat material changes as possible members of a related case family. Check for affected siblings, shared invariants, consumers, dependencies, lifecycle states, and counterexamples using evidence from the repository, accepted behavior, or user intent. Consider known family members under the same relevant dimensions, but do not expand every family into a full cross-product; use shared evidence only when the common mechanism and boundaries are demonstrated.

Keep required correctness, safety, authorization, compatibility, and critical-path cases blocking until covered or explicitly removed by the proper authority. Record uncertain, deferred, duplicate, or not-applicable cases with evidence and an owner or rationale appropriate to the disposition. Product-impacting scope expansion requires user authority. Re-run the sweep when the family definition, shared mechanism, invariant, or affected boundary changes. For persisted boards, use the case and disposition schema in [references/board-contract.md](references/board-contract.md).

## Back-and-forth refinement

Contributions use explicit operations: `propose`, `support`, `challenge`, `refine`, `split`, `connect`, `answer`, or `retract`. Every operation targets stable artifact IDs and creates a new event. Revision preserves the earlier version and uses typed relationships such as `supports`, `challenges`, `responds-to`, `refines`, `depends-on`, `blocks`, `answers`, `derived-from`, `supersedes`, `duplicates`, `same-family-as`, `shares-invariant-with`, `can-regress`, or `counterexample-to`.

For a material challenge:

1. preserve the proposal and challenge as distinct artifacts;
2. ask whether new evidence can decide the issue;
3. give the proposer or an equivalent role a chance to respond to the strongest version of the challenge;
4. use a synthesis role only when it can preserve the actual tradeoff and provenance;
5. escalate value judgments or authority decisions to the user after answerable evidence questions are exhausted.

Rejection is memory, not deletion. Retain the rejected option, evidence, rationale, authority, and conditions that would justify reopening it.

## User participation

Treat a user correction, new constraint, answer, or reframing as an authoritative board event for their intent and decisions within scope, not as a reason to discard the earlier board. Mark affected artifacts contested, superseded, stale, or reopened; preserve the cause; then regenerate the agenda. A user decision does not rewrite contrary observed evidence; it records the chosen tradeoff with that evidence still visible.

Ask the user only after available evidence and specialist work cannot resolve a material issue. Show the live alternatives, strongest supported tradeoff, affected artifact IDs, and why the choice requires their authority. After the answer, update only the affected artifacts and resume the opportunistic loop. Do not restart the entire plan or treat an earlier readiness verdict as permanent.

## Parallel islands

Partition independent questions into bounded islands with their own scope, local focus, version base, and exit condition. Record shared invariants and explicit join points. An island-level blocker blocks only that island unless evidence shows it invalidates a shared invariant or the parent outcome.

Before merging an island, check its base version and shared invariants. Rebase or re-review stale work; do not silently apply it to a changed parent board. Run an integration review at each join point.

## Evidence and uncertainty

Separate observations, interpretations, and recommendations. Every material claim cites an evidence artifact or is marked `unverified`. External evidence records source, retrieval time, relevant version, and local verification status. Repository evidence uses stable paths plus symbols, lines, tests, commands, or commit identifiers as available.

Confidence and difficulty are diagnostic signals only. A material change to either must cite the board events that caused it. Increasing difficulty or falling confidence usually means new discovery and re-planning, not failure or automatic rollback.

Before asking the user, search current code, tests, schemas, feature files, decisions, research, and existing board artifacts. Bound the search. When no available source can answer safely, create a `human-required` question with an owner, affected IDs, why evidence is insufficient, and the exact re-entry condition.

Treat accepted decision records as constraints unless a newer authorized decision supersedes them. Draft decisions are hypotheses to challenge; rejected and superseded decisions remain historical evidence. If a decision conflicts with current code, tests, or a newer authority, preserve the precedence conflict and trigger investigation rather than choosing whichever source is most convenient.

## Stall, budget, and recovery

Treat repeated activations with no meaningful board delta, duplicate findings, circular challenges, or unchanged confidence as a stall. Record the stall and try one materially different control strategy. Do not spend the remaining budget paraphrasing the same position.

Every run has a bounded cycle, time, or cost budget. Reaching the bound never implies readiness. Persist the current snapshot, active agenda, blocked islands, and a precise resume trigger. Late contributions remain events but cannot replace current state without freshness validation.

On resume, verify authoritative sources, board version, open disagreements, decisions, and shared invariants before dispatching new work.

Blackboard state under `.tmp/planning/` is working state, not a repository deliverable. Never commit it. If the user requests a durable plan, project only the finalized, approved result into a user-approved repository location and record that promotion in the temporary board. If the temporary board has been cleaned, reconstruct it from authoritative inputs and report the lost continuity rather than pretending the prior state still exists.

## Readiness

`parent-ready` means the outcome, constraints, key behaviors, hypotheses, blocking questions, and related-case families are clear enough for downstream discovery; it does not mean the idea is finished. `final-ready` means the requested artifact is complete, material claims have evidence or authorized decisions, required implications are covered, and no blocking conflict or newly triggered review remains. Silence or budget exhaustion is not approval.

`blocked` identifies the affected artifact or island, owner, evidence, and re-entry condition; continue independent work where safe. A deferral records its owner, authority, rationale, expiry, and re-entry condition. Required correctness, safety, or authorization work remains blocking until resolved or removed by the proper authority.

Before readiness, check the full candidate artifact for new specialist triggers, unresolved material questions, and incomplete implication sweeps—not only changes since the last cycle. For persisted boards, use the readiness checklist in [references/board-contract.md](references/board-contract.md).

## Completion output

Return a concise projection, not a transcript: the requested outcome and behaviors; important hypotheses and their status; material evidence, decisions, risks, dependencies, coverage gaps, and unresolved questions; why processing stopped; and the verdict (`parent-ready`, `final-ready`, or `blocked`). Include capabilities, BDD, tickets, or dependency lanes only when requested. Do not claim work that did not run or turn an unresolved material choice into a recommendation.
