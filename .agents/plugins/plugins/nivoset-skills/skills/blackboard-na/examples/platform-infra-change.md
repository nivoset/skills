# Platform and infrastructure change overlay

Use when services, runtime environments, regions, networks, delivery paths, or shared platform capabilities change. The central artifact is a dependency and trust-boundary model joined to measurable rollout, rollback, cost, and steady-state validation.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `platform-dependency-reviewer` | Finds consumers, shared invariants, and failure propagation before a shared change lands. | A service, region, runtime, shared component, or outside dependency changes. | Dependency graph, consumers, compatibility, failure propagation, and join points. | A consumer or shared invariant is unaccounted for. |
| `platform-reliability-capacity-reviewer` | Makes operating limits, failure domains, and cost explicit. | An artifact changes a service objective, quota, throughput path, failure domain, or lacks these for an affected component. | Objective impact, capacity model, cost ceiling, resilience and load checks. | Required limits or failure behavior remain unknown. |
| `platform-identity-access-reviewer` | Limits workload, operator, control-plane, automation, and emergency privileges. | Workload identity, operator access, control-plane rights, or automation credentials change. | Principal/permission/resource matrix and emergency-access checks. | Excess privilege lacks authorized disposition. |
| `platform-network-boundary-reviewer` | Detects unintended routes and exposures, not only expected connectivity. | Ingress, egress, naming, routing, filtering, peering, or public exposure changes. | Allowed-flow model, segmentation, and negative-connectivity checks. | An unintended route or unknown exposure remains. |
| `platform-data-protection-reviewer` | Proves restore, isolation, residency, deletion, and key ownership. | Storage, replication, backup, restore, encryption, region, or tenancy changes. | Classification, key ownership, restore, deletion, residency, and isolation evidence. | Restore or protection requirements are unproved. |
| `platform-supply-chain-reviewer` | Prevents untrusted artifacts and excessive delivery rights from reaching production. | Images, modules, build steps, registries, or delivery credentials change. | Provenance, pinning, scanning, signing, token-scope, and reproducibility evidence. | An unsafe artifact or delivery path remains. |
| `platform-change-safety-reviewer` | Establishes safe rollout gates and an abort point before cutover. | A cutover, replacement, or irreversible production mutation is proposed. | Staged gates, compatibility window, proceed/hold/abort thresholds, and recovery rehearsal. | No safe abort point exists. |
| `platform-observability-incident-reviewer` | Makes new failure modes detectable, localizable, and owned. | A component or failure mode lacks signals or response ownership. | Logs, metrics, traces, synthetic checks, alerts, runbook, and escalation owner. | Operators cannot respond within the required objective. |

## Role relationships

These roles specialize overlapping `infrastructure-reviewer`, `identity-access-reviewer`, `data-protection-reviewer`, `supply-chain-reviewer`, `release-reviewer`, `observability-reviewer`, and `incident-readiness-reviewer` work within platform scope. Reuse `test-environment-reviewer` when pre-release topology is insufficient, `viability-reviewer` for operating-cost evidence, and `tradeoff-broker` for availability/cost, standardization/autonomy, speed/evidence, or residual-risk decisions.

## Validation additions

Every ask gets a runnable pre-release check where an approved representative environment exists and a production signal where relevant. Otherwise record bounded research and its exit condition. Rollout gates have numeric proceed/hold/abort thresholds. Any resilience, load, negative-connectivity, or recovery exercise that could affect shared systems requires explicit authority and blast-radius controls.

## Implication sweeps

Cover consumers, environments, regions, failure domains, network paths, identities, storage classes, deployment paths, and operating states across compatibility, reliability, security, data protection, observability, and recovery.

## Tradeoffs

- Availability and redundancy vs. cost and operational complexity.
- Standardized shared platform vs. team autonomy and isolation.
- Fast rollout vs. staged evidence and recovery confidence.
