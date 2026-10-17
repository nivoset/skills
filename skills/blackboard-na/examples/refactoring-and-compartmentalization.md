# Refactoring and compartmentalization overlay

Use when behavior should remain stable while responsibilities, dependencies, or ownership boundaries change. The central artifact is an evidence-backed boundary model plus an incremental, reversible transition plan.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `current-behavior-cartographer` | Prevents unknown behavior and consumers from being lost during movement. | Moved or re-bounded code lacks evidence-linked behavior or consumer coverage. | Behavior and consumer inventory citing tests, interfaces, call sites, and read-only runtime evidence. | A material behavior or consumer remains unknown. |
| `compartment-boundary-analyst` | Prevents a new boundary from preserving hidden cycles or split ownership. | A boundary crosses shared dependencies, cycles, or unclear ownership. | Competing boundary alternatives, dependency evidence, cohesion and ownership findings. | Compartments retain unexplained cycles or bidirectional authority. |
| `seam-contract-reviewer` | Makes every new, moved, or public seam testable and compatible. | A cross-boundary or externally consumed call, event, type, schema, or adapter is added or relocated. | Inputs, outputs, failures, versioning, deprecation window, and contract checks. | A seam lacks a testable compatibility contract. |
| `state-ownership-reviewer` | Prevents state and consistency authority from being split across compartments. | Mutable state, transactions, lifecycle, or caches span a proposed boundary. | Ownership and consistency invariants plus failure and recovery behaviors. | Shared mutation has no single authority or accepted consistency rule. |
| `refactor-cutover-reviewer` | Replaces a big-bang move with independently verifiable, reversible slices. | A target design lacks independently verifiable transition slices. | Slice order, join points, deletion gates, rollback checks, and proceed/hold criteria. | No slice can be validated independently or safely reversed. |
| `architecture-regression-guard` | Stops prohibited coupling from silently returning after delivery. | An accepted dependency direction or compartment rule lacks an automated check. | Architecture-test rows and prohibited-dependency rules. | The old coupling can silently return. |

## Role relationships

`seam-contract-reviewer` specializes `api-contract-reviewer`; `state-ownership-reviewer` specializes `consistency-reviewer`; `refactor-cutover-reviewer` specializes `path-planner` and, for production rollout, `release-reviewer`. Reuse `scope-guardian`, `validation-planner`, and `observability-reviewer`. Add the performance overlay when moved boundaries affect an accepted budget or hot path.

## Validation additions

Characterize accepted behavior of moved code and its consumers; add contract and dependency-direction checks; capture relevant performance and operational baselines; validate each transition slice before deleting the old path; and prove final dead-code removal. Sampling needs a recorded equivalence basis and excluded boundaries.

## Implication sweeps

Cover consumers of moved symbols, public formats, configuration, build rules, entry points, dashboards, state, transactions, caches, lifecycle hooks, and error conventions across behavior parity, compatibility, performance, ownership, observability, and recovery.

## Tradeoffs

- Hard boundary now vs. transitional adapters and temporary duplication.
- Preserve an observed defect vs. correct it during the move.
- More compartments and ownership clarity vs. more seams and coordination cost.

Route tradeoffs to `tradeoff-broker`; the named authority decides.
