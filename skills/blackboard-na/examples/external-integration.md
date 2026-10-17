# External integration overlay

Use when accepted outcomes depend on a service, event source, data provider, or callback outside the team's control. The central artifact is a verified dependency contract covering capabilities, trust boundaries, failures, limits, operations, and exit strategy.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `external-contract-verifier` | Replaces assumptions from documentation with versioned local evidence. | An accepted capability lacks local evidence, or a pinned version has a deprecation/change notice. | Retrieved version/time, request, response, event, and error evidence from schemas, safe probes, or contract tests. | A critical capability or version assumption remains unverified. |
| `credential-trust-boundary-reviewer` | Limits credentials and data crossing a boundary the team does not control. | A credential, delegated identity, privileged scope, or data transfer appears. | Scope matrix, secret lifecycle, isolation, rotation, revocation, and redaction checks. | Least privilege or credential recovery is undefined. |
| `integration-failure-semantics-reviewer` | Makes ambiguous completion, retries, outages, and degraded operation safe. | An outside call enters a user- or business-critical path. | Timeout, retry, idempotency, reconciliation/source-of-record, outage, and degraded-mode behaviors. | Failure lacks safe observable behavior. |
| `callback-integrity-reviewer` | Protects inbound asynchronous traffic from forgery, replay, duplication, and reordering. | Inbound callbacks or asynchronous status updates are introduced. | Authenticity, replay, duplication, ordering, and event-contract checks. | Events cannot be authenticated or safely deduplicated. |
| `dependency-capacity-reviewer` | Prevents quota, latency, or price limits from invalidating the plan. | Expected traffic lacks comparison with outside limits or pricing. | Capacity, quota, rate-limit, latency, and cost evidence. | Critical-path capacity or cost cannot be bounded. |
| `provider-exit-reviewer` | Preserves continuity when a critical dependency owns authoritative data or has no substitute. | A dependency on an accepted-outcome critical path holds authoritative data or lacks an export/substitute path. | Export tests, substitution alternatives, continuity plan, and abstraction boundaries. | Required recovery or exit is unavailable. |

## Role relationships

Contract, failure, callback, and capacity specialists replace overlapping `integration-reviewer` and `consistency-reviewer` work in this scope. `credential-trust-boundary-reviewer` specializes `security-reviewer`; `provider-exit-reviewer` specializes lock-in aspects of `viability-reviewer`. Reuse `privacy-reviewer` and `compliance-reviewer` for regulated transfers, plus `test-environment-reviewer`, `observability-reviewer`, `incident-readiness-reviewer`, and `end-user-advocate` when triggered.

## Validation additions

Use pinned contract tests and sandbox or read-only probes. If no safe environment or evidence exists, create bounded `research` or `human-required` work. Fault scenarios cover throttling, malformed results, timeouts, retries, duplicates, outages, credential revocation, production telemetry, and degraded user behavior. Production side effects, material cost, real credential rotation, or quota risk require explicit authority.

## Implication sweeps

Cover every endpoint/event, version, credential scope, tenant, region, callback type, and outage mode across success, error mapping, timeout, retry, idempotency, ordering, limits, privacy, observability, recovery, and deprecation.

## Tradeoffs

- Dependency-specific implementation vs. portability layer.
- Synchronous freshness vs. asynchronous resilience.
- Fail closed vs. degraded operation.
