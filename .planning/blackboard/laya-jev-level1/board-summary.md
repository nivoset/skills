# Blackboard summary: laya-jev-level1

## Resolved parent scope and non-goals
Create and validate a level-1 skill for local Laya/Jev integration. Cover the verified Python runtime and clearly distinguish the separate Node/ONNX runtime. Non-goals: changing upstream Laya/Jev, publishing or committing the skill, or claiming semantic equivalence without a fixed-corpus probe.

## Claims, evidence, gaps, decisions, unresolved questions
- Python `laya` 0.3.20 import, CLI routing, CPU SDK prediction, and `laya-serve` `/health` plus `/v1/systemone` passed locally. Evidence: `local-evidence.md`.
- Structural skill validation passed: `pwsh ./scripts/validate-skills.ps1` -> 26 directories.
- The model emitted an invalid/out-of-range temperature warning during the CPU prediction; confidence is treated as uncalibrated.
- Project identity conflict resolved by scoping this revision to the documented Python pairing and adding `data/laya/identity.md`; other Laya projects are explicitly out of scope.
- `blackboard_plan` is unavailable; deterministic board fallback used. This remains a tooling blocker for formal package-level readiness.
- Other Laya implementations are out of scope. Owner: requester. Re-entry: name the exact repository/package before expanding scope.

## Selected roles and why
- `LAYA-JEV-RESEARCH`: covered protocol, limits, security, pinning, risk gating, and project identity.
- `LAYA-LOCAL-RUNNER`: covered installation and local execution.

## Capability/feature hierarchy
- Capability: identify implementation and execution target.
  - Feature: Python in-process SDK.
  - Feature: Python local HTTP adapter.
  - Feature: explicitly separated hosted Jev target.
- Capability: safe compatibility integration.
  - Feature: fixed-corpus schema/semantic probe.
  - Feature: pinning, auth, limits, retries, and deterministic side-effect gates.

## Ticket drafts with acceptance behavior
1. Level-1 skill: an agent selects the correct package/repository before giving commands and records target mode.
2. Local execution: Python SDK and HTTP smoke commands are documented and reproduce the verified results.
3. Compatibility guardrails: the skill requires pinning, loopback/auth defaults, bounded requests, and fixed-corpus validation.

## Dependency and parallelization plan
Identity precedes runtime selection. Runtime smoke verification and research can run in parallel. Compatibility guidance joins both before skill publication.

## Assumptions, deferred work, and re-entry conditions
- Assumption: this revision documents the Python runtime as the verified default because it was the one executed locally.
- Deferred: full Node/ONNX inference and a hosted-vs-local semantic corpus. Re-enter when the requester identifies the target package or asks for Node/hosted parity.
- Deferred: formal blackboard package readiness until `blackboard_plan` is installed or an authorized replacement is available.

## Readiness verdict
`blocked` for formal blackboard final-readiness because `blackboard_plan` is unavailable. The requested skill artifact is structurally valid and the Python local path is operationally verified.
