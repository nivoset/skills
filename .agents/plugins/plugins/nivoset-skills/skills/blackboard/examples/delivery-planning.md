# Delivery planning roster

Use when the outcome is roughly agreed and the board must answer: **what exactly was asked, how will we prove each ask is satisfied, and what is the shortest safe path to that proof?**

The central artifact is the **validation plan**. Every ask maps to at least one observable check; every planned piece of work maps back to an ask. Work with no ask is scope creep; an ask with no check is unverified.

## Core roster

Start with these; drop any whose trigger is not true on the current board.

| Role ID | Definitive goal | Trigger (board-observable) | Returns |
| --- | --- | --- | --- |
| `ask-ledger-keeper` | Produce one source-cited canonical ledger containing every explicit and implied ask. | Board has no ask ledger, or a user event, ticket, or decision added or changed an ask. | `goal`, `constraint`, `question` artifacts; one ID per ask with source citation. |
| `scope-guardian` | Ensure every planned item traces to an accepted ask; challenge or defer everything else. | Any `capability`, `slice`, `behavior`, or `hypothesis` lacks a `derived-from` link to an ask; a role proposes "while we're here" work; slice count grows without new asks. | `challenge` events, `deferred` proposals with owner/expiry/re-entry, `non-goal` proposals. Never deletes; the user decides scope. |
| `validation-planner` | Give every ask a runnable validation method, environment, data need, and observable pass condition. | Any ask lacks a validation entry, or a behavior or design change invalidates an existing entry. | Validation plan rows (see below), `question` artifacts for untestable asks. |
| `edge-case-hunter` | Account for every material boundary, failure, recovery, retry, concurrency, partial, and stale-state case. | A `behavior` changed or was added; a case family is `unverified` or unbalanced. | `behavior`, `finding`, case-family updates with dispositions. |
| `security-reviewer` | Give every affected trust boundary and material security risk an evidence-backed disposition and validation check. | A change touches identity, roles, user input, stored data, external calls, secrets, or a trust boundary. | `risk`, `finding`, required cases, security checks for the validation plan. |
| `path-planner` | Produce the shortest dependency-safe sequence that reaches end-to-end validation and defines every join point. | Validation plan has rows but no ordering, or a new dependency or blocker appears. | `slice`, `dependency`, island and join-point proposals. |

## Specialists by layer

Register only when the board exposes the layer. Each should add rows to the validation plan, not only findings.

### UI

| Role ID | Definitive goal | Trigger |
| --- | --- | --- |
| `ui-flow-reviewer` | Define a complete interaction flow with navigation, form behavior, confirmation, and reversal where required. | A user-facing `behavior` or screen is proposed or changed. |
| `ui-state-reviewer` | Give every affected view explicit loading, empty, error, partial, offline, and stale-state behavior. | A view or data-backed component appears without all states defined. |
| `accessibility-reviewer` | Ensure every interaction has testable keyboard, focus, assistive-output, contrast, motion, and error-announcement behavior. | Any new or changed interactive element. |
| `end-user-advocate` | Ensure the complete journey preserves user trust, agency, comprehension, accessibility, and recovery. | A failure path, permission denial, or irreversible action is user-visible. |
| `client-performance-reviewer` | Give every affected client journey measurable delivery, rendering, responsiveness, and perceived-latency limits. | New heavy dependency, large list, or media-heavy view. |

### Backend

| Role ID | Definitive goal | Trigger |
| --- | --- | --- |
| `api-contract-reviewer` | Give every changed interface a versioned, compatible success and error contract with executable checks. | An endpoint, event, or public schema is added or changed. |
| `data-model-reviewer` | Preserve every accepted data invariant through schema change, migration, backfill, and rollback. | A stored entity, field, or index changes. |
| `consistency-reviewer` | Define and verify transaction, idempotency, ordering, retry, and concurrency invariants for every affected write path. | Concurrent writers, async jobs, queues, or retried external calls. |
| `integration-reviewer` | Give every outside dependency a verified contract, bounded failure behavior, capacity limits, and safe test environment. | A dependency outside the repository is called. |
| `observability-reviewer` | Provide production signals that prove each relevant ask works and expose each material failure mode. | An ask's validation includes "works after release" or has no post-release signal. |

### CI/CD

| Role ID | Definitive goal | Trigger |
| --- | --- | --- |
| `pipeline-reviewer` | Place every automated check in a bounded pipeline stage with required gates, ordering, and run-time expectations. | Validation plan contains checks with no named pipeline stage. |
| `test-environment-reviewer` | Provide deterministic, authorized data and environments representative enough to execute every planned check. | A check needs data, external services, or an environment not yet available. |
| `release-reviewer` | Define a measurable staged release with safe ordering, proceed/hold/abort gates, and recovery. | A slice changes production behavior, data, or a public contract. |
| `supply-chain-reviewer` | Establish trusted provenance, pinning, least privilege, and secret handling for every changed delivery input. | New dependency, new pipeline step, or new credential. |
| `flake-reviewer` | Remove or bound nondeterminism, timing, ordering, network, randomness, and shared-state risk from required checks. | A planned check depends on time, network, randomness, or shared state. |

## Validation plan shape

Project the plan from board artifacts; one row per ask/check pair.

| Ask ID | Acceptance check | Method | Layer | Runs in | Depends on | Evidence when done | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ask-003` | Denied role sees an explanation and no data | Integration test + UI test | backend, UI | PR pipeline | `slice-authz` | test IDs, run link | planned |

Methods include unit, integration, contract, end-to-end, accessibility scan, security scan, load test, manual exploratory check, and post-release metric or alert. Prefer the cheapest method that observes the ask directly.

## Coverage checks before readiness

- Every ask has at least one check, and every check has a pass condition someone else could run.
- Every slice and capability traces to an ask; everything else is a recorded non-goal or deferral.
- Every check has a place to run and the data/environment it needs.
- Security and edge-case findings rated `required` appear as checks, not only as risks.
- The path reaches a first end-to-end validated slice before breadth work.
- Each layer specialist that triggered has contributed rows or recorded `not-applicable` with evidence.

## Typical disagreements

- **Scope guardian vs. specialist:** a reviewer proposes hardening beyond the ask. Resolve with evidence of risk; the user decides scope expansion.
- **Thorough vs. fast validation:** end-to-end coverage vs. pipeline time. Record cost and which asks lose direct observation.
- **Ship dark vs. ship complete:** flag-gated partial release vs. waiting for full slice. Tie to release and rollback evidence.
