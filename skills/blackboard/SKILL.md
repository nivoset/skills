---
name: blackboard
description: Use when an ambiguous initiative, product idea, epic, or cross-cutting feature needs iterative refinement through multiple specialist perspectives before a stable plan can be produced.
---

# Blackboard

Refine an idea through an opportunistic blackboard process. Treat planning as an evolving conversation among specialists, not a fixed sequence of reviews. A contribution can expose a new opportunity, move attention to another level, revive an earlier question, or change which specialist should act next.

The goal is the smallest coherent, evidence-backed model of the idea that satisfies the agreed evaluation criteria. Consensus, activity, and ticket volume are not completion signals.

## Boundaries

Use this skill for work above a well-specified implementation ticket, especially when the problem is incomplete, disputed, cross-domain, or likely to improve through back-and-forth refinement.

Do not use it for ordinary implementation, a bounded code review, or a request whose behavior and approach are already settled. By default, refine the idea first. Produce capability drafts, BDD, or tickets only when the user requests them or the board is ready for that downstream artifact.

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

Read [references/board-contract.md](references/board-contract.md) before creating or resuming a persisted board. It defines the artifact types, contribution schema, agenda records, version handling, and readiness checks.

## Blackboard roster

Roles are dynamic. Select them from the current board state, then reconsider the roster after every material board change. Do not treat the initial roster as the team for the whole run.

Before each delegated wave, announce only the roles that will actually be dispatched:

```text
Blackboard roster — cycle <cycle-id>, board v<version>
- <stable-name> — <speciality>: triggered by <artifact IDs>; investigates <question>; returns <artifact types and evidence>.
```

Record the announcement and dispatch in `.tmp/planning/blackboard/<board-id>/dispatch.yaml`. Treat `.tmp/planning/` as the generic root for disposable planning state and verify `.tmp/` is gitignored before writing. Each dispatch includes the board version, triggering artifact IDs, bounded scope, question, authority, readable paths, prohibited mutations, handle, deadline, retry or fallback, and return contract. Use `planned` until a real handle exists and `dispatched` only afterward.

A role definition includes:

- an observable trigger condition;
- required inputs and evidence scope;
- the artifact types it may propose;
- completion and blocking conditions;
- expected cost or deadline and a fallback;
- `propose-only` authority unless the user explicitly grants more.

Examples of triggers include a disputed factual claim, missing user behavior, an untested assumption, conflicting constraints, a newly discovered dependency, a changed member of a related-case family, a shared invariant, a safety boundary, or two live approaches that need comparison. These are examples, not a permanent roster.

For user-facing work, treat end-user advocacy as distinct from interface design. UI/UX examines interaction structure; the advocate examines accessibility, trust, agency, confusing failure states, and recovery across every affected domain.

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

Treat a material change as a possible member of a larger case family, not as an isolated item. Run an implication sweep to discover sibling cases, shared invariants, consumers, dependents, lifecycle states, and counterexamples that are supported by the repository, domain model, accepted behavior, or user intent. Examples include other supported languages after a locale-setting change, other roles after an authorization change, or other state transitions after changing one transition. Examples guide discovery; they are not a universal checklist.

For every discovered case, record the triggering artifact, the concrete relationship, the authoritative source that establishes the family or invariant, and one disposition: `required`, `covered`, `research`, `deferred`, `not-applicable`, or `duplicate`. Use typed relationships such as `same-family-as`, `shares-invariant-with`, `depends-on`, `can-regress`, and `counterexample-to`. A plausible relationship without sufficient evidence is `research`, not an implied fact.

Balanced coverage means that every known family member is considered under the same relevant review dimensions and evidence standard. It does not mean spending equal effort on every member or expanding every family into a full cross-product. Shared evidence may cover an equivalence class when the common mechanism and boundaries are demonstrated. Sample representatives only when the sampling rule, equivalence evidence, and excluded boundary cases are recorded. Any exception between comparable members must cite evidence or an authorized product decision.

Control scope explicitly:

- `required` cases affect accepted outcomes, correctness, safety, authorization, compatibility, a shared invariant, or the critical verification path; they remain current and blocking until covered or removed from scope by the proper authority.
- `covered` cases cite current behavioral, repository, test, or decision evidence.
- `research` cases name the uncertainty, bounded investigation, owner, and answerability or exit condition.
- `deferred` cases are useful but not required for the current outcome and carry the normal owner, authority, expiry, rationale, and re-entry data.
- `not-applicable` cases cite why the apparently related member or review dimension does not apply.
- `duplicate` cases point to the canonical case and inherit no stronger disposition than it has.

Group duplicates and rank cases by acceptance relevance before activating work. Product-impacting scope expansion requires user authority. Do not hide required work as deferred, let a parking-lot list grow without ownership, or continue implication research after its bounded exit condition. Re-run the sweep whenever a refinement changes the family definition, shared mechanism, invariant, or affected boundaries.

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

`parent-ready` means the central outcome, non-goals, evaluation criteria, constraints, main user behaviors, live hypotheses, blocking questions, and material related-case families are explicit enough to begin downstream behavior discovery. It does not mean the idea is finished.

`final-ready` means the requested artifact has been produced; all material claims trace to current evidence or authorized decisions; every material implication sweep is balanced and closed; no blocking conflict, unknown, stale island, unresolved `required` or `research` case, or newly triggered required review remains; and a completeness cycle found no material omission. Silence and budget exhaustion are not approval.

`blocked` identifies the affected artifact or island, owner, evidence, and re-entry condition. Continue other useful islands unless the blocker invalidates the parent outcome or a shared invariant.

A deferral names its owner, authority, affected IDs, rationale, expiry, and re-entry condition. Required correctness, safety, or authorization work cannot be hidden by deferral; it remains blocking until resolved or explicitly removed from scope by the proper authority.

Before declaring readiness, ask all three:

- Can any currently triggered specialist materially change the conclusion?
- Did the latest changes create a specialist or review need that was not present in the initial roster?
- Does any material change lack an implication sweep whose known family members and relevant dimensions are accounted for without unexplained exceptions?

If any answer is yes, continue the loop.

For the final completeness cycle, evaluate all current trigger rules against the full candidate artifact, not merely the last delta. Include a missing-role scan for domains exposed after the initial roster and rerun implication sweeps against the final family definitions, invariants, and affected boundaries. Silence, an empty dispatch queue, or completion by the initially selected roles does not count as a clean cycle.

## Completion output

Return a concise projection of the board rather than a transcript:

- refined outcome, non-goals, and evaluation criteria;
- current model of the idea and its observable behaviors;
- accepted, contested, rejected, and deferred hypotheses with rationale;
- evidence, decisions, risks, dependencies, and unresolved questions;
- material related-case families, coverage balance, and any evidence-backed exceptions;
- important back-and-forth revisions and why the idea changed;
- capabilities, BDD, tickets, dependency lanes, and join points only when requested;
- control summary: cycles run, strategy shifts, blocked islands, and why processing stopped;
- verdict: `parent-ready`, `final-ready`, or `blocked`.

Do not claim that agents, commands, tests, or external research ran unless they actually did. Do not convert an unresolved material choice into a recommendation merely to make the board look complete.
