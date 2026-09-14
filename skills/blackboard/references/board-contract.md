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

Prefer `supports`, `challenges`, `responds-to`, `refines`, `depends-on`, `blocks`, `answers`, `derived-from`, `supersedes`, `duplicates`, and `requires-review`. Preserve both nodes when creating a relation. Semantic cleanup may change the derived snapshot only after equivalence, traceability, and reversibility have been checked; the events remain immutable.

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
3. that every target ID exists or is explicitly proposed in the same contribution;
4. whether target artifacts or dependencies changed after `base_version`;
5. whether the operation creates or resolves a conflict;
6. whether new trigger conditions should create agenda entries.

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
- no global block was inferred from an island-only problem;
- the agenda contains no unresolved activation that could materially reframe the parent.

Before `final-ready`, additionally verify:

- the requested downstream artifact exists and traces back to board artifacts;
- all joins and required current-snapshot reviews completed;
- no unresolved material disagreement, stale contribution, or authority decision remains;
- rejected and superseded alternatives retain rationale and reopening conditions;
- the final completeness delta triggered no additional required activation.

Budget exhaustion, an empty current roster, or all dispatched agents returning are not readiness conditions.
