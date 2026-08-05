---
name: vette
description: Use when reviewing an implementation plan, codebase, feature area, or pull request for likely defects, missed requirements, weak tests, security gaps, data risks, UX mismatches, or reliability issues before or after implementation.
---

# Vette

## Purpose

Find, validate, prioritize, and document likely product and engineering risks before they become defects. This skill is the orchestrator: it owns scope resolution, diff or repo mapping, parallel topic-lane review, grounding, deduplication, verification, and final report assembly.

The workflow matches the Pi `/vette` beta command: eleven focused topic lanes run in parallel, findings are grounded in changed paths, then a synthesis pass verifies, deduplicates, and reports.

## When to Use

- Use when the user asks for a risk review, defect review, quality sweep, breakage review, or pre-implementation critique.
- Use when the user provides a plan and wants missed cases, testing gaps, or implementation risks.
- Use when reviewing a branch, PR diff, named subsystem, or whole codebase.
- Use when the user wants one merged report instead of disconnected lane notes.
- Do not use when the user wants implementation or repairs instead of investigation, unless running explicit owner repair mode.

## Scope Inputs

Default to a whole-codebase review unless the prompt narrows scope.

Resolve freeform scope into one or more selectors:

- `path`
- `module`
- `route`
- `workflow`
- `screen`
- `data model`
- `job`
- `integration`
- `permission boundary`
- `implementation plan`
- `pull request` or `branch diff`

State the resolved scope, base ref, and changed-path list near the top of the report.

## Core Rules

- Inspect the plan and codebase before asking the operator questions.
- Prefer read-only investigation.
- You may run existing tests, scripts, and static checks that do not change repo-tracked files.
- Do not commit changes unless owner repair mode explicitly requires fixes.
- Do not apply fixes in doc mode or external review mode.
- Ground every finding in changed paths when reviewing a diff. Reject findings that reference files outside the reviewed diff unless whole-repo scope was explicitly requested.
- Never review an empty diff. If there are no changed files, stop with a blocked report instead of inventing findings.
- If a useful failing test would be expensive or invasive, describe it in the finding instead of creating it.
- If a temporary local test would clearly improve validation, ask first unless PR comment mode already expects repro tests.
- If a trial test is created with approval, document the file, test name, purpose, and expected failure behavior. Clean up temporary tests unless the user asked to keep them.
- Follow the repo's existing testing standards and harnesses whenever they exist.
- Stop after 25 meaningful findings. If you hit the cap, add: `Finding cap reached. Run a follow-up risk review after these issues are triaged or repaired.`

## Modes

Match the `/vette` command mode when the user or context implies it:

| Mode | When | Primary output |
|------|------|----------------|
| **Doc** (`/vette doc`) | Local findings only | Local report; no PR comments, no edits, no repro tests |
| **External review** | PR not owned locally | Verified findings + optional PR comments with repro evidence |
| **Owner repair** | PR branch owned here | Fixes via TDD; no PR review comments as primary output |
| **Scope bug discovery** (`/vette --scope`) | Service/module audit, not a PR | Local bug-ticket drafts only |
| **Whole-repo / plan** | No diff boundary | Repo map + lanes scoped to named area or plan |

## Workflow

### 1. Resolve context and build the review bundle

1. Identify review target: PR, branch vs base, worktree path, or named subsystem.
2. Compute merge base and changed files when reviewing a branch or PR.
3. Capture diff stat, file list, and truncated diff content.
4. If the user provided or referenced a plan, run the Plan Risk Pass before topic lanes.
5. Attach requirement context when available:
   - PR title/body, linked tickets, acceptance criteria
   - Linear issue views for IDs inferred from branch, PR, or CLI
   - Matched Gherkin/feature files lexically related to the diff
6. Record changed paths explicitly. Do not attach requirements or behavior-spec context to an empty diff.

### 2. Dispatch topic lanes in parallel

Run all eleven topic lanes below unless scope clearly makes a lane irrelevant. When subagents are available, dispatch each lane independently with the shared bundle and exactly one lane file. Otherwise run isolated local passes per lane.

Default lane order for manual runs (Pi sorts slowest lanes first for scheduling):

1. Correctness — [`reviews/correctness.md`](./reviews/correctness.md)
2. Test scenarios — [`reviews/test-scenarios.md`](./reviews/test-scenarios.md)
3. Test quality — [`reviews/test-quality.md`](./reviews/test-quality.md)
4. Error handling — [`reviews/error-handling.md`](./reviews/error-handling.md)
5. Security/data — [`reviews/security-data.md`](./reviews/security-data.md)
6. Contracts — [`reviews/contracts.md`](./reviews/contracts.md)
7. Async/state — [`reviews/async-state.md`](./reviews/async-state.md)
8. Naming — [`reviews/naming.md`](./reviews/naming.md)
9. Maintainability — [`reviews/maintainability.md`](./reviews/maintainability.md)
10. Requirements/Linear — [`reviews/requirements.md`](./reviews/requirements.md)
11. Feature behavior specs — [`reviews/behavior-specs.md`](./reviews/behavior-specs.md)

Each lane agent must:

- stay inside its lane scope
- return JSON-shaped findings or lane findings for parent merge
- use topic severity `blocker`, `concern`, or `suggestion`
- cite evidence from the diff or verified file context
- return an empty findings list when nothing actionable is found

Drop lane findings that reference paths outside the changed-file set before synthesis.

### 3. Optional advisory Fallow audit

After topic lanes complete and before final synthesis, run once per pass when Fallow is available:

```bash
pnpx fallow audit --base origin/main --gate new-only
```

Use the reviewed base branch when `origin/main` is unavailable. Treat exit code 1 with usable output as a completed audit with candidates, not a failed command. Verify every useful Fallow item with the same evidence gate as other findings. Reject noisy, duplicate, pre-existing, or out-of-scope items with short reasons.

### 4. Optional supplementary parallel lanes (PR workflows)

For full `/vette` or `/pr` workflows, also run these read-only lanes in parallel before choosing fixes or comments:

- `naming` / `test-name` skill for PR title/body, identifiers, and behavior-first test names
- `thermo-nuclear-code-quality-review` for strict maintainability and structural risks

Merge outputs with topic-lane findings. Preserve lane provenance: `[topic-id]`, `[name-check]`, `[thermo-nuclear]`, or combined tags when multiple lanes agree.

### 5. Synthesis and verification

Do not stop at lane summaries. Complete these phases:

1. **Parse and deduplicate** all lane findings into stable finding IDs. Preserve topic and model provenance.
2. **Reject** duplicate, low-confidence, and out-of-scope items with short reasons.
3. **Verify** each remaining actionable finding against source files using read/grep and focused shell commands.
4. **Repro tests** when mode allows: for blockers and important concerns, build the smallest behavior test that proves the defect, run the narrowest command, verify failure for the expected reason, capture exact test code and output, then clean up unless the user asked to keep tests. If the test command fails after retries, run one dependency install attempt, then the repo build/rebuild command, then rerun the focused test before posting comments.
5. **Act** according to mode: local report, PR comments, owner repair, or bug drafts.
6. **Finish** with counts for candidates, duplicates, rejected, verified, posted or comment-ready, fixed, unverified, and blocked items.

### 6. Findings artifact (PR and scope modes)

When reviewing a PR or scoped audit, maintain a local Markdown findings artifact for the branch or PR. Record every candidate with stable id, source lanes, status, severity, file/line, evidence, verification command/result, repro test when applicable, posted comment URL when applicable, and rejection/blocker reason. Do not commit the artifact unless the user explicitly asks.

## Plan Risk Pass

When the user provides an implementation plan, ticket breakdown, or proposed architecture, review that plan before launching topic lanes.

Evaluate:

- fit with existing architecture and local conventions
- simpler or safer approaches already in the codebase
- missed edge cases, negative paths, permissions, validation, persistence, concurrency, and rollback behavior
- test gaps that would let the planned work appear complete while still broken
- migration, rollout, observability, and support risks
- ambiguous requirements that materially change implementation or acceptance tests
- overreach, under-specification, or unrelated coupling

Return plan recommendations early in the report. Tie each recommendation to codebase evidence or an explicit unresolved assumption.

## Topic Severity Mapping

Topic lanes emit `blocker`, `concern`, or `suggestion`. Map them during synthesis:

| Topic severity | PR scan label | Typical vette report severity |
|----------------|---------------|-------------------------------|
| `blocker` | 🔴 **Blocker** | `Critical` or `High` |
| `concern` | 🟡 **Recommended** | `Medium` or `High` |
| `suggestion` | 🔵 **Note** | `Low` or `Medium` |

Business impact still overrides label mapping when the defect is clearly critical or clearly cosmetic.

## Severity And Confidence

Severity is based on business impact, not elegance.

- `Critical`: likely security breach, privacy leak, data corruption, financial loss, cross-tenant access, broken critical production flow, or irreversible destructive action
- `High`: likely to break an important workflow, silently lose work, mislead users, or create repeated support load
- `Medium`: incomplete behavior, unhandled edge cases, meaningful test gaps, or confusing failure states
- `Low`: real issue with limited expected user or business harm

Confidence levels:

- `Confirmed`
- `High confidence`
- `Likely`
- `Needs external research`
- `Speculative`

Do not use numeric scoring.

## Operator Questions

Do not ask broad questions. Ask only when:

- product intent cannot be inferred from code, tests, docs, or UI copy
- the codebase contains conflicting signals
- the issue depends on business rules
- one narrow answer will resolve the uncertainty

When asking:

- prefer a narrow multiple-choice style question
- ask only what is needed to classify or validate the finding
- if ambiguity would require many follow-ups, create a `Needs external research` finding instead

## PR Comment Contract

When preparing or posting GitHub review comments for verified external-review findings:

- Put exactly one scan label line first: `🔴 **Blocker**`, `🟡 **Recommended**`, or `🔵 **Note**`.
- Use a `<details>` block with a one-sentence `<summary>` stating what breaks and why.
- Keep verification details, commands, lane provenance, repro code, and fix boundaries inside the expanded body.
- Leave one blank line after `</summary>` before hidden Markdown content.
- Put long logs and repro/test code in fenced blocks inside the expanded body.
- For naming-only suggestions, use a minimal ` ```suggest ` block with the full replacement line first, then brief reasoning.
- Post file/line comments when possible; group verified-but-untestable items only when no useful anchor exists.

## Report Format

Return a single combined report:

```md
# Vette Report
## Executive summary
## Scope investigated
## Plan recommendations
## Commands run
## Lane coverage
## Findings by priority
## Testing gaps
## Product or copy mismatches
## Needs external research
## Synthesis counts
## Follow-up recommendation
```

Omit `Plan recommendations` when no plan was provided or inferred.

`Synthesis counts` should include candidates, duplicates rejected, verified, posted or comment-ready, fixed, unverified, and blocked items when synthesis ran.

Group findings by `Critical`, `High`, `Medium`, and `Low`.

Fully document `Critical`, `High`, and `Medium` findings. Summarize `Low` findings unless they are especially actionable or reveal a broader pattern.

Use this finding schema:

- Title
- Severity
- Confidence
- Source lanes / topics
- Priority rationale
- User / business impact
- What appears to happen
- What should happen
- Evidence
- QA validation notes
- Engineering notes
- Suggested resolution
- Suggested tests
- Open questions
- Status
