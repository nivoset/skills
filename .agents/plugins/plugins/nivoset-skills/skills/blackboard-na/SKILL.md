---
name: blackboard-na
description: Compact multilingual Blackboard refinement for ambiguous initiatives, epics, cross-domain product ideas, and disputed plans; dynamically coordinates evidence-backed specialist proposals until the proper authority can approve a stable outcome.
---

# Blackboard-NA | Le tábla compact

An experimental **English-order + Hungarian-concept + French-linking** rendering of Blackboard. Grammar is notation, not a new authority model. **All code identifiers, status values, types, paths, templates, and contracts stay literal English**; never translate them in machine data. In these instructions: `tábla`=board; `szerep`=role; `cél`=goal; `bizonyíték`=evidence; `kérdés`=question; `döntés`=decision; `változás`=delta; `határ`=boundary. French `le/la/les`, `avec`, `dans`, `pour`, `sans` link these ideas.

**Cél.** Refine an incomplete, disputed, cross-domain initiative via opportunistic specialist conversation, **not** a fixed phase/roster. Seek the *smallest coherent evidence-backed model* meeting the evaluation criteria. Consensus, activity and ticket count ≠ readiness. Use above well-specified tickets; **not** routine implementation, bounded review, or settled work. First refine; generate capabilities/BDD/tickets only on request or when ready.

## 1. Les tábla & niveaux

Keep **two linked boards**, across five functional planes:

| Tábla | Plane | Stores |
|---|---|---|
| domain | `knowledge` | observation, computation, evidence |
| domain | `plan-abstractions` | strategies, patterns, desired properties |
| domain | `emerging-plan` | partial solution, decisions in development |
| control | `executive` | agenda, focus, activation, scheduling, budgets |
| control | `meta-plan` | framing, reasoning method, policy, evaluation |

Each domain item has level `outcomes` (what/whom), `designs` (candidate models), `behaviors` (flows, failures, recovery), or `delivery` (capabilities, slices, dependencies, validation). Le raisonnement goes **up/down/across** levels: evidence or a delivery constraint may invalidate an outcome/design and reopen an option. Record moves, don't fabricate a linear story. A top-down pass is one optional recorded meta-strategy, not a pipeline.

Le controller selects activations, validates, merges events, keeps derived state. Les `szerep` are **knowledge sources, propose-only**, unless the user explicitly grants more. Neither a specialist nor controller decides material product, scope, compatibility, architecture, migration or operational choices reserved for the user/named authority.

Read [the board contract](references/board-contract.md) **before** creating/resuming persistent state: schema, events, version checks, readiness and dispatch are normative. Consult [role examples](examples/README.md) as **optional triggers**, never a permanent roster.

## 2. Les szerep: déclenchement, cél, dispatch

Choose/re-choose roles from *current board state after every material változás*. Triggers: disputed fact, missing behavior, untested assumption, incompatible constraints, dependency, related-case member/invariant, safety/authorization határ, rival hypotheses. Add specialized roles only when a board-observable trigger holds. An end-user advocate is **distinct** from UI/UX: accessibility, trust, agency, failure/recovery across domains versus interface structure.

Each role definition must specify: **one observable definitive cél**, trigger, bounded scope, required inputs/evidence, allowable proposed artifact types, pass/block conditions, finite budget/deadline plus fallback, and authority (`propose-only` by default). “Review security” is an activity, not a cél; “identify affected trust boundaries and evidence-backed risk dispositions” is testable. Return `passed` **only if** cél met; otherwise `blocked` with unmet parts and re-entry conditions. For overlays, reuse shared roles; never dispatch duplicate specializations.

**Before each real delegated wave**, announce only actually selected roles:

```text
Blackboard roster — cycle <cycle-id>, board v<version>
- <stable-name> — <speciality>: goal <definitive observable outcome>; triggered by <artifact IDs>; investigates <question>; returns <artifact types and evidence>.
```

Record announcement and work in `.tmp/planning/blackboard/<board-id>/dispatch.yaml`. Each dispatch records: base board version, trigger IDs, bounded question/scope, authority, evidence inputs, readable paths, forbidden mutations, handle, deadline, retry/fallback, return contract. State `planned` until a **real** handle exists; then `dispatched`. Give delegates identical current board version. Validate results before applying; specialist outputs are proposals, not direct writes.

## 3. Le contrôle opportuniste: boucle

Repeat **while a useful authorized activation can change the board**, not by fixed number of specialists/phases:

1. **Observe** le `változás`: diff prior/current board; new/revised/challenged items, reopened/answerable kérdés, stale evidence.
2. **Activate candidates**: test every known/new useful role trigger. For changed behavior, rule, setting, variant, határ, or shared mechanism, trigger an *implication sweep* unless current evidence proves no related case. Record plausible knowledge-source activations; **do not dispatch yet**.
3. **Choose** le focus with highest material uncertainty reduction, critical contradiction/hypothesis test, or downstream unblock. Parallelize only independent scopes without unresolved shared choices.
4. **Record control**: selected opportunity, alternatives, evidence-based signals, cost/time bounds, predicted board change. Scores inform priority, **never** authority or truth.
5. **Dispatch** with the roster announcement and versioned bounded assignments.
6. **Validate** schema, claims/bizonyíték, scope, authority, changed paths, version. Reject/retry malformed returns; **never infer missing fields**.
7. **Apply events** append-only with provenance and rival hypotheses; derive new snapshot, increment version; **no last-writer-wins**.
8. **React** to all new triggers. Challenge normally goes back to proposer for response; keep material disagreement in a disagreement room.
9. **Replan** after a stall: move levels, evidence-first ↔ hypothesis-first, adversarial role, split island, or ask named authority. Record why/impact.
10. **Stop check**: `parent-ready`, `final-ready`, `blocked`, finite-budget exhaustion or no beneficial authorized opportunity, **under the readiness rules below**. Neither exhausted budget nor silence is approval.

Priority: (1) correctness/safety/authority/irreversible harm; (2) central contradiction/critical path; (3) information gain; (4) multi-artifact unblock; (5) cheap reversible hypothesis discrimination; (6) polish. An easy leaf must not displace a critical premise.

## 4. Familles / kapcsolatok: implication sweep

Le material változás may affect sibling cases, family members, shared invariants, consumers, dependencies, lifecycle states or counterexamples. Discover only with actual repo/domain/accepted-behavior/user-intent evidence; examples do **not** impose a universal matrix.

For each related case record: **triggering ID**, typed relationship, authoritative family/invariant source, relevant review dimensions, and disposition. Typical links: `same-family-as`, `shares-invariant-with`, `depends-on`, `can-regress`, `counterexample-to`. Unsupported plausible relation ⇒ `research`, **not** fact.

| Disposition | Required semantics |
|---|---|
| `required` | Accepted outcome, correctness, safety, authorization, compatibility, invariant, critical verification; blocks until covered or properly descoped |
| `covered` | Current behavior/repo/test/authorized-decision evidence |
| `research` | Uncertainty, finite investigation, owner, answerability/exit |
| `deferred` | Nonessential now; owner, authority, expiry, rationale, affected IDs, re-entry |
| `not-applicable` | Evidence-backed reason member/dimension excluded |
| `duplicate` | Canonical case link; no stronger status than canonical |

**Balanced** = all known family members considered under comparable dimensions/evidence standard; **not** equal work or full Cartesian product. Share equivalence-class evidence only after proving common mechanism/boundaries; sampling records rule, equivalence, excluded edge cases. Exceptions require evidence or authorized product decision. Deduplicate, rank by acceptance impact, bound searches. Product-impacting expansion requires user authority; never relabel a blocker as deferred or accumulate ownerless parking-lot items. Re-sweep when membership, invariant, mechanism or affected boundaries change.

## 5. Le débat / döntés

Specialists use explicit operations: `propose`, `support`, `challenge`, `refine`, `split`, `connect`, `answer`, `retract`. Each targets stable artifact IDs and adds an event. Preserve old revisions, evidence, rationales, provenance and typed relations: `supports`, `challenges`, `responds-to`, `refines`, `depends-on`, `blocks`, `answers`, `derived-from`, `supersedes`, `duplicates`, plus case-family relations.

On material challenge: preserve **both** sides; seek deciding evidence; invite original proposer/equivalent to answer **strongest** objection (refine/split/defend/retract); synthesize only without erasing tradeoff/provenance; escalate irreducible value/authority choices to user. Rejection ≠ deletion: keep evidence, rationale, rejecting authority, reopen condition.

A user correction/constraint/reframe/decision is an **authoritative event about user intent** within authority, not board reset and not evidence erasure. Mark affected records contested/superseded/stale/reopened; regen agenda and continue. Ask user **only** after bounded available code/test/schema/feature/decision/research/board evidence and specialist work cannot decide. Show alternatives, strongest supported tradeoffs, affected IDs, and authority need. Record answer on affected items only.

## 6. Les îles parallèles

Partition independent kérdés into bounded islands: scope, base version, local focus, shared invariants, join point, exit. Island blocker stays local unless shared invariant/parent outcome fails. Before join validate base version + invariants; rebase/re-review stale work, integration review at every join. **Never** silently merge stale or conflicting proposals.

## 7. La bizonyíték & incertitude

Distinguish **observation / interpretation / recommendation**. Each material claim cites evidence or `unverified`. External proof: source, retrieval time, version, local verification. Repo proof: stable path plus symbol/line/test/command/commit if available. Confidence/difficulty are signals only; changes cite causative events. New difficulty/confidence loss prompts discovery/replan, not automatic rollback.

Before human escalation, bounded-search actual code, tests, schemas, feature files, decisions, research, board. If unanswerable safely, emit `human-required` with owner, affected IDs, insufficiency and exact re-entry. Accepted decisions constrain unless superseded by **newer authorized** döntés; drafts remain hypotheses; rejected/superseded remain history. If current code/tests conflict with a decision/authority, preserve precedence conflict and investigate, **never pick convenient evidence**.

## 8. Stall / budget / reprise

Stall = repeated activation without meaningful delta, duplicates, circular challenges or static confidence. Record it; try **one materially different strategy**, don't consume budget on paraphrase. Bound every run by cycles/time/cost. On bound: persist versioned snapshot, agenda, blocked islands and exact resume trigger; **not ready by default**. Late work needs freshness validation before apply. On restart verify authoritative inputs, version, disagreements, accepted decisions, invariants before dispatch.

Use `.tmp/planning/blackboard/<board-id>/` for ephemeral board only. Verify `.tmp/` is gitignored **before writing**; otherwise fix temp-root policy or gain approval for safe alternate path. Never commit temp files. No empty placeholders. Controller is **sole board writer**; specialists return versioned proposed events; events immutable. If user requests a durable artifact, project **only** the accepted/approved output to user-approved permanent location and record promotion (source version + destination). If temp state vanished, reconstruct from authoritative inputs and disclose lost continuity.

## 9. Prêt? Readiness contract

- `parent-ready`: central outcome, non-goals, criteria, constraints, main user behaviors, hypotheses, blocking kérdés and material case families explicit enough for downstream behavior discovery. **Not** finished.
- `final-ready`: requested artifact exists; material claims traced to current evidence/authorized decisions; all material implication sweeps balanced and closed; **no** blocking conflict, unknown, stale island, unresolved `required`/`research` case, or newly triggered mandatory review; final completeness cycle found **no material omission**.
- `blocked`: identify affected artifact/island, owner, evidence, re-entry; continue independent islands unless parent/shared invariant invalid.
- Deferral must record owner, authority, affected IDs, rationale, expiry, re-entry; required safety/correctness/authorization stays blocking until resolved or authorized descoping.

Before readiness ask **all**: (a) Can any currently triggered specialist materially alter verdict? (b) Did recent changes expose a role/review absent from first roster? (c) Does any material change lack a balanced implication sweep? Any **yes** ⇒ continue. Final completeness cycle tests **all triggers against whole candidate**, not just latest delta; scan missing roles/domains; resweep final families/invariants/boundaries. Empty queue, silence, initial roster completion and exhausted budget ≠ clean cycle.

## 10. Projection finale

Present concise board projection, **not transcript**: refined outcome/non-goals/criteria; idea model and observable behaviors; accepted/contested/rejected/deferred hypotheses + reasons; evidence, decisions, risks, dependencies, questions; case-family balance/exceptions; important revisions and why; capabilities/BDD/tickets/lanes/joins **only when requested**; control cycles, strategy shifts, blocked islands and stopping reason; exact verdict `parent-ready` / `final-ready` / `blocked`.

**Integrity:** Never claim agents/tools/tests/research ran unless run. Never disguise undecided authority choices as recommendations just to declare readiness. Machine-readable schema and safety/authority rules in [the contract](references/board-contract.md) override linguistic abbreviation.
