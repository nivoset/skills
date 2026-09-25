# Blackboard starter rosters

These examples suggest knowledge sources for common blackboard runs. They are starting points, not fixed teams: select only roles whose triggers are true, and reassess the roster after every material board change. All roles are `propose-only`. Every registered actor must copy a definitive goal from the example or refine it for the bounded assignment. The goal states the observable result the actor must produce and is the standard for `passed`; speciality and activity alone are insufficient.

## Planning stages

| File | Use when | Central output |
| --- | --- | --- |
| [delivery-planning.md](delivery-planning.md) | The outcome is roughly agreed and the team must plan how to deliver and prove it. | Ask ledger, validation plan, sequenced path to green. |
| [product-strategy-planning.md](product-strategy-planning.md) | The idea, users, risk posture, or tradeoffs remain open. | Product stance, user stance, security posture, tradeoff records. |

Typical flow: run strategy planning until `parent-ready`, then carry accepted stances, non-goals, and security posture into delivery planning as constraints.

## Domain overlays

Add an overlay when its trigger is present. Reuse applicable core roles such as `scope-guardian`, `validation-planner`, `tradeoff-broker`, and `observability-reviewer`; do not dispatch duplicates under new names. An overlay role that specializes a core role replaces it within the overlay scope: record `specializes: <core-role-id>` in `roles.yaml` and do not dispatch both.

Overlay returns use board-contract artifact types such as `behavior`, `finding`, `risk`, `alternative`, `evidence`, `question`, `case-family`, and `case-disposition`. Every validation addition becomes validation-plan rows keyed to ask IDs. Matrices, ledgers, budgets, and models are projections of those artifacts, not new artifact types.

Before dispatch, complete each starter role with required inputs, a finite time or attempt bound, and a fallback. If evidence cannot be obtained within the bound, return `research`, `blocked`, or `human-required`; never treat silence as approval.

Validation agents propose checks but do not gain authority to run them. Any check that can mutate data, affect a shared or live system, incur material cost, consume an outside quota, expose sensitive data, or contact real users requires a named owner, approved environment, explicit authority, blast-radius limit, abort threshold, and redacted evidence.

- [Refactoring and compartmentalization](refactoring-and-compartmentalization.md)
- [Data migration](data-migration.md)
- [External integration](external-integration.md)
- [Authentication and permissions change](auth-permissions-change.md)
- [Platform and infrastructure change](platform-infra-change.md)
- [Performance and scaling](performance-scaling.md)
- [Localization and multi-variant](localization-multi-variant.md)
