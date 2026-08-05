---
name: qa
description: Use when reviewing a branch, pull request, diff, subsystem, workflow, or application area through eleven parallel quality reviewers covering correctness, clarity, architecture, testing, resilience, security, performance, UX, and operations.
---

# QA

## Purpose

Run a broad, evidence-first quality review through eleven independent specialist lanes. The parent agent owns scope resolution, dispatch, verification, deduplication, prioritization, and final synthesis. This is a review workflow: do not modify the target during the initial pass.

Read [references/reviewer-lanes.md](references/reviewer-lanes.md) before dispatching. It is the authoritative lane catalog, checklist, examples, and ownership map.

## When to use

- Review the active branch or pull request against its discovered target branch.
- Review a named diff, commit range, subsystem, workflow, screen, integration, or data model.
- Find defects, omitted requirements, weak tests, security gaps, compatibility risks, or disproportionate engineering.
- Produce one prioritized report with explicit coverage across all eleven lanes.

Do not make repairs in the initial review. If the user wants implementation, hand accepted findings to a separate coding workflow.

## Resolve the review bundle

1. Resolve the target from user context. Prefer a PR and its base, then the active branch versus `dev`, `develop`, or the repository default branch. For an app-area request, resolve the named path, module, route, workflow, screen, job, integration, or data boundary.
2. Capture the pre-review working-tree status. Preserve unrelated user changes.
3. For branch or PR reviews, compute the merge base and inspect only the source-vs-target diff, changed paths, relevant commits, requirements, contracts, and nearby tests. For scoped reviews, map the requested area and its direct consumers.
4. Run the smallest non-mutating baseline check that establishes the target is inspectable. Record commands and results.
5. Build a shared review bundle containing scope, base/source refs, changed paths, requirements, relevant files, tests, schemas, API contracts, configuration, and baseline results.

Never invent findings for an empty or unresolved diff. For a whole-area request, state the area and review boundaries explicitly.

## Dispatch all eleven lanes

Launch one read-only subagent for every lane in the catalog, in parallel when possible. Do not omit a lane because it appears irrelevant; give it the bundle and require `not_applicable` when no meaningful surface exists. Keep each agent inside its assigned concern, while allowing the intentional secondary ownership listed in the catalog.

Every prompt must include:

- the review intent and exact scope;
- source, target, merge base, or scoped area;
- relevant changed paths, tests, contracts, and requirements;
- the assigned lane only, including its checklist and examples;
- read-only and isolation constraints;
- the finding schema and evidence threshold;
- a requirement to return an empty finding list when nothing actionable is found.

Do not let subagents post external comments, edit files, create tests, change configuration, or share mutable databases, ports, caches, fixtures, or browser state.

## Subagent output

Require JSON-shaped output or an equivalent structured result:

```text
status: complete | not_applicable
lane: <catalog id>
findings:
  - id: <stable lane-local id>
    title: <specific failure or risk>
    severity: critical | high | medium | low
    confidence: confirmed | high | likely | uncertain
    locations: [{path, line, symbol}]
    evidence: <code, test, contract, or command evidence>
    impact: <user, business, security, or operational impact>
    expected: <what should happen>
    suggested_fix_boundary: <smallest safe resolution boundary>
    suggested_tests: [<behavior-focused test ideas>]
notes: <scope limitations or useful observations>
```

Reject findings that are speculative, outside scope, duplicate, purely stylistic without material review impact, or unsupported by evidence. A finding may use static proof when a focused runtime reproduction is not practical.

## Parent verification and synthesis

For each candidate finding:

1. Re-read the relevant code, test, contract, or configuration.
2. Confirm that it belongs to the requested scope and is not pre-existing when reviewing a diff.
3. Verify with the narrowest available command, focused test, static proof, or explicit statement that verification is unavailable.
4. Merge duplicates while preserving all agreeing lane IDs and the primary owner.
5. Downgrade or reject claims whose evidence does not support the stated severity.
6. Keep the smallest safe fix boundary; do not turn review findings into an unsolicited refactor.

Use severity based on impact: `critical` for likely security/privacy breach, corruption, financial loss, or irreversible critical failure; `high` for important workflow breakage or silent loss; `medium` for meaningful incomplete behavior or test gaps; `low` for limited-impact issues. Use confidence separately.

## Optional test-validation follow-up

After presenting the initial review, ask whether the user wants test validation. Only after approval, select findings that are testable and dispatch isolated test-building subagents. Each test agent receives one finding, creates the narrowest temporary or requested regression test, runs it, and reports whether it fails for the expected reason. The parent reviews the test and output, cleans up temporary artifacts unless the user asks to keep them, and updates the report. Do not silently turn test validation into a production fix.

## Final report

Return one report with:

```md
# QA Report
## Executive summary
## Scope and baseline
## Prioritized findings
## Coverage matrix
## Testing and validation gaps
## Commands and evidence
## Rejected or unverified candidates
## Follow-up
```

For each accepted finding include title, severity, confidence, primary lane, secondary lanes, location, evidence, impact, expected behavior, fix boundary, and suggested tests. The coverage matrix must list all eleven lanes with status, primary concerns examined, finding count, and limitations. State explicitly when a lane is `not_applicable`.
