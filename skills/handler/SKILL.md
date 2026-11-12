---
name: handler
description: Use when delivering a supplied bug or feature ticket through an existing branch, delegated research, implementation, and pull-request validation.
---

# Handler

Coordinate delivery of a supplied ticket on its verified existing branch where possible. The orchestrator owns scope, branch/worktree safety, phase state, integration, publication, and final claims.

**Required reference:** Read [references/workflow.md](references/workflow.md) before acting. Apply `worktree`, `cmux`, `fish-cli`, `linear-cli` (or the supplied tracker), `nlm-skill`, `fix-merge-conflicts`, `tdd`, and `babysitting-pull-requests`; apply test-naming and change-aware test classification guidance when changing tests. Prefer CI for scenario reproduction and capture; when unsuitable, use task-local Docker, then `pnpm start`, then documented `dev`, with unused-port and safe-target checks.

**Keep the delivery in `/goal` mode:** Start `/goal` with the supplied ticket and the completion target `ready-for-human`. Do not end the goal at branch selection, push, PR creation, or CI submission. Keep it active through relevant service lifecycle/up/down validation, exact-SHA checks, accessible scenario proof, review resolution, and PR-ready notification. For PR monitoring, also use `babysitting-pull-requests`; its watch limits and stop conditions apply. A blocker or expired watch window is not goal completion: report the last observed state and awaited input, without claiming success.

## Phase gates

1. **Research:** resolve ticket, active PR/branch, worktree ownership, behavior inventory, and independent NotebookLM/source evidence. Missing docs alone do not block clear behavior; ambiguity does.
2. **Conflicts:** plan branch/file and service-contract conflicts with evidence, owners, and validation before changes; then repair with exclusive writer ownership and hand off the integrated SHA. Clean/up-to-date is `not-needed`; conflict repair never pushes.
3. **Delivery:** reread at integrated SHA, establish focused red→green evidence under TDD lane ownership, and, when relevant, validate task-local services and documented up/down requests. Prefer CI for scenario reproduction/capture; if unsuitable, use task-local Docker, then `pnpm start`, then documented `dev`, after verifying local ports are unused and the target is safe. Local demonstrations are valid scenario evidence, not CI checks. Review and push/update the selected branch; create or update its PR as specified in the workflow. Preserve existing fixes.
4. **CI:** run required checks in CI against exact SHAs; use scenario proof from CI when available or the safe local fallback order above. Pending, failed, missing, inaccessible, skipped-required, or stale-SHA checks are not pass.
5. **Ready for human:** only after required checks, proof, review findings, and behavior inventory pass; mark PR ready and notify. Never approve, merge, or move ticket state automatically.

Keep one resumable cmux workspace per ticket, publish phase/blocker/source/service state, and keep planning/proof scratch under ignored `.tmp/<TICKET>/`. Keep local evidence visible in the same-pane `<TICKET> proof` subtab. Preserve unrelated dirty work; never reset, clean, stash, force-checkout, or stage it. A blocker must state what failed or is prohibited, why it prevents the next gate, observed evidence, owner, and exact next action. Stop only dependent work; continue independent permitted work. A documentation/source gap does not block clear behavior.

## Handoff

Return selected branch/base/worktree, ticket and PR state, behavior/source evidence, lane results, exact baseline/candidate SHAs, checks and proof links, workspace state, blockers, risks, and next action. Include the per-gate evidence table defined in the workflow. Do not claim an unobserved gate.
