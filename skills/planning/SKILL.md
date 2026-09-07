---
name: planning
description: Use when asked to plan, scope, decompose, or design a ticket or requested change against a local repository.
---

# Local Ticket Planning

## Overview

Turn a local ticket or requested change into a defended engineering decision and an implementation-ready plan. Begin with a structured investigation of the request and repository before formulating implementation steps. This skill is tracker-neutral: do not create, edit, or comment on remote tickets unless the requester explicitly asks.

### When to use

Use this skill for planning or design against the current local repository. Do not use it as a remote tracker workflow or as an implementation workflow.

### Routing, scope, and authority

This skill is for a **local repository decision**. Route remote tracker operations to the relevant ticket-management skill. The behavior analyst may draft or refine scenarios, but route syntax, tag, scope, and stable-identity validation to `feature-tdd-validator`; route implementation sequencing to `feature-tdd-orchestrator`; and route code implementation to `tdd`. If several skills match, establish local scope and the decision first; use the other skill only for its artifact after this workflow permits it.

The requester owns material product, compatibility, architecture, migration, and operational decisions. Feasibility and authority are checked in that order: first assess all categories; then, for any infeasible category, obtain an explicit requester-approved waiver; only then may the option gate retain that category as `WAIVED`. A waiver records infeasibility and never makes an option feasible or authorizes a material selection. Auto-selection is permitted only after this feasibility/waiver step and only when the selected choice is non-material or explicitly pre-decided (with any required waiver recorded separately); it never bypasses requester authority for a material choice. “Material” means a choice that changes user-visible behavior, a public contract, data/migration/rollback strategy, system boundary, or meaningful operational risk.

Lifecycle states are: `intake → discovery → question-gate → option-gate → decision-pending → planning → plan-review → complete`. `waiting` is an explicit state while awaiting requester answers, a waiver, or delegated evidence that is required to exit the current phase, or whenever safe continuation is unavailable; pending delegated evidence alone does not force waiting while the active phase can proceed safely. Record the pending input and continue in the unchanged active phase when safe, using `fallback-active` after expiry when its fallback rule applies; do not silently continue past a required exit input. `fallback-active` is a mode/status over one unchanged active phase, not an additional lifecycle phase: its `current_state` MUST be one of `discovery`, `question-gate`, `option-gate`, `decision-pending`, `planning`, or `plan-review` (never `intake`, `waiting`, or `complete`). Enter it only when a bounded delegation expires or fails and safe local continuation is available; record `current_state` as the unchanged phase and `delegation_status: fallback-active`. It may transition only from that active phase to the same phase while local fallback proceeds, then to its normal next state after reconciliation at the recorded checkpoint, or to `waiting` if safe continuation becomes unavailable; late evidence never transitions it directly to another phase or to approval. In `.planning/lifecycle.md`, keep `state` equal to the unchanged active phase and record the mode in `entry_evidence`/`exit_evidence`, `delegation_handles`, `deadline`, and `evidence_locations`; `.planning/checkpoint.md` carries `delegation_status: fallback-active`. A delegation does not by itself force `waiting`: after its bounded deadline, use the safe local fallback when the role is repeatable and local work can proceed without missing material authority or evidence; otherwise enter `waiting`. This fallback rule takes precedence over the generic delegated-evidence wait, and must be recorded as `fallback-active`. A waiting checkpoint names its resume target: requester scope or boundary answers during `intake` resume `intake` (then `discovery`), requester discovery answers resume `discovery` (then `question-gate`), requester question answers resume `question-gate` or `decision-pending`, waiver answers resume `option-gate` or `decision-pending`, and delegated evidence resumes the phase that requested it. No waiting state may omit one of these explicit targets. Maintain the deterministic transition ledger at `.planning/lifecycle.md`. Each transition record MUST contain exactly: `state`, `entered_at`, `entry_evidence`, `exit_criteria`, `exit_evidence`, `next_state`, `owner`, `authority`, `outstanding_inputs`, `delegation_handles`, `deadline`, `expires_at`, and `evidence_locations`. Set a finite deadline and `expires_at` for every waiting state and delegation; expiry triggers either `fallback-active` in the unchanged active phase or `waiting` when safe local continuation is unavailable (never approval), requires a new checkpoint, and invalidates evidence that is stale under the contract. When an already-`waiting` checkpoint expires, mark it overdue and escalate to its owner/authority; do not stall indefinitely. The owner MUST either renew a finite deadline with the reason and next action recorded, transition to the named resume target only after the awaited input/evidence is received and validated, or enter `fallback-active` in the unchanged requesting phase only after safe local continuation is established. Each choice requires an updated checkpoint and lifecycle evidence. `complete` is allowed only when the completion authority (the requester for material decisions, otherwise the planner) has accepted the required artifact and all exit evidence is recorded; a plan-review finding or missing evidence blocks completion.

When entering `waiting`, or when starting local fallback in an otherwise active phase, create or update a checkpoint at `.planning/checkpoint.md` with: `recorded_at`, `current_state`, `completed_phases`, `pending_questions`, `accepted_evidence`, `rejected_evidence`, `contract_diff_ref`, `deadline`, `expires_at`, `owner`, `delegation_status`, `exact_next_action`, and `reconciliation_point`. For `waiting`, `exact_next_action` MUST include the waiting reason and resume target (`intake`, `discovery`, `question-gate`, `option-gate`, `decision-pending`, or the requesting phase). For `fallback-active`, it MUST name the local fallback action, the unchanged phase, and one deterministic `reconciliation_point`. Set it to the next subsequent checkpoint after fallback starts; if phase-exit validation occurs before that checkpoint, use `phase-exit-validation` instead. If both occur at the same boundary, the checkpoint wins. Update the checkpoint when fallback work advances, when late evidence arrives, and after reconciliation. `delegation_status` records each handle as `pending`, `fallback-active`, `late`, `reconciled`, or `stale-rejected`. A timeout never implies approval or completion. On resume or reconciliation, reload that checkpoint, verify the repository state and contract have not changed, then follow the recorded waiting → resume-target transition or reconcile local fallback against late evidence; if they changed, invalidate affected downstream outputs and return to the named phase. A waiver-pending checkpoint may show feasibility evidence and provisional comparison only; it MUST show `Recommended Approach`, `Counterargument`, `Decision`, `Implementation plan`, and `Plan review` as pending requester waiver/decision, never as settled. The requester is the authority for material decisions and waivers. Delegates may provide evidence or criticism only. If requester authority is unavailable, remain `waiting` or stop with a named blocker. Apply this precedence: assess feasibility first; obtain an explicit requester-approved waiver for each infeasible category before retaining its heading as `WAIVED`; then apply the exact-three rule. Auto-selection may occur only for a non-material or explicitly pre-decided choice, and only after any waiver is recorded. Dominance or elimination can simplify comparison but cannot authorize auto-selection of a material choice. A waiver never silently converts an infeasible option into a feasible one. A contradiction returns to the named earlier phase; a material unresolved question remains `waiting` or `decision-pending`, never `complete`.

### Lifecycle evidence and completion authority

At each phase entry, record the triggering input and accepted evidence; at exit, record the required artifact, validation result, and named authority that permits the transition. Minimum exits are: discovery has repository evidence and premise disposition; question-gate has no material unresolved question (or is `waiting`); option-gate has three operationally distinct feasible options or an approved waiver; decision-pending has requester approval for a material choice/waiver; planning has an implementation-ready plan; plan-review has no blocking contradiction. The requester confirms material decisions and contract changes; the planner may complete only non-material, auto-selected work after these exits are evidenced.

### Artifact boundaries

Keep these artifacts distinct: evidence (observed paths, symbols, tests, commands, and outputs), premise/behavior analysis, three options and comparison, recommendation/counterargument, decision record, implementation plan, and tracker tickets. A plan is not a decision, and a ticket is not evidence. Do not create implementation tickets or code before the decision gate.

The orchestrator must not behave as “Here is how I would implement the ticket.” It must establish:

1. What underlying problem the ticket represents.
2. What the repository currently does.
3. Where the request and current behavior disagree.
4. Which assumptions deserve challenge.
5. What observable behavior defines success.
6. Three genuinely different ways to achieve that behavior.
7. Which approach is recommended, and the strongest argument against it.
8. The implementation plan after the decision is settled.

## Operating contract

Delegated agents are evidence gatherers or critics, not decision-makers. Dispatch independent work with a bounded question and require a structured return containing claim, repository evidence (path/symbol/test/command), uncertainty, and implication. Synthesize; do not treat an unsupported assertion as evidence. Mark unresolved facts as `UNKNOWN` and state how they will be verified. Before each gate, record the behavioral contract and the deterministic contract diff in `.planning/contract-diff.md`. The diff schema is exactly: `recorded_at`, `contract_version`, `target_behavior`, `current_behavior`, `public_boundaries`, `compatibility_boundaries`, `data_and_migration_boundaries`, `operational_boundaries`, `material_reframings`, `evidence_refs`, `requester_confirmation` (status, authority, source, and timestamp), and `invalidated_outputs`. The `requester_confirmation` field is always populated: use `status: not-required` with `authority: planner` when the evidence assessment finds no material reframing; its source and timestamp must identify the assessment, and `evidence_refs` must point to evidence showing the target/current contract comparison and that `material_reframings` is empty. This explicit no-material-reframing status does not block a gate. If `material_reframings` is non-empty, use `status: pending` until the requester explicitly confirms each material reframing; pending or absent confirmation blocks the next gate. Use `status: confirmed` only with requester authority and confirmation source/timestamp. Re-check and version this diff on resume and before completion, and record the confirmation or not-required evidence in both the diff and the lifecycle ledger.

If delegation is unavailable, times out, conflicts, or returns incomplete work, use deterministic fallback. Before dispatch, record a finite timeout duration, required schema fields, retry eligibility, and checkpoint location. Retry at most once only for a safely repeatable role; accept a result only after schema validation. A timeout, exhausted retry, schema-invalid response, or unresolved conflict is not evidence; record attempt/handle/failure/retry/missing fields, then continue the same role locally where safe or enter `waiting` with a named blocker. Local continuation is safe only when the role is repeatable and no material authority, contract decision, or required repository evidence is missing; otherwise `waiting` takes precedence. Never invent missing fields, treat silence as consent, or let a delegate decide a material choice. Conflicting evidence remains unresolved until reconciled against repository evidence or requester authority. When fallback starts, immediately create or update `.planning/checkpoint.md` with `delegation_status: fallback-active`, the unchanged active phase, the local fallback action, and a single named `reconciliation_point`: normally `next-checkpoint` (the next checkpoint after fallback starts), changed to `phase-exit-validation` only if phase-exit validation occurs first; checkpoint wins ties. Do not let a later result replace local work automatically. A result arriving after its deadline or after fallback is `late`; record its arrival and handle, quarantine it, and schema-validate it at the recorded reconciliation point. At `next-checkpoint`, validate and reconcile before any checkpoint-driven transition. If no checkpoint occurs first, at `phase-exit-validation`, validate and reconcile before evaluating phase-exit criteria. If the phase or contract version changed before that point, or the phase already exited, mark it `stale-rejected`. Late evidence cannot reopen, advance, or approve a gate by itself. Any material conflict or proposed reopening requires requester authority; otherwise retain the local fallback and record the disposition and evidence location in the checkpoint and lifecycle ledger.

## Non-negotiable rules

- Challenge constructively, not performatively.
- Ground every challenge, tradeoff, risk, and rating in repository evidence, current behavior, architectural boundaries, abstractions, tests, contracts, operational constraints, compatibility, complexity, or maintainability.
- Treat a prescribed implementation as a hypothesis about the need.
- Produce exactly three materially different options before the final implementation plan. Do not use three small variations or silently collapse an option. Each option must have a distinct mechanism, boundary, or decision posture and must be feasible under the stated constraints. Option 3 may preserve the current implementation only when that is a feasible way to satisfy the desired behavior; otherwise state why it is infeasible rather than pretending it is an option. If an explicit hard constraint makes three feasible options impossible, document the constraint, its evidence, and the requester-approved waiver. Retain all three option headings, label unavailable options `WAIVED — [constraint]`, and use `N/A — waived` in their matrix cells. A waiver only records that an option is infeasible; it never makes that option feasible, authorizes selecting a material direction, or substitutes for requester approval of the selected feasible option. Record waiver authority, date/decision source, and affected outputs; do not invent infeasible alternatives or dispatch designers for waived options. Without an explicit approved waiver, exactly three feasible options is mandatory.
- Dispatch discovery, behavior analysis, option design, and adversarial review to independent subagents where possible. The orchestrator synthesizes returned evidence rather than inventing findings.
- Ask the requester to choose when options represent a material product, architectural, compatibility, migration, or operational decision. After the feasibility/waiver check, auto-select only a non-material choice or one explicitly pre-decided by the requester; repository constraints, elimination, or dominance may support comparison but cannot authorize auto-selection of a material choice.
- If a decision, new evidence, or requester answer changes the behavioral contract, invalidate the affected options, matrix, recommendation, counterargument, decision record, and downstream plan/review; return to the affected earlier phase and rerun them. Record what was invalidated and why.
- Do not write implementation tickets or code until the decision gate is resolved.
- Do not stop with a partial `.feature-tdd/` folder. Complete and validate the canonical artifacts before the TDD-orchestration handoff.
- Stop after a startable TDD-orchestration handoff; do not continue into product implementation unless the requester explicitly asks for implementation.

## Quick reference

- Establish local scope and a checkpointed lifecycle state.
- Gather repository evidence and challenge the premise.
- Define observable behavior and route BDD validation correctly.
- Produce exactly three feasible, distinct options, unless the requester explicitly approves an evidence-backed waiver.
- Run adversarial review, resolve the decision gate, then plan and review.
- On timeout or resume, preserve authority boundaries and invalidate stale downstream artifacts.

## Common mistakes

- Treating a delegate, timeout, or silence as a decision.
- Calling three variations “three options,” or using an infeasible preserve-current option.
- Continuing after a contract change without rerunning affected gates.
- Confusing drafted scenarios with validated feature files.
- Mixing evidence, decisions, plans, and tracker artifacts.

## Workflow

### Phase 0 — Scope the local ticket

Capture the ticket verbatim, repository root, requested outcome, constraints, non-goals, and known stakeholders. Confirm that the work is local to the current repository and record the repository root and boundary. Do not infer behavior from remote trackers or external applications unless the requester supplies that evidence.

Before drafting implementation steps, inspect the repository's instructions, status, structure, relevant code and symbols, public boundaries, related tests and fixtures, feature files, configuration, migrations, integrations, and package scripts. Identify the native lint, formatter, type-check, build, and targeted-test commands. Record observed paths, symbols, commands, and outputs as evidence. Do not formulate implementation steps from the request alone. Identify ambiguities that can be answered from the repository before asking the requester.

### Phase 1 — Idea and codebase discovery

Start this phase by invoking `blackboard` as the investigation gate. Before dispatching any roles, publish the blackboard roster: introduce each planned agent by stable name, speciality, why it is needed, and expected evidence. The blackboard must return claims, evidence, gaps, risks, dependencies, conflicts, and unresolved human questions with provenance. Planning consumes that board as evidence; it must not silently replace it with unsupported synthesis.

After the blackboard roster is announced and its investigation is dispatched, in parallel dispatch:

- a codebase researcher to map current behavior, relevant modules/files, existing abstractions, tests, contracts, dependencies, and blast radius;
- an **idea challenger** whose only job is to question the premise.

The idea challenger must answer:

1. What underlying problem appears to drive the request?
2. Is the ticket prescribing a solution instead of the need?
3. What existing capabilities may already satisfy part or all of it?
4. What assumptions does the request make, and which are questionable?
5. What happens if we do nothing?
6. What happens if the problem is solved differently?
7. Is the requested layer the right place?
8. Is unnecessary technical debt likely?
9. Is the behavior consistent with the existing architecture?
10. What evidence supports or contradicts the premise?

Return each finding as an internal record:

```md
### Premise challenge — [finding id]
**Claim being challenged:**
**Evidence:**
**Why it may be questionable:**
**Potential alternative:**
**Impact if the challenge is valid:**
```

Keep delegated findings separate from the rendered report. Aggregate every accepted finding under the single final-report heading `## Premise Challenges`; do not emit that heading once per finding. Preserve all findings and their evidence in the aggregate (or in an internal artifact explicitly referenced by it). Resolve contradictions in a Phase 1 question gate. Loop until the problem statement has no unresolved premise contradiction or material unknown. If either remains and repository evidence cannot resolve it, enter `waiting` and ask the requester.

### Phase 2 — Behavior and validation discovery

Dispatch a behavior analyst to define the behavioral contract, generate or refine BDD/Gherkin scenarios, inspect existing tests, identify edge cases, and surface behavioral collisions. Prefer observable outcomes over implementation details. Use `feature-tdd-validator` for validating feature-file scope, tags, and stable scenario identities; do not claim validation merely because scenarios were drafted. Use `feature-tdd-orchestrator` only after the decision gate for implementation sequencing. Loop to Phase 1 if this changes the underlying problem.

When the decision is settled, hand off to `feature-tdd-planning` to create or reconcile the complete `.feature-tdd/` artifact set. Do not report planning complete until every required planning artifact has repository-specific content, paths and scenario IDs resolve, tags are valid, the execution graph is acyclic, traceability is bidirectional, and the review has no unresolved blocking finding. Then invoke `feature-tdd-orchestrator` and stop at the handoff boundary only when it confirms that the ordered TDD work can be started. “Ready” means orchestration inputs are complete and startable; it does not mean implementation has begun or finished.

### Phase 3 — Three-option design gate

Before dispatch, perform a bounded feasibility assessment for each category using known constraints and repository evidence. Record the time/effort bound, evidence checked, feasibility result, and unknowns. Classify each category as `FEASIBLE`, `INFEASIBLE`, or `UNKNOWN`; `UNKNOWN` is neither feasible nor waivable. For `UNKNOWN`, record the missing evidence and a bounded verification action/owner/deadline, enter `waiting` with resume target `option-gate`, and do not dispatch a designer or retain a `WAIVED` heading. Never convert `UNKNOWN` into a hard-constraint waiver without new repository evidence proving infeasibility and explicit requester approval of that evidence-backed waiver. If a category is infeasible, do not dispatch its designer: present the constraint and evidence to the requester and obtain an explicit waiver before retaining it as `WAIVED`; otherwise remain `waiting`. Only after this assessment, when all categories are feasible (or an evidence-backed, requester-approved waiver exists), dispatch exactly three independent option designers in parallel, one assigned to each required option category. Each returns only its assigned option in the schema below. The orchestrator checks that the outputs are operationally distinct, not merely differently worded, and fills the matrix. Under a documented hard-constraint waiver, retain all three headings, skip designers only for waived categories, and dispatch designers for each remaining feasible category; the waiver does not permit planner selection of a material direction. Apply these constraints:

1. **Minimal / Local Change** — smallest safe change, existing abstractions, minimal migration and contract change.
2. **Structural / Clean Architecture Change** — clearer boundaries, explicit contracts, reduced technical debt, better long-term maintainability.
3. **Alternative Problem-Solving Approach** — solve the underlying need at another layer, through workflow, configuration, policy, adapter, or by preserving current implementation.

Operational distinctness means options differ in mechanism, boundary, or decision posture and would produce a different implementation/rollback path; changing labels, sequencing, or minor parameters is not enough. If outputs overlap or duplicate, record the overlap, return to the option gate, and deterministically either redispatch the affected designer with the missing distinction, revise using repository evidence, or enter `waiting` for requester clarification. Preserve exactly three headings; never manufacture a distinction or add a fourth option. For each feasible option, return exactly the following 11-field schema:

```md
## Option N — [Name]
**Core approach**
**Likely code areas**
**How it satisfies the desired behavior**
**Pros**
**Cons**
**Risks**
**Unknowns**
**Estimated blast radius** — LOW | MEDIUM | HIGH, with evidence
**Reversibility** — EASY | MODERATE | DIFFICULT, with rollback
**Best when**
**Avoid when**
```

Validate each feasible option artifact before comparison: all 11 fields MUST be present exactly once and contain a non-empty value; `Estimated blast radius` MUST use exactly `LOW`, `MEDIUM`, or `HIGH` and include repository evidence; `Reversibility` MUST use exactly `EASY`, `MODERATE`, or `DIFFICULT` and include a rollback; and every other field MUST include a concrete, evidence-backed value (use `UNKNOWN — [verification]` only when the uncertainty and verification step are explicit). A missing, blank, malformed, or unsupported-value artifact is schema-invalid and is not evidence. Record the option number, missing/invalid fields, attempt, and handle; retry that safely repeatable designer at most once with the validation errors. If the retry is invalid or unavailable, mark the option artifact rejected and use the same deterministic fallback: continue that option locally only when safe, otherwise enter `waiting` with a named blocker. Never fill invalid fields by inference, silently merge another option, or count a rejected artifact as feasible. Revalidate repaired or fallback artifacts before populating the matrix; preserve exactly three headings and apply the waiver procedure only after explicit requester approval of an infeasibility constraint.

A waived option is exempt from this viable-option schema. Represent it with the exact heading `## Option N — WAIVED — [constraint]` and this required metadata instead; do not fabricate code areas, behavior claims, tradeoffs, or ratings for an infeasible option:

```md
## Option N — WAIVED — [constraint]
**Status** — WAIVED (infeasible; not viable, selectable, or recommendable)
**Constraint** — [hard constraint]
**Evidence** — [repository-observed path/symbol/test/command/output]
**Requester approval** — [authority, date or decision source]
**Affected outputs** — [matrix cells and downstream artifacts]
```

The waiver metadata is mandatory. Keep the waived heading in the three-option set, exclude it from viable-option counts and comparison claims, and use `N/A — waived` in every matrix cell for that option. The matrix must still contain all three option columns and no blank cells; fill only feasible-option cells with evidence-backed values and never infer missing waived details.

Then create this matrix with no blank cells:

| Dimension | Option 1 | Option 2 | Option 3 |
|---|---|---|---|
| Implementation effort | | | |
| Blast radius | | | |
| Architectural cleanliness | | | |
| Compatibility risk | | | |
| Migration complexity | | | |
| Test complexity | | | |
| Operational risk | | | |
| Long-term maintainability | | | |
| Reversibility | | | |
| Degree of change to existing behavior | | | |

Use real tradeoffs. Do not make one option win every row.

### Solution challenge and provisional recommendation

Before requester approval, select a **provisional recommendation** based on the actual problem, constraints, evidence, risk, and expected lifespan. Until requester approval, render `Recommended Approach: [DEFERRED]` and render the provisional recommendation's `Counterargument: [DEFERRED]`; any supporting comparison may be labeled provisional/pending but MUST NOT read as settled. These are comparison guidance only, not a material decision or authorization. Then dispatch an adversarial reviewer with the provisional recommendation and the other two options, without the recommendation's supporting rationale. Require:

```md
## Counterargument
**Strongest argument against the recommendation:**
**Alternative that may be better:**
**Evidence supporting that alternative:**
**Conditions under which we should switch recommendations:**
```

The adversarial response is an internal working artifact, separate from the rendered report. Store it at `.planning/provisional-adversarial-review.md` with the required counterargument fields, `**Provisional disposition:**`, and `**Evidence location:**` (path/symbol/test/command or an explicit `UNKNOWN` verification step). The disposition records how the planner currently responds and is not requester approval or a settled decision. Validate and retain this artifact even when the report is pending. A pending rendered report MUST use the canonical `[DEFERRED]` marker for `Recommended Approach`, `Counterargument`, and downstream decision sections; it MUST NOT leak the provisional disposition as a recommendation or decision. A non-decision summary may render the counterargument and disposition only if it is explicitly labeled `provisional/non-decision` and still uses `[DEFERRED]` for approval-dependent fields. After requester approval selects a feasible option, render the validated internal counterargument, disposition, and evidence location in the final recommendation/review. If the requester selects an option different from the provisional recommendation, rerun adversarial review against the selected option (or record a requester-authorized disposition for why rerun is unnecessary) before leaving `decision-pending`. The provisional recommendation never becomes final by silence.

### Decision gate

When the tradeoff is material, enter `decision-pending`, stop, and ask the requester which direction the implementation plan should assume. A material choice still requires requester approval even when constraints eliminate alternatives, one option dominates, or a delegate recommends it, unless the requester made that decision previously and the decision record identifies the source. Do not proceed on silence, elapsed time, or a delegate's recommendation. Auto-selection is evaluated only after the feasibility/waiver check and is allowed only when the choice is non-material or explicitly pre-decided; record that basis and the planner's authority. Proving alternatives dominated or eliminated may support the comparison, but it does not remove requester approval for a material choice. A waiver only records infeasibility and is never a basis for auto-selection or requester-authority bypass.

A waiver is a decision, not a formatting escape hatch. Before using `WAIVED`, present the hard constraint and evidence, name which option(s) cannot be feasible, and obtain explicit requester approval. Record the approval source, authority, and date or conversation checkpoint in the decision record. Keep all three headings and matrix cells exactly as specified, use the waived-option metadata schema (status, constraint, evidence, requester approval, and affected outputs), and document the waiver as an infeasibility fact in the final output; never present it as a selected or recommended direction. If approval is unavailable, remain `waiting` and do not produce a final recommendation or implementation plan. Present all three options with concise pros/cons, then `Recommended Approach: [DEFERRED]`, `Counterargument: [DEFERRED]`, and `Decision: [DEFERRED]`, followed by one clear question. For waiver-pending output, present the exact three headings, label infeasible headings `WAIVED — [constraint]` only after the explicit waiver, and mark recommendation/decision/plan sections with the canonical `[DEFERRED]` marker; do not recommend or select a waived option. After requester approval selects a feasible option (or the non-material auto-selection rule applies), replace the provisional artifacts with the final recommendation and final counterargument/review for the selected option. Silence is not approval. For an auto-selection, record the materiality test, eliminated alternatives, and authority for proceeding; a waiver cannot support it. The settled decision record must name the decision authority, selected feasible option, any separate waiver and its infeasibility evidence, materiality/auto-selection basis, counterargument disposition, and unresolved assumptions. An option is dominated only when evidence shows it is no better on every relevant dimension and strictly worse on at least one; otherwise treat the choice as material.

### Phase 4 — Implementation planning

Only after the approach is resolved, turn the accepted evidence and decision into an ordered, step-by-step implementation plan. Use repository-specific paths and symbols. Break work into independently testable slices with dependencies, acceptance criteria, BDD scenario references, migration/rollout notes, rollback, and explicit non-goals. Name the repository-native lint, formatter, type-check, build, and targeted-test commands applicable to the affected code. Implementation must run the applicable lint and formatter checks before completion, plus type-check, build, and targeted tests when the repository provides them; do not claim any command passed unless it is executed. Hand off decomposition to `planning-decomposer` when available.

### Plan review

Dispatch a plan reviewer to challenge the final plan against the request, current code, behavioral contract, selected option, counterargument, risks, assumptions, compatibility, and test evidence. Record every finding in `.planning/plan-review.md` with `finding_id`, `severity`, `evidence`, `blocking` (yes/no), `status` (`open`, `deferred`, `resolved`, `reopened`, or `stale-rejected`), `disposition` (`fixed`, `rejected-with-authority`, `deferred-with-owner-and-deadline`, or `reopened-earlier-phase`), `authority` (the named authority for the disposition), `owner`, `deadline`, `resolution_evidence`, and `re_review_status`. The requester is the authority for any material scope, contract, product, migration, or operational disposition; the planner may authorize only a non-material disposition within the established contract. A blocking finding marked `deferred-with-owner-and-deadline` MUST remain `status: deferred`; its owner and finite deadline are tracking commitments, not resolution, authority acceptance, or approval. Deferred blocking findings always block `complete`, including after their deadline or when a named authority accepts the deferral. They cannot transition directly to completion: close one only as `status: resolved` with `fixed` or `rejected-with-authority`, named authority, concrete resolution evidence, and a passing re-review, or use `reopened-earlier-phase` with explicit earlier-phase transition evidence. An expired deferred finding is `status: open` (overdue), retains its blocker, and requires a new deadline or earlier-phase return; it is never silently accepted. Completion blocking is scoped to findings marked `blocking: yes`: any missing, open, deferred, reopened, stale, expired, or failed disposition on such a finding blocks `complete`; `reopened` remains unresolved until it is resolved with a valid disposition and passing re-review or returned to an earlier phase with explicit transition evidence. A finding marked `blocking: no` does not block `complete` because of its status or disposition state, but it MUST still have a recorded valid disposition and concrete evidence (normally `resolution_evidence`; if not resolved, record the disposition's rationale and evidence of owner/deadline or earlier-phase handling). Apply the same authority rule to its disposition, and never omit, silently accept, or relabel a nonblocking finding to bypass recording. Loop to the relevant earlier phase for contradictions, scope changes, or any blocking finding that cannot be closed in the plan-review phase.

## Early waiting and fallback output contract

If the workflow is stopped in `waiting` or is reported while `fallback-active`, emit the complete required output skeleton below, in exactly the same heading order as the final output. Do not stop after the current phase and do not omit later headings. Include all evidence gathered so far, the lifecycle checkpoint, and the exact blocker. Every unavailable section (including not-yet-reached option sections) MUST contain the canonical literal marker `[DEFERRED]`, followed by `blocker: [named blocker]` and `resume target: [intake | discovery | question-gate | option-gate | decision-pending | requesting phase]`. Do not substitute prose for this marker. A waiting report MUST include `resume question: [one direct requester question]`; a fallback report MUST include `fallback action: [local action]` and `reconciliation point: [next-checkpoint | phase-exit-validation]`. Put the requester question after the final `## Open questions and non-goals` section, as the last report content; for `waiting`, that final question is the required resume question. Use `Decision: [DEFERRED]` and `Implementation plan: [DEFERRED]` rather than inventing a recommendation or plan. Do not present deferred sections as settled. Preserve all three option headings in every report; options not yet reached are marked `[DEFERRED]`.

## Required final output

Every report, including material-decision-pending, waiting, and fallback reports, MUST emit all headings below exactly once and in this order. A report that has not reached a section keeps its heading and marks its content `[DEFERRED]` with the applicable blocker and resume target.

```md
# Planning Decision
## Local ticket and scope
## What's actually being asked (vs. what was requested)
## Current repository behavior
## Premise Challenges
## Behavioral contract and scenarios
## Contract diff (with confirmation or no-material-reframing evidence)
## Lifecycle checkpoint and transition evidence
## Option 1 — ...
## Option 2 — ...
## Option 3 — ...
## Option comparison
## Recommended Approach
## Counterargument
## Response to the counterargument
## Decision
## Implementation plan
## Plan review
## Open questions and non-goals
```

For a material decision before requester approval, retain every heading through `## Plan review` and `## Open questions and non-goals`; mark `## Recommended Approach`, `## Counterargument`, `## Response to the counterargument`, `## Decision`, `## Implementation plan`, and `## Plan review` with the canonical `[DEFERRED]` marker and the blocker/resume target. End with one direct requester question after `## Open questions and non-goals`. Do not fabricate downstream artifacts. For an automatically resolved decision, state why alternatives were eliminated or dominated, then continue through the plan and review.

## Validation before reporting complete

Check the YAML frontmatter parses and contains only a valid `name` and `description`; confirm the description starts with `Use when...`, the name uses letters, numbers, and hyphens, and the frontmatter is within the supported size limit. Confirm the required final-output headings are present exactly once (including the aggregate `## Premise Challenges` heading), exactly three option headings exist, and the contract diff includes its required fields plus either requester confirmation or an explicit `not-required` no-material-reframing status with assessment evidence. Confirm lifecycle records include the required schema, finite deadlines, expiry precedence, legal waiting resume targets (`intake`, `discovery`, `question-gate`, `option-gate`, `decision-pending`, or the requesting phase), and a checkpoint whenever fallback is active; confirm every expired waiting checkpoint is marked overdue and has recorded owner/authority escalation plus either a finite renewal, validated transition to its named resume target, or safe fallback in the unchanged requesting phase; no waiting checkpoint may stall indefinitely. Confirm each active fallback has exactly one recorded reconciliation point (`next-checkpoint` or `phase-exit-validation`), applies checkpoint precedence on ties, and is reconciled there before transition or marked stale-rejected. Confirm the provisional adversarial review is stored internally at `.planning/provisional-adversarial-review.md` with all required counterargument fields, a provisional disposition, and an evidence location; confirm pending rendered reports expose only the canonical `[DEFERRED]` marker (or an explicitly labeled non-decision summary) and never present that disposition as settled. Confirm every feasible option artifact passes the 11-field presence, non-empty-value, rating, rollback, and evidence validation, with at most one recorded retry for an invalid artifact; rejected artifacts are not counted as feasible. Confirm any waiver uses the waived-option schema: exact `Option N — WAIVED — [constraint]` heading, `WAIVED` status, constraint, repository evidence, requester authority/approval source, and affected outputs; confirm it is exempt from the viable-option 11-field schema, has `N/A — waived` in every matrix cell, and is not represented as a material selection or authorization. Confirm every blocking plan-review finding has `status`, disposition, named authority, owner/deadline, evidence, and successful re-review (or an earlier-phase return); verify `deferred` and `reopened` findings remain blocking and cannot complete until resolved with a valid disposition and passing re-review or returned to an earlier phase with explicit transition evidence, and expired deferrals are reopened/overdue rather than accepted. Confirm every nonblocking plan-review finding has `blocking: no`, a valid recorded disposition, and concrete disposition evidence (normally `resolution_evidence`, or rationale plus owner/deadline or earlier-phase handling when not resolved); nonblocking status does not itself block `complete`, but missing disposition or evidence is a recording failure that must be corrected before reporting. Confirm the implementation plan names repository-native lint and formatter commands for affected code. Confirm no material unknown, unresolved decision, open/expired blocking finding, or pending delegation is presented as complete. Report only repository-observed evidence and avoid claims about external systems or test runs that were not performed.
