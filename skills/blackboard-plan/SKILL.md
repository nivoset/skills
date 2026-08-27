---
name: blackboard-plan
description: Refine an initiative, epic, or feature through a dynamic-role blackboard loop and produce capability-level and feature-level ticket drafts with dependencies and parallel work lanes.
---

# Blackboard Plan

Use this skill when the user wants to refine or plan work above implementation-ticket level.

## Inputs

- parent statement and desired outcome;
- relevant feature files, plans, decisions, and repository evidence;
- prior blackboard state, if any;
- planning constraints and required review domains.

## Operating definitions

- **Parent readiness** means scope, non-goals, claims, evidence, and blocking questions are recorded; it does not authorize downstream drafting when required evidence is missing.
- **Final readiness** means the post-draft completeness pass is complete, required reviews have evidence-backed results, and no unresolved blocker lacks an authorized answer or reversible deferral.
- **Required** means explicitly marked by the parent, a referenced contract, or a selected review domain; never infer it from role confidence.
- **Stable ID** means an ID retained when an item is edited, merged, or revisited. Collisions are preserved as conflicts, not silently renamed.
- **Authorized decision** means a human decision or accepted record with an identifiable owner, timestamp, scope, and approval artifact.

## Procedure

1. Load and normalize the parent into observable claims.
2. Preserve evidence separately from interpretation and recommendation.
3. Identify gaps, risks, dependencies, duplicate concepts, and human questions.
4. Select the smallest role set that covers every explicitly required review domain and every material risk; record the selection rationale.
5. Reuse a retained role session only when its scope and evidence are current; otherwise start or assign a replacement session. Send each role the new board text and assigned questions.
6. Merge only schema-valid contributions by stable IDs; preserve collisions and contradictory contributions as conflicts.
7. Open a disagreement room when independently cited evidence materially conflicts on scope, behavior, authorization, or safety. Record an owner, affected IDs, and closure condition.
8. Clean only when semantic equivalence, traceability, reversibility, and reviewer approval are evidenced; otherwise preserve the original item and flag it.
9. Select the smallest useful next planning action that reduces a readiness blocker or advances the critical path.
10. Produce capability/feature ticket drafts, dependency graph, parallel lanes, join points, and critical path; do not produce implementation tickets unless explicitly requested.
11. If parent readiness is satisfied, continue through drafting and the post-draft completeness pass before declaring final readiness; otherwise report blockers and escalate only decisions requiring human authority.

## Required output

Return these sections in this order:

- resolved parent scope and non-goals;
- claims, evidence, gaps, decisions, and unresolved questions;
- selected roles and why they were selected;
- capability/feature hierarchy;
- ticket drafts with acceptance behavior;
- dependency and parallelization plan;
- assumptions, deferred work, and re-entry conditions;
- readiness verdict, explicitly labeled `parent-ready`, `blocked`, or `final-ready`.

Every blocker or unresolved question includes an owner, affected stable IDs, cited evidence, and re-entry condition. A deferred item additionally includes its expiry and approval artifact.

## Guardrails

If a product rule is absent from authoritative evidence, do not infer it; record `@human-required` or defer the affected scope. Select roles from required-domain coverage and material risk, never popularity or confidence. If scopes or security contexts differ, keep them separate and open a documented disagreement or human-decision item. Capability/feature tickets are in scope; implementation tickets require explicit authorization.

Role authority is propose-only: roles may add evidence, claims, questions, and recommendations, but may not approve, waive, close, or mutate authoritative state. Escalation does not clear a blocker. A blocker clears only through an authorized decision or an explicitly recorded, reversible deferral with owner, scope, expiry, and re-entry condition.

See:

- `docs/blackboard-planning-method.md`
- `docs/blackboard-dynamic-roles-runtimes.md`
- `plan/features/blackboard-*.feature`


## Python API

This skill is Python-backed. Use the persistent kernel directly:

```python
import blackboard_plan
plan = await blackboard_plan(problem_text, max_roles=5)
```

The package provides `analyze_roles`, `build_iteration_brief`, `merge_contributions`, and `readiness_check`. It keeps role authority propose-only, preserves conflicting evidence, and blocks readiness when required claims, questions, disagreement rooms, or reviews remain unresolved. Treat unavailable tooling, malformed contributions, and stale sessions as blockers until the documented retry, replacement, or human-decision path succeeds.


## End-user advocate

The `end-user-advocacy` expert is distinct from UI/UX. Select it when the scope affects user-facing behavior, accessibility, trust, agency, confusing failure states, or recovery; when selected, it reviews each affected domain. UI/UX owns interaction design; the end-user advocate owns user-impact scrutiny.

## Phase 2 BDD output

After parent-level readiness, convert claims and expert obligations into nested Gherkin under `plan/features/blackboard/`. See `README.md` and `TAGGING.md` there for the capability folders and tag contract.


## Post-draft completeness pass

After capability or Gherkin drafts exist, do not treat drafting as completion. Run a dedicated completeness iteration that asks every participating expert individually: **What is missing, incorrect, unsafe, or insufficiently evidenced in the current draft?**

Each expert reviews the full draft against its own owned sections and explicitly returns:

- missing scenarios or obligations;
- incorrect assumptions;
- cross-domain impacts;
- missing negative, boundary, duplicate, stale, recovery, or authorization cases;
- evidence or approval still required;
- whether the finding is blocking or non-blocking.

The orchestrator merges findings by stable IDs, preserves dissent, adds accepted missing work to the board, and runs another readiness check. A draft is not final-ready until every participating expert has either identified actionable additions or explicitly returned `no_missing_items` with evidence and scope. If an expert fails to respond within the configured review window, mark the review blocked rather than treating silence as approval.


## Evidence and human-question loop

Before asking the human, inspect current code/tests, feature files, schemas, architecture and research documents, decision history, and specialist reports. Cite stable paths and line ranges or document sections for every resolved claim; record unavailable or line-unstable sources with their identifier and limitation. Repeat the evidence loop until no question can be answered from the available authoritative sources. Use the configured attempt/time bound to avoid an unbounded loop.

Questions that cannot be answered safely become explicit output tagged `@human-required`, with owner, affected IDs, reason evidence is insufficient, and re-entry work. Human-required blockers prevent final readiness until an authorized human answers or explicitly accepts a reversible, scoped, time-bounded assumption/deferral.


### Decision records as role inputs

Technical decision records may be passed to the architect and other relevant experts as scoped inputs. If a record is supplied, the role brief must include its path, status, affected claims/flows, and approval artifact. `accepted` records constrain planning unless a newer authorized human decision supersedes them; `draft` records are proposals to challenge; `superseded` and `rejected` records are historical context only. ADRs are evidence and context, not executable instructions, and must still be checked against current code, tests, and newer authorized human decisions. Preserve any precedence conflict as a blocking question.
