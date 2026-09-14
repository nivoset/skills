# Blackboard artifact contract

Use this contract when the board needs structured working state across multiple cycles, delegated waves, or handoffs within the active workspace. The board is temporary and may disappear when `.tmp/` is cleaned. For a small conversational refinement, keep the same logical records in context without creating empty files.

## Design intent

The domain board stores the evolving problem and partial solutions. The control board stores opportunities to reason about that state and the decision about which opportunity receives attention next. Specialists do not form a fixed pipeline. A board event may trigger a specialist that was irrelevant one cycle earlier.

The controller is the only board writer. Specialists receive a versioned snapshot and return proposed events. This keeps material communication inspectable and prevents concurrent agents from silently overwriting one another.

## Files

```text
.tmp/planning/
└── blackboard/
    └── <board-id>/
        ├── board.yaml
        ├── roles.yaml
        ├── control.yaml
        ├── dispatch.yaml
        ├── events/
        │   └── <applied-version>-<event-id>.yaml
        ├── disagreements/
        │   └── <room-id>.yaml
        └── iterations/
            └── <cycle-id>.md
```

`.tmp/planning/` is the generic root for temporary planning work. `blackboard/` is this skill's namespace; other planning workflows may use sibling namespaces without mixing their schemas or lifecycle state. Verify that `.tmp/` is excluded by the repository ignore rules before creating the board. If it is not ignored, do not write the board until the temporary-root policy is corrected or the user authorizes another safe temporary location.

- `board.yaml` is the materialized current domain-board snapshot.
- `roles.yaml` contains reusable and dynamically introduced knowledge-source definitions.
- `control.yaml` contains the current agenda, focus, strategy, signals, and run budget.
- `dispatch.yaml` records planned and actual delegated work.
- `events/` is immutable history and the source for reconstructing why the snapshot changed.
- `disagreements/` preserves material evidence or decision conflicts through resolution.
- `iterations/` contains concise human-readable deltas, not hidden reasoning transcripts.

Do not create placeholder files. Create each artifact when its first real record exists.

Never commit files under `.tmp/planning/`. When the user explicitly requests a durable deliverable, derive it from the accepted snapshot and write only that projection to the user-approved permanent location. Record the source board version and destination as a promotion event before the temporary state is cleaned.

## Board snapshot

`board.yaml` contains:

```yaml
board_id: board-<stable-id>
version: 1
parent_version: null
updated_at: <timestamp>
status: exploring
scope:
  statement: <bounded scope>
  non_goals: []
  authority: <named decision authority>
evaluation_criteria: []
artifacts: []
case_families: []
islands: []
relations: []
open_questions: []
```

Allowed in-progress `status` values are `exploring`, `waiting`, and `budget-exhausted`. A completion projection uses `parent-ready`, `final-ready`, or `blocked` as defined in `SKILL.md`. A board may contain blocked islands while its overall status remains `exploring`.

### Domain artifact

Every entry in `artifacts` is typed and located on both a functional plane and an abstraction level:

```yaml
- id: hypothesis-routing-by-risk
  type: hypothesis
  plane: plan-abstractions
  level: designs
  island_id: parent
  revision: 2
  state: contested
  statement: <one falsifiable or decision-relevant statement>
  evidence_ids: [evidence-current-routing]
  authority: <who may accept or reject this kind of item>
  created_by: role-architecture
  created_at: <timestamp>
  last_event_id: event-014
```

Useful `type` values include `goal`, `non-goal`, `constraint`, `observation`, `evidence`, `question`, `hypothesis`, `alternative`, `behavior`, `risk`, `dependency`, `decision`, `finding`, `capability`, `slice`, and `evaluation-criterion`. Extend the vocabulary only when the new type changes validation, authority, or routing.

Domain artifacts use the `knowledge`, `plan-abstractions`, or `emerging-plan` plane. Their abstraction level is `outcomes`, `designs`, `behaviors`, or `delivery`. This permits movement both across levels and between evidence, candidate structure, and the partial plan. Executive and meta-plan records live in `control.yaml` rather than being disguised as domain conclusions.

Allowed artifact `state` values are `proposed`, `accepted`, `contested`, `rejected`, `superseded`, `deferred`, and `blocked`. `accepted` means accepted by the recorded authority, not merely repeated by several roles.

A `deferred` artifact additionally records `owner`, `authority`, `rationale`, `expires_at`, `affected_ids`, and `reentry_condition`. Expiry reopens the artifact; it never silently accepts it. Work required for correctness, safety, or authorization remains blocking unless the proper authority explicitly changes the scope that made it required.

### Typed relation

```yaml
- from: finding-missing-recovery
  type: challenges
  to: hypothesis-happy-path-sufficient
  event_id: event-019
```

Prefer `supports`, `challenges`, `responds-to`, `refines`, `depends-on`, `blocks`, `answers`, `derived-from`, `supersedes`, `duplicates`, `requires-review`, `same-family-as`, `shares-invariant-with`, `can-regress`, and `counterexample-to`. Preserve both nodes when creating a relation. Semantic cleanup may change the derived snapshot only after equivalence, traceability, and reversibility have been checked; the events remain immutable.

## Implication sweep and case-family records

Create or update a case-family record when a material delta changes a behavior, rule, setting, variant, boundary, shared mechanism, or invariant. The implication sweep identifies related cases before the controller decides which investigations to run.

```yaml
- family_id: family-locale-selection
  name: supported locale selection
  source_artifact_ids: [behavior-change-locale]
  authoritative_membership_evidence: [evidence-supported-locales-config]
  membership_status: verified
  base_version: 8
  members: [locale-en, locale-es, locale-fr]
  relevant_dimensions:
    - selection
    - persistence
    - fallback
    - affected-message-keys
  cases:
    - case_id: case-locale-selection-shared
      trigger_artifact_ids: [behavior-change-locale]
      member_ids: [locale-en, locale-es, locale-fr]
      dimension: selection
      relationship: shares-invariant-with
      affected_artifact_ids: [behavior-change-locale]
      disposition: covered
      rationale: all supported locales use the same validated selector path
      evidence_ids: [evidence-shared-selector]
      verification_refs: [test-locale-selector-parameterized]
      equivalence_basis_ids: [evidence-shared-selector]
      canonical_case_id: null
      owner: role-locale-reviewer
      authority: propose-only
      bound_or_expiry: null
      reentry_or_exit_condition: shared selector path or supported membership changes
    - case_id: case-locale-persistence-shared
      trigger_artifact_ids: [behavior-change-locale]
      member_ids: [locale-en, locale-es, locale-fr]
      dimension: persistence
      relationship: shares-invariant-with
      affected_artifact_ids: [behavior-change-locale]
      disposition: research
      rationale: persistence shares the locale preference mechanism but lacks current evidence
      evidence_ids: [evidence-supported-locales-config]
      verification_refs: []
      equivalence_basis_ids: []
      canonical_case_id: null
      owner: role-locale-reviewer
      authority: propose-only
      bound_or_expiry: <deadline or attempt limit>
      reentry_or_exit_condition: verify persisted value through the shared preference path
    - case_id: case-locale-fallback-shared
      trigger_artifact_ids: [behavior-change-locale]
      member_ids: [locale-en, locale-es, locale-fr]
      dimension: fallback
      relationship: counterexample-to
      affected_artifact_ids: [behavior-change-locale]
      disposition: covered
      rationale: invalid and missing locale values use the accepted fallback invariant
      evidence_ids: [evidence-locale-fallback-contract]
      verification_refs: [test-locale-fallback]
      equivalence_basis_ids: [evidence-locale-fallback-contract]
      canonical_case_id: null
      owner: role-locale-reviewer
      authority: propose-only
      bound_or_expiry: null
      reentry_or_exit_condition: fallback contract changes
    - case_id: case-locale-affected-keys
      trigger_artifact_ids: [behavior-change-locale]
      member_ids: [locale-en, locale-es, locale-fr]
      dimension: affected-message-keys
      relationship: can-regress
      affected_artifact_ids: [behavior-change-locale]
      disposition: covered
      rationale: every affected key exists in each supported locale catalog
      evidence_ids: [evidence-locale-catalog-membership]
      verification_refs: [check-affected-message-keys]
      equivalence_basis_ids: []
      canonical_case_id: null
      owner: role-locale-reviewer
      authority: propose-only
      bound_or_expiry: null
      reentry_or_exit_condition: supported locale or affected key set changes
  balance:
    expected_members: [locale-en, locale-es, locale-fr]
    accounted_members: [locale-en, locale-es, locale-fr]
    unexplained_members: []
    expected_dimensions: [selection, persistence, fallback, affected-message-keys]
    accounted_dimensions: [selection, persistence, fallback, affected-message-keys]
    unexplained_dimensions: []
    unexplained_exceptions: []
  last_sweep_event_id: event-026
```

Every family records `family_id`, `name`, `source_artifact_ids`, `authoritative_membership_evidence`, `membership_status`, `base_version`, `members`, `relevant_dimensions`, `cases`, `balance`, and `last_sweep_event_id`. Allowed membership statuses are `verified` and `unverified`. `unverified` requires a bounded research case describing how the family boundary will be established and blocks `final-ready` while material.

Allowed case dispositions are:

- `required` — current work needed for an accepted outcome, correctness, safety, authorization, compatibility, a shared invariant, or the critical verification path;
- `covered` — current evidence demonstrates the behavior or invariant;
- `research` — the relationship is plausible but not yet verified, with a bounded investigation and exit condition;
- `deferred` — related but not required now, with owner, authority, rationale, expiry, affected IDs, and re-entry condition;
- `not-applicable` — excluded with evidence explaining why the member or dimension does not apply;
- `duplicate` — represented by `canonical_case_id` and never treated as more complete than that canonical case.

Every case records `case_id`, `trigger_artifact_ids`, `member_ids`, `dimension`, `relationship`, `affected_artifact_ids`, `disposition`, `rationale`, `evidence_ids`, `verification_refs`, `equivalence_basis_ids`, `canonical_case_id`, `owner`, `authority`, `bound_or_expiry`, and `reentry_or_exit_condition`. Fields that do not apply use `null` or an empty list rather than disappearing, so coverage can be compared consistently.

Derive family membership from authoritative repository or domain evidence such as enums, schemas, configuration, catalogs, routes, public contracts, accepted decisions, feature files, tests, or call sites. Do not infer that visible examples are exhaustive. If authoritative membership cannot be established, record the family boundary as unverified and create a bounded research case.

Balanced coverage requires:

1. every known member appears in `accounted_members` or `unexplained_members`;
2. every relevant member/dimension combination has a case or belongs to an evidence-backed equivalence class;
3. comparable cases use the same disposition criteria and evidence standard;
4. sampling records the rule, common-mechanism evidence, representatives, and excluded boundary cases;
5. exceptions cite evidence or an authorized product decision;
6. required cases cannot be downgraded because of budget or effort;
7. duplicate cases resolve through their canonical case;
8. a refinement that changes membership, dimensions, mechanism, or invariants invalidates affected coverage and triggers a new sweep.

Validate balance mechanically where possible: `members` and `relevant_dimensions` contain no duplicates; every case member and dimension belongs to those declared sets; the cases cover every applicable member/dimension pair directly or through `equivalence_basis_ids`; `accounted_members` and `unexplained_members` are disjoint and together equal `members`; the corresponding dimension sets balance the same way; and `unexplained_exceptions` is empty before readiness. A `covered` case requires `verification_refs`; `not-applicable` requires exclusion evidence; `research` and `required` require an owner and finite bound; `deferred` requires the full deferral metadata; and `duplicate` requires a valid canonical case. Linguistic accuracy requires authoritative linguistic or human validation when it is part of the accepted outcome; catalog presence alone verifies completeness, not translation quality.

Do not generate a blind cross-product. Collapse truly equivalent cases, prioritize acceptance-relevant gaps, and keep improvements outside the accepted outcome deferred. Product-impacting expansion remains subject to the authority rules in `SKILL.md`.

## Knowledge-source definitions

Each role in `roles.yaml` has a stable identity and an observable activation contract:

```yaml
- role_id: behavior-boundary-reviewer
  speciality: user-visible boundaries and recovery
  trigger:
    all:
      - artifact_type: behavior
        changed_since_last_cycle: true
      - missing_relation: requires-review
  requires: [current-board, affected-behaviors, cited-evidence]
  may_propose: [behavior, finding, question, relation]
  completion: every affected behavior is reviewed with evidence or marked unverified
  blocking: a material user outcome has no defined failure or recovery behavior
  authority: propose-only
  default_bound: <time, cost, or attempt limit>
  fallback: local bounded review or human-required question
```

Triggers must be inspectable against board state. Avoid triggers such as “when useful” without naming who judges usefulness and from which evidence. A new role may be registered during a run when a board change exposes expertise the current registry does not cover. Record the event that justified its introduction.

An implication-sweep role may propose `case-family` and `case-disposition` updates. It should complete only when the family boundary is evidence-backed or explicitly unverified, all known members are accounted for, relevant dimensions have dispositions, and unexplained exceptions have become cases. A required case, unresolved research case, or missing family member creates an activation; the sweep itself does not authorize expanding product scope.

## Knowledge-source activation record

An agenda entry in `control.yaml` represents an opportunity, not a dispatch:

```yaml
- activation_id: ksar-023
  created_by_event: event-019
  base_version: 7
  trigger_ids: [finding-missing-recovery]
  role_id: behavior-boundary-reviewer
  island_id: onboarding-recovery
  question: What observable recovery behavior is required after partial completion?
  expected_delta: resolve or split question-recovery-contract
  affected_ids: [question-recovery-contract]
  prerequisites: []
  priority_signals:
    safety_or_authority: false
    central_contradiction: true
    information_gain: high
    unblocks: [behavior-retry, slice-recovery]
    evidence_ids: [event-019]
  bound: <deadline or attempt limit>
  state: eligible
  disposition: null
```

Agenda states are `eligible`, `selected`, `dispatched`, `completed`, `blocked`, `expired`, `superseded`, and `rejected`. Retain unselected activations until their trigger is no longer true or a control decision disposes of them.

The `executive` section of `control.yaml` holds priorities, focus decisions, activation records, and dispatch scheduling. The `meta-plan` section holds the current problem framing, reasoning method, global policies, evaluation criteria, and strategy changes. The controller records each focus decision with the candidate activation IDs, selected IDs, current board version, rationale, resource bound, strategy, expected delta, and later the observed delta. This is control evidence and supports stall detection and learning.

## Contribution return contract

Every delegated contribution returns:

```yaml
contribution_id: contribution-<stable-id>
board_id: <board-id>
base_version: <version received>
cycle_id: <cycle-id>
role_id: <stable role ID>
activation_id: <KSAR ID>
status: passed
operation: challenge
target_ids: [hypothesis-routing-by-risk]
artifacts: []
relations: []
case_family_updates: []
evidence:
  - id: evidence-<stable-id>
    source: <path, symbol, test, command, decision, or URL>
    result: <observation, not interpretation>
    version_or_retrieved_at: <version, commit, or timestamp>
    local_verification: <result or not-applicable>
uncertainty: <remaining uncertainty or none>
implication: <what changes if accepted>
new_trigger_conditions: []
changed_paths: []
```

Allowed `status` values are `passed`, `failed`, and `blocked`. Allowed operations are `propose`, `support`, `challenge`, `refine`, `split`, `connect`, `answer`, and `retract`.

`passed` means the role completed its bounded investigation, not that its proposal is accepted. `blocked` names the missing input, affected IDs, owner, and re-entry condition. `failed` records the attempted method, failure evidence, and whether one safe retry is meaningful.

Separate evidence from interpretation inside proposed artifacts. Unsupported material claims are `unverified`; they cannot satisfy readiness merely because the role is confident.

## Applying contributions

Before applying a contribution, the controller checks:

1. the return schema and role authority;
2. evidence existence, scope, version, and freshness;
3. that every target artifact or case-family ID exists or is explicitly proposed in the same contribution;
4. whether target artifacts or dependencies changed after `base_version`;
5. whether the operation creates or resolves a conflict;
6. whether case-family membership, relevant dimensions, equivalence evidence, or shared invariants changed;
7. whether new trigger conditions should create agenda entries, including required or research cases exposed by an implication sweep.

If the board advanced but the targets and dependencies did not change, the controller may apply the contribution and record `stale-base-validated`. If relevant state changed, mark it `rebase-required` and obtain a refreshed review. Never silently reinterpret stale output against the new board.

Applying a contribution creates one immutable event, updates the materialized snapshot, and increments the board version exactly once. Invalid contributions remain dispatch evidence but do not become domain-board facts.

Rollback is a new compensating event that identifies the reverted event or snapshot version and explains why. Never delete or rewrite event history to make the board appear as though the reverted decision never existed.

## Back-and-forth thread

A challenge thread is represented by relations and events rather than overwritten prose:

```text
hypothesis A
  <- challenges — finding B
  <- responds-to — refinement A2
  <- supports/challenges — evidence C
  <- supersedes — accepted hypothesis A3
```

The controller should schedule a response when the challenge is material and the original rationale can still add information. It should not force a reply when decisive evidence already falsifies the proposal or the proposal owner is unavailable and an equivalent role can assess it.

Open a disagreement room when independently supported artifacts conflict on facts, required behavior, authorization, or safety. A room records:

- room ID and affected artifact IDs;
- strongest supported form of each position;
- evidence that would discriminate between them;
- response and investigation activations;
- decision authority and owner;
- closure condition and re-entry condition;
- resolution, rationale, evidence, and any preserved dissent.

Do not close a disagreement through majority vote, confidence averaging, or last-writer-wins. Evidence may settle factual disagreements. The named authority settles value or tradeoff decisions after the evidence is visible.

## Sensitive evidence and retention

Persist only the evidence needed to support the board. Redact secrets, credentials, personal data, and unrelated sensitive content before writing, indexing, or forwarding it to a specialist. A dispatch may not widen its role's recorded path or data permissions merely because additional context would be convenient.

Deferred and historical artifacts remain available for traceability only while the temporary board exists. Cleanup may remove the entire board. If work must continue beyond that cleanup boundary, obtain authorization to promote a compact handoff or final deliverable; otherwise treat loss of temporary history as expected. On resume without the board, reconstruct current state from authoritative inputs and identify any event history, disagreement state, or deferred context that could not be recovered.

## Islands and joins

An island record includes `island_id`, scope, parent board version, artifact IDs, local agenda, shared invariant IDs, exit condition, owner, status, and join point. Specialists on separate islands may run concurrently only when they cannot mutate the same decision or invalidate one another's assumptions without a recorded join.

At a join point:

1. compare each island's base with the current parent version;
2. test every shared invariant;
3. preserve cross-island contradictions as new artifacts;
4. run the integration activation;
5. merge through normal versioned events.

A blocked island does not block siblings. Promote the block to the parent only when it affects a parent outcome, evaluation criterion, material decision, or shared invariant.

## Control signals and learning

When estimates help scheduling, `control.yaml` may track:

```yaml
signals:
  domain_difficulty:
    value: 8
    scale: fibonacci
    evidence_event_ids: [event-019, event-021]
  scope_confidence:
    value: medium
    evidence_event_ids: [event-018]
  solution_confidence:
    value: low
    evidence_event_ids: [event-019]
```

Use Fibonacci values `1, 2, 3, 5, 8, 13, 21` only as comparative difficulty signals. Confidence values are `low`, `medium`, or `high`. A change is invalid without causal event IDs. Do not combine these into an automatic truth or readiness score.

After an activation completes, record whether it produced the expected delta, a different useful delta, no material delta, or duplication. This history may inform later scheduling and role design. It cannot silently rewrite trigger rules or grant a role more authority.

## Cycle note

`iterations/<cycle-id>.md` contains only information useful for review and resumption:

- starting and ending board versions;
- observed delta and triggered activation IDs;
- selected focus and why;
- dispatches and contribution statuses;
- applied event IDs;
- implication sweeps opened, updated, or closed, including coverage balance changes;
- newly opened, changed, or closed disagreements;
- strategy shift or stall result;
- remaining agenda and next resume trigger.

Do not store private chain-of-thought. Record decisions, evidence, concise rationale, and observable outcomes.

## Readiness validation

Before `parent-ready`, verify:

- outcome, non-goals, evaluation criteria, and material constraints are explicit;
- central behaviors and live hypotheses are represented at the right abstraction levels;
- every material claim is evidence-linked, authorized, or explicitly unverified;
- current blockers and human-required questions name affected IDs and re-entry conditions;
- material changes have case-family boundaries recorded or evidence that no related family exists;
- known family members are accounted for under consistent relevant dimensions, with unexplained exceptions represented as open cases;
- no global block was inferred from an island-only problem;
- the agenda contains no unresolved activation that could materially reframe the parent.

Before `final-ready`, additionally verify:

- the requested downstream artifact exists and traces back to board artifacts;
- all joins and required current-snapshot reviews completed;
- every material case-family record is balanced; no case remains `required` or `research`, and every `duplicate` points to a canonical case with a nonblocking disposition;
- no unresolved material disagreement, stale contribution, or authority decision remains;
- rejected and superseded alternatives retain rationale and reopening conditions;
- the final completeness delta triggered no additional required activation.

Budget exhaustion, an empty current roster, or all dispatched agents returning are not readiness conditions.
