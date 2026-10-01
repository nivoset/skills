---
name: product-intake
description: Use when a user needs to capture a new product idea, document an existing product, or turn product evidence and interviews into reviewable capability and feature drafts.
disable-model-invocation: true
user-invocable: true
---

# Product Intake

## Purpose

Build a bounded, evidence-linked map of a product idea or existing product and turn it into reviewable Markdown capability and feature drafts. Intake documents what is known, what is inferred, and what remains undecided; it does not approve product scope or claim exhaustive discovery.

Use this skill for product discovery and product documentation, not multi-role initiative planning (use `blackboard`), architecture planning, implementation, or ticket creation. Do not create tickets, modify product code, or begin implementation as part of intake.

## Operating rules

- The user or explicitly named decision authority owns material decisions. Agent agreement, recommendation, or silence never means approval.
- The main agent is the sole writer of the intake inventory and durable deliverables. Specialists, when used, are read-only and return proposals.
- Prefer user-supplied materials and local evidence. Use external sources only when available and specifically authorized; retain source and retrieval context and state verification limits.
- No ranking or prioritization unless requested. A requested ranking is a proposal until the decision authority accepts it.
- Treat “find all” as bounded completeness: cover the supplied evidence and user answers, and name unexamined areas without implying exhaustiveness.
- Preserve useful disagreement, uncertainty, source conflict, and rejected alternatives. Never smooth them into unsupported consensus.

## Product vocabulary

| Kind | Meaning |
|---|---|
| `user_or_problem` | A named user/group and need, problem, or situation. It is not a solution. |
| `outcome` | A change that should become true for a user or stakeholder. |
| `capability` | A coherent product ability that serves one or more outcomes. |
| `feature` | A bounded user-visible behavior or example within a capability; examples do not imply complete scope. |
| `evidence` | An observation from a cited source, interview, artifact, or authorized research. Keep it separate from interpretation. |
| `assumption` | An unverified premise used to frame a proposal. State what evidence could confirm or disconfirm it. |
| `decision` | A choice made by the user or named authority, with scope, rationale, and date/context where available. |
| `unknown` | A material unanswered question, including why existing evidence cannot resolve it and how it can be revisited. |

## Workflow

### 1. Establish context and inspect evidence

Capture the request, intended outcomes and users, constraints, non-goals, supplied materials, output location preference, and what counts as an in-scope product item. Inspect supplied authoritative material before asking questions. For a repository, inspect only relevant source, documentation, tests, or prior decisions; cite paths and useful symbols, lines, versions, or commands where available.

If no destination is named, suggest a repository-appropriate documentation location based on existing conventions and confirm it before writing durable files. Keep notes in the conversation until a destination is chosen. Never place drafts in `skills/` unless the user is specifically authoring a skill.

### 2. Select discovery branch

- **New idea:** distinguish the problem and users from solution hypotheses. Clarify desired outcomes, constraints, alternatives, and evidence that would challenge the framing. Mark proposed behavior as proposed, never as current product behavior.
- **Existing product:** document observed current behavior and its evidence first. Then identify candidate capability groupings, gaps, and proposed changes. A description in source or tests is evidence about that artifact, not automatic proof of real-world use or user value.
- **Mixed:** choose a branch per product area. Mark areas with no current-state evidence as `unknown` or proposed rather than borrowing certainty from neighboring areas.

### 3. Create the initial map

Create stable IDs for needs/problems, outcomes, capabilities, feature examples, constraints, dependencies, risks, evidence, assumptions, decisions, and unknowns. Keep IDs stable through revisions; do not reuse retired IDs. Link relationships explicitly (for example `serves`, `contains`, `depends-on`, `supported-by`, `challenges`, `derived-from`). Label each statement as an observation, interpretation, proposal, assumption, or decision.

Every material item uses this record:

```yaml
id: cap-export-01
kind: capability # need | outcome | capability | feature | constraint | risk | evidence | assumption | decision | unknown
title: Export a report
user_or_problem: user-01 # ID or explicit not-established
outcome: outcome-01 # ID or explicit not-established
description: A proposed ability to produce a portable report.
scope: [<included behaviors>]
non_goals: [<excluded behaviors>]
success_evidence: [<observable evidence needed; may be unknown>]
evidence_refs: [evidence-03]
assumptions: [assumption-02]
unknowns: [unknown-04]
relationships: [{type: serves, id: outcome-01}]
risks: [risk-01]
edge_and_recovery_cases: [<known cases or unknown>]
state: proposed # proposed | accepted | contested | deferred | rejected
owner: null # required when deferred
reentry_condition: null # required when deferred
```

Output valid YAML or an equivalent Markdown table. Each item must have a stable ID and evidence refs, or explicitly identify the relevant assumption, unknown, or proposal. Use `accepted` only after a recorded decision by the authorized human. Use `contested` for a live material disagreement. A `deferred` item requires a named owner and a concrete re-entry condition. Retain rejected items and the rejecting authority/rationale.

### 4. Interview iteratively

Ask one focused question at a time, only when its answer could materially change users, problem framing, outcome, scope, success evidence, risk, or a tradeoff and available evidence cannot answer it. Before the question, state the affected IDs and why the answer matters. Do not bundle unrelated decisions or ask for details that will not affect the intake. Preserve answers as evidence or decisions as appropriate, then revisit only affected items when the contract changes.

Use a decision gate before drafting capabilities: confirm problem framing, intended users, desired outcomes, constraints, and non-goals with the user. Present live alternatives and evidence for material tradeoffs. If authority is unclear, ask who decides; if the user is not ready, retain the item as proposed or defer it rather than proceeding as though approved.

### 5. Use specialists only when justified

The no-agent path is the default. Dispatch a specialist only when a named uncertainty is material, evidence can be gathered or checked within a bounded scope, and the result can change an item or make it reviewable. Select the smallest relevant role set from: outcome/scope analyst, user-impact analyst, premise challenger, capability-logic verifier, domain researcher, and risk reviewer.

Announce intended roles before dispatch; mark `dispatched` only after an actual handle exists. Each read-only dispatch specifies one bounded question, relevant IDs and base version, minimum necessary inputs, authorized sources, finite time/attempt bound, response schema, and fallback. Never expose sensitive information beyond the authorized scope. Do not simulate dispatch or claim research that did not run.

Every contribution returns:

```yaml
contribution_id: contribution-01
base_version: <inventory revision>
role: <bounded role>
status: passed # passed | blocked | failed
affected_item_ids: [cap-export-01]
claim_type: evidence | interpretation | proposal | challenge
claim: <one bounded claim>
evidence_source_and_verification: <source/version/retrieval context and verification limit, or none>
interpretation: <clearly separated interpretation>
uncertainty: <remaining uncertainty>
implication: <what changes if considered>
recommendation: null # optional and non-binding
human_decision_needed: <question or none>
changed_paths: [] # must stay empty for read-only roles
```

### 6. Reconcile contributions and evidence

Validate scope, source authority, evidence, freshness, base version, and return shape before considering a contribution. Unsupported, stale, malformed, or out-of-scope claims remain unconfirmed and do not update product facts. Conflicting claims remain visible with their sources; evidence may resolve factual conflicts, while value and scope choices go to the authorized human. A late contribution cannot overwrite a newer item. Re-review only affected IDs after a material premise change.

For external research, record source, retrieval context/date, relevant version, and verification limits. For local evidence, record stable paths and relevant symbols, lines, tests, commands, or commit/version where available. Specialist logic checks can identify inconsistency but cannot establish demand, market validation, or user value.

### 7. Draft capability and feature documents

After the decision gate, create a concise inventory plus capability and feature Markdown drafts at the approved/configured location. Link each draft to its user/problem, outcome, evidence, and related stable IDs. In each item, separate:

- **Observed/current:** sourced descriptions of present behavior (existing-product branch only).
- **Interpretation:** what the evidence may imply, including uncertainty.
- **Proposed:** candidate capability/feature scope, non-goals, and success evidence.
- **Decision:** explicit human choice, authority, and rationale; only these may be marked accepted.

For greenfield ideas, use `proposed` for behavior. For existing products, distinguish current-state evidence from proposed changes. Avoid ranking, implementation details, Gherkin, tickets, or readiness claims unless separately requested and within scope.

### 8. Completeness and handoff

Review the full inventory and draft set for missing, incorrect, unsafe, contradictory, or unsupported items; trace every material capability/feature to a problem/user and outcome, and to evidence or an explicit assumption/unknown/proposal. Check both branch types where mixed intake applies. Name unexplored areas and preserve conflicts, decision owners, deferred items, and re-entry conditions. Readiness means traceable and reviewable; it does not mean exhaustive discovery, market/customer validation, scope approval, or implementation readiness.

Return a concise handoff containing:

1. output paths and a short document index;
2. accepted decisions versus proposed, contested, deferred, and rejected items;
3. evidence and assumptions, with source links and verification limits;
4. unresolved questions/conflicts, affected IDs, and decision owner or re-entry condition;
5. areas not explored and suggested next steps, without ranking unless requested.

## Example trace

```text
user-01 (problem): A team cannot find which items need follow-up. [interview-01]
outcome-01: The team can identify items requiring follow-up. [decision-01: accepted by user]
evidence-01: Current dashboard has no follow-up indicator. [repo path + component; observed]
cap-follow-up-01: Show follow-up status. [proposed; serves outcome-01; supported by evidence-01]
feature-follow-up-filter-01: Filter the list by follow-up status. [proposed; contained by cap-follow-up-01]
assumption-01: Users prefer a list filter over a separate queue. [unverified; evidence that could challenge it: user workflow observation]
```

The accepted outcome does not make the proposed capability or feature accepted. If evidence conflicts or the assumption is material, keep those items proposed/contested and ask the decision owner before treating them as scope.
