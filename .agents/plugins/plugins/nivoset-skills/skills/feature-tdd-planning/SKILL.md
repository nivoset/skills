---
name: feature-tdd-planning
description: Use when a repository needs a `.feature-tdd` planning folder, feature-driven TDD planning artifacts, scenario grouping, execution ordering, or traceability documentation.
---

# Feature TDD Planning

Create the planning and execution-documentation foundation for feature-driven TDD. This skill plans work; it does not implement product code or silently invent requirements.

## Before writing

1. Locate feature files, requirements, contracts, ADRs, schemas, repository policies, tag catalogs, and selector adapters.
2. Check for an existing `.feature-tdd/` or documented equivalent.
3. Reuse an existing canonical root only when its README and ledger identify it and the complete artifact set is present. Otherwise create `.feature-tdd/`.
4. Preserve evidence separately from interpretation. Cite stable paths and sections.
5. Record missing authoritative inputs as blockers or `@human-required`; never guess.

## Canonical planning files

Create these files with real, repository-specific content:

```text
.feature-tdd/
├── README.md
├── input-manifest.yaml
├── scenario-groups.yaml
├── execution-order.yaml
├── execution-ledger.yaml
├── traceability.yaml
└── feature-review.md
```

Create `runs/<scenario-id>/` artifacts only when execution begins. Keep planning and execution schemas separate.

## Required contents

- `README.md`: purpose, canonical-root declaration, scope/non-goals, artifact schema map, resume rules, and source-of-truth boundaries.
- `input-manifest.yaml`: normalized input paths, content hashes, scenario IDs, tag catalog, selector adapter, and unresolved inputs.
- `scenario-groups.yaml`: one primary group per scenario, purpose, responsibility boundary, shared fixtures/contracts, risks, dependencies, and citations.
- `execution-order.yaml`: dependency DAG, explicit versus inferred edges, confirmation owner/evidence, cycle results, and selected test selectors.
- `execution-ledger.yaml`: schema version, scenario states, attempt IDs, leases, artifact hashes, blockers, and append-only transition history.
- `traceability.yaml`: bidirectional links from requirement/ADR → feature → scenario → tag → responsibility → test → implementation.
- `feature-review.md`: review scope, obligations, expected evidence, findings, owner, and re-entry condition.

## Safety gates

- Do not overwrite a valid root; report what is missing or stale.
- Do not mark inferred dependencies confirmed without evidence.
- Do not mark scenarios complete during planning.
- Do not create implementation tickets unless explicitly requested.
- Validate unique canonical scenario IDs, known tags, resolvable paths, and acyclic ordering before declaring the plan ready.
- End with `parent-ready`, `blocked`, or `final-ready`; `final-ready` requires post-draft completeness review.
- Do not stop after creating a subset of `.feature-tdd/` files. Reconcile all canonical artifacts and validate their cross-links before handoff.
- The terminal planning outcome is `tdd-orchestration-ready`: the orchestrator has a complete, valid, startable execution order and explicit first action. This is a handoff state, not implementation completion.

Load `feature-tdd-orchestrator`, `feature-tdd-validator`, `bdd`, and `tdd` when their detailed contracts or execution steps are needed.

## TDD orchestration handoff

Before declaring `tdd-orchestration-ready`, confirm that `feature-tdd-orchestrator` can start without inventing missing inputs. Record the handoff in `.feature-tdd/README.md` and the execution ledger with `handoff_id`, `source_manifest_id`, `contract_version`, `orchestrator_confirmation` (`startable` or `blocked`), confirmation evidence, owner, deadline, and re-entry condition. The handoff must identify:

- the canonical `.feature-tdd/` root and validated artifact versions;
- the first executable scenario or test slice and its selector;
- dependency order, blockers, and the next join point;
- the execution-ledger state and resume/checkpoint rules;
- the evidence location for validation and feature review;
- the clean-worktree or baseline snapshot, ticket/acceptance-criteria mapping, authorized write owner, and mutation paths required by `tdd` before Red begins;
- the first TDD action, its selector, deterministic oracle, and exact artifact to write.

If any required input is missing, stale, unresolved, or unvalidated, end `blocked` with an owner and re-entry condition. Do not claim `final-ready` or startability from a partial artifact set. Once the orchestrator confirms startability, stop planning and hand off; implementation belongs to `tdd`.
