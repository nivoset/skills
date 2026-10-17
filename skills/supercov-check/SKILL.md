---
name: supercov-check
description: Use when asked to run Supercov on a repository or change, interpret its quality or coverage output, or turn findings and measurement errors into focused code investigations.
---

# Supercov Check

Use Supercov as an optional evidence source. It reports quality signals and test coverage; it does not prove a bug or prescribe a fix. Run it only when requested or when the user opts into this check.

## Choose the check

- **Quality signals** (no test command): `pnpx --yes supercov quality --json`
- **Only flagged quality files:** `pnpx --yes supercov quality gaps --json`
- **Quality of a change:** `pnpx --yes supercov quality patch --json` (uses the working tree or branch diff; pass `--base <ref>` when scope needs to be explicit)
- **Coverage evidence:** wrap the repository's known full test command: `pnpx --yes supercov -- <test command>`. Never guess the test command or run a partial suite as if it were complete.

Use `pnpx --yes supercov --help` or the relevant subcommand's `--help` if syntax/version differs. Quality/security assessment sends source-derived requests to the configured provider and needs `TYPESAFE_API_KEY`; coverage does not need that key. Quality output is designed for people and coding agents: prefer text unless a structured integration needs `--json`. Do not paste raw source-bearing dry-run requests or private run evidence into public reports.

Supercov assesses recognized source roots, not every file in the repository. Markdown, generated code, dependencies, and files outside discovered roots may be excluded. Inspect scope first with `pnpx --yes supercov quality scope`; use `SUPERCOV_SOURCE_ROOTS=src,packages` only for confirmed first-party code. Do not use `--all` just to inflate scope.

## Turn output into an investigation

Read the relevant finding in context (`quality file <path> --json` or `runs latest file <path>`), then independently inspect the code, callers, requirements, and tests. Convert a signal into this concise handoff:

```text
Title: [behavior or maintenance question, not a claimed bug]
Evidence: [path/check or coverage obligation and exact Supercov result]
Hypothesis: [specific failure or change risk; label unverified]
Investigate: [smallest code path, caller, and test to inspect]
Resolution options: [smallest plausible fix/test, contingent on confirming the hypothesis]
Verification: [focused test or command that would confirm the resolution]
Confidence: [low/medium/high, with reason]
```

Prioritize newly introduced patch findings and measured uncovered branches near important behavior. Treat quality smells (for example, long method or complex conditional) as leads, not defects. A coverage gap says a measured obligation was not reached; it does not say the behavior is wrong or which test should be added. Verify before creating a ticket, changing code, or claiming resolution.

## Understand failures and warnings

| Output / exit | Meaning and next step |
| --- | --- |
| `pnpx` cannot start / registry or offline error | Failure occurred before Supercov started. Check Node.js (22+), package registry access, and cache; retry only when available. |
| Assessment asks for `TYPESAFE_API_KEY` | Quality/security assessment requires the key; coverage and reading saved assessments do not. Never put the key in command arguments. |
| No application source / unexpected files | Run from the repository root; inspect `quality scope`, then explicitly set first-party `SUPERCOV_SOURCE_ROOTS` if needed. Unsupported file types are not made measurable by including them. |
| Test command exits non-zero | Supercov preserves the wrapped command's exit status. Diagnose the test failure first; its coverage is diagnostic, not a passing baseline. |
| Exit `1` | A valid measurement failed a requested policy (such as a coverage floor). Read the reported threshold and counts. |
| Exit `2` | The request/evidence could not answer reliably (for example stale run, failed suite used as a gate, unsupported metric, or blocking measurement limit). Inspect the run summary, `scope`, and `runners`; do not convert it to pass/fail. |
| `uncovered` / gap | Measured code or outcome was not observed; investigate a useful test. |
| measurement limit / incomplete / partly measured | The boundary or evidence is incomplete, not an uncovered path. Fix a named configuration cause; otherwise report the limitation and stop treating the percentage as complete. |
| stale run | Inputs changed since capture. Rerun the same complete test command before comparing or relying on it. |
| Supercov is busy | Another command is using the project store. Let it finish, then inspect `runs latest`; do not start concurrent runs. |
| Unsupported option or unclear output | Check `pnpx --yes supercov <command> --help` and bundled `pnpx --yes supercov docs troubleshooting`; preserve the exact command and non-sensitive summary for escalation. |

For details beyond this quick map, use `pnpx --yes supercov docs troubleshooting` and `pnpx --yes supercov docs cli`. Keep `.supercov/` local; use its documented cleanup command only when the user requests cleanup.
