# Data migration overlay

Use when authoritative data changes shape, location, meaning, ownership, or storage mechanism. The central artifact is a migration ledger mapping every population and invariant to transformation, verification, recovery, consumers, and ownership evidence.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `source-data-profiler` | Prevents planning from schemas or clean samples instead of real populations. | Scope lacks read-only, aggregate, redacted evidence from an authorized source. | Counts, distributions, nulls, anomalies, relationships, and population case families. | A material population or anomaly rate is unknown. |
| `transformation-invariant-reviewer` | Prevents data from moving successfully while changing its meaning or precision. | A source-to-target mapping is added or changed. | Mapping rules, proposed defaults/precision, invariant checks, losses, and counterexamples. | Required data lacks a mapping or is dropped/lossy without authorized disposition. |
| `migration-consumer-compatibility-reviewer` | Protects readers while old and new shapes coexist. | A stored shape, location, or meaning changes while any reader may remain. | Consumer inventory, mixed-version contract, cache/index/report impacts, and retirement evidence. | A reader of a changed population is unaccounted for. |
| `live-write-consistency-reviewer` | Prevents live writes from being lost, duplicated, reordered, or overwritten. | Migration overlaps writes, queues, replication, or retries. | Ordering, dual-write, replay, idempotency, and race-condition cases. | Live changes can be corrupted without detection. |
| `reconciliation-evidence-reviewer` | Proves semantic correctness instead of trusting job success or row counts. | Validation lacks repeatable per-population semantic comparison. | Reconciliation queries, checksums, semantic comparisons, and exception ledger. | Completeness and correctness cannot be proved per population. |
| `migration-recovery-reviewer` | Defines safe behavior before, during, and after the point of no return. | A step mutates authoritative data or crosses a rollback boundary. | Checkpoints, restart, quarantine, rollback/roll-forward, proceed/hold/abort thresholds, named authority, and rehearsal evidence. | Partial failure lacks bounded recovery or authorized irreversibility. |
| `data-privacy-retention-reviewer` | Keeps migration access and retention from violating privacy or residency obligations. | Personal, regulated, retained, deleted, or region-bound data moves. | Minimization, retention/deletion, access, residency, and redaction checks. | Handling authority or required controls are unresolved. |

## Role relationships

`live-write-consistency-reviewer` specializes `consistency-reviewer`; `migration-recovery-reviewer` specializes migration aspects of `data-model-reviewer` and `release-reviewer`; `data-privacy-retention-reviewer` specializes `privacy-reviewer` and `data-protection-reviewer`. Reuse `observability-reviewer` for post-cutover exceptions and the performance overlay when migration load shares resources with live traffic.

## Validation additions

Use authorized representative, anomalous, boundary, and scale data. Test dry run, restart, duplicate execution, partial failure, mixed-version readers, concurrent writes, reconciliation, and rollback. Turn each check into a validation-plan row keyed to an ask ID and monitor owned exceptions after cutover.

## Implication sweeps

Cover each entity, consumer, tenant class, lifecycle state, schema version, region, relationship, derived value, and retained/deleted population across mapping, ordering, compatibility, referential integrity, idempotency, authorization, retention, reconciliation, and recovery.

## Tradeoffs

- Online migration vs. a maintenance window.
- In-place transformation vs. copy, compare, and switch.
- Maximum throughput vs. continuous verification and smaller failure radius.
