# Disagreement room: project identity

## Owner
Board owner (current agent).

## Affected scope
The `level-1-thinking` level-1 skill and all local-run instructions.

## Conflict
Two public projects use the Laya name:

1. `NandhaKishorM/laya` paired with model `convaiinnovations/laya`: Python package `laya`, Python SDK, and documented `laya-serve` HTTP endpoint. This was locally verified at package `0.3.20`.
2. `receptron/laya`: a separate Node/ONNX implementation with different install, lifecycle, bundle, and compatibility documentation.

## Evidence
- Local SDK/HTTP run: `local-evidence.md`.
- Research contribution from `LAYA-JEV-RESEARCH`: cites `receptron/laya` and explicitly reports its differing Node/ONNX behavior.
- Python project source/model pairing: `data/laya/facts.md`.

## Decision for this revision
Do not merge claims across projects. The skill must identify the project by repository/model/package before giving commands. It covers the Python project as the verified local path and records the Node/ONNX project as a separate alternative requiring its own verification.

## Re-entry condition
If the requester names a repository, package, or model ID, add or split project-specific data and rerun the relevant local verification.
