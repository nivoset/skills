# CodeLens Codebase Diagnostics Research

## Executive summary

CodeLens is a strong front door for investigating an unfamiliar repository. It combines repository size and language statistics with health scoring, Git-history hotspots, change coupling, ref-to-ref diffs, trend snapshots, knowledge-island signals, SARIF/OpenMetrics output, and an MCP server plus agent skill. Its most valuable contribution is prioritization: it can narrow a large codebase to the files, functions, and neighboring modules most likely to deserve investigation.

It should not be treated as a standalone bug finder. A hotspot is a risk signal, not proof of a defect. The most useful diagnostic stack is:

1. CodeLens to rank likely problem areas.
2. Repository-aware inspection and tests to establish behavior and coverage.
3. CodeQL or Semgrep for semantic patterns and data-flow paths.
4. Git history and `git bisect` when the failure is a regression.
5. Runtime traces, logs, and metrics when static evidence cannot explain production behavior.
6. A structured review skill that turns evidence into a bounded finding, reproduction, and next action.

The current skills repository already covers much of the final review layer through `vette`, `planning-codebase-researcher`, `pr-review`, `pr-bug-bash`, `objective-check`, and the testing/planning skills. The clearest gap is a reusable, evidence-first diagnostic skill that orchestrates CodeLens and other analyzers before those existing skills begin their review.

## What CodeLens contributes

The repository describes CodeLens as a Rust-based analysis tool with 65+ language support, Git-aware filtering, multiple machine-readable formats, six health dimensions, quality gates, hotspots, change coupling, trend tracking, cost/token estimation, and agent integration.[^1]

The most relevant capabilities for locating problems are:

| Capability | Diagnostic value | Important limitation |
|---|---|---|
| Health score | Quickly identifies files/directories with complexity, size, nesting, duplication, function-size, and comment-ratio pressure. | An aggregate grade can hide which dimension matters and does not prove incorrect behavior. |
| Hotspots | Combines change activity and complexity; useful for ranking likely defect-concentration areas. | Frequently changed code can be healthy; stable complex code can still be defective. |
| Function hotspots | Narrows a risky file to functions that absorb churn. | The README describes the intersection as approximate and not AST-based. |
| Change coupling | Reveals modules that repeatedly change together despite the declared architecture. | Correlation is not necessarily a dependency or defect. |
| Ref-to-ref diff | Shows health movement and files whose grades regress after a change. | It measures structural/health movement, not user-visible correctness. |
| Trend snapshots | Shows whether a code area is getting harder to change over time. | Requires consistent snapshot collection and comparable configuration. |
| Knowledge-island signal | Flags risky code concentrated around one author. | Author concentration is a maintainability and review-risk signal, not proof of ownership failure. |
| SARIF/OpenMetrics/JSON | Makes findings consumable by CI, dashboards, and agent workflows. | Consumers must preserve the analysis configuration and explain omitted dimensions. |

The bundled CodeLens skill is particularly useful because it gives agents an interpretation order: overall size and language mix, project grade, weak directories, then hotspots. It also recommends JSON for agent consumption, capturing a baseline before refactors, and using `--fail-on-regression` so legacy debt does not block every change.[^2]

## Recommended diagnostic workflow

### Phase 1: Establish the repository map

Run CodeLens against the repository root and record the configuration, excluded paths, languages, and Git range. Do not report a low test ratio until inline-test conventions and generated/vendored exclusions have been checked.

```sh
codelens . -f json -O /tmp/codelens-stats.json
codelens health . --top 20 -f json -O /tmp/codelens-health.json
codelens hotspot . --functions -f json -O /tmp/codelens-hotspots.json
codelens coupling . -f json -O /tmp/codelens-coupling.json
```

The output should be summarized into a short triage table with: path, health grade, dominant health dimension, churn window, complexity, function hotspot, author concentration, coupled paths, and the next verification command.

### Phase 2: Convert signals into hypotheses

Use the intersection of signals rather than a single score:

- High churn + high complexity: likely maintenance/defect concentration.
- Low health + recent regression: likely change-induced risk.
- High coupling across architectural boundaries: likely hidden blast radius.
- Hotspot + single-author concentration: review and handoff risk.
- Health regression without a failing test: candidate test-gap investigation.
- Health regression plus runtime alert: highest-priority production hypothesis.

Every signal should become a falsifiable hypothesis, for example: “The checkout orchestration path is a likely source of duplicate charges because it is a high-churn/high-complexity hotspot, changes with the payment adapter, and has no idempotency test.” CodeLens alone cannot establish the final clause; the repository and tests must do that.

### Phase 3: Add semantic analysis

Use CodeQL for deeper code-as-data queries and path-oriented results. GitHub describes CodeQL as generating a database representation of the codebase and running queries against it; path queries expose the sequence from source to sink so an investigator can inspect each step.[^3] This is the right layer for authorization propagation, unsafe input flows, deserialization, secret handling, and framework-specific security behavior.

Use Semgrep for fast repository-specific rules, especially dangerous API patterns, missing guards, validation drift, and lightweight taint checks. Semgrep documents source, propagator, sanitizer, and sink concepts for taint analysis, and its rule model is well suited to encoding local conventions.[^4]

The recommended separation is:

- CodeLens: “where should we spend attention?”
- CodeQL: “can data or control flow reach this dangerous state?”
- Semgrep: “does this code violate a known local pattern?”
- Tests: “does the claimed behavior actually fail or pass under a reproducible case?”

### Phase 4: Verify regressions historically

For a behavior that was known to work and now fails, add a focused command that returns success/failure, then use `git bisect run`. Git documents bisect as a binary search over history that identifies the commit introducing a bug, with exit code 125 available for commits that cannot be tested.[^5] CodeLens’s ref-to-ref diff should be used before and after this process to understand which structural changes accompanied the regression.

### Phase 5: Bring in runtime evidence

Static analysis cannot explain every production issue. OpenTelemetry’s observability model uses traces, metrics, and logs to ask questions about a system from the outside without already knowing its internals.[^6] A diagnostic workflow should correlate a suspicious CodeLens path with a trace span, error rate, latency percentile, queue delay, or log event when the problem is operational rather than purely structural.

## Tooling stack to add around CodeLens

### Priority 1 — installable CodeLens diagnostic skill

Create a repository skill named `codebase-diagnostics` or `codelens-diagnostics`. It should:

- Detect whether CodeLens is installed and use `--help` as the source of truth.
- Run a bounded baseline in JSON.
- Rank hotspots and coupled files.
- Inspect the top candidate paths and nearby tests.
- Select the next analyzer based on the hypothesis: CodeQL, Semgrep, test runner, `git bisect`, or runtime evidence.
- Require evidence before calling something a finding.
- Produce a report with confidence, user impact, exact locations, commands, and a smallest next verification step.
- Avoid fixing code unless the user separately requests implementation.

This should be an orchestration skill, not a duplicate of `vette`. `vette` should remain the broad risk-review engine; the new skill should specialize in locating and ranking likely problem areas before review lanes run.

### Priority 2 — analyzer adapters

Add optional, capability-detected adapters rather than hard dependencies:

- `codelens`: health, hotspots, coupling, diff, trend.
- `codeql`: database creation, query execution, path-result extraction.
- `semgrep`: local rule discovery, scan, SARIF normalization.
- `git-history`: blame, log, ownership, bisect candidate range.
- `test-evidence`: focused test selection, coverage lookup, reproduction capture.
- `runtime-evidence`: connector-specific traces/logs/metrics if available.

Normalize all adapters into a common finding shape:

```yaml
finding:
  signal: hotspot | semantic | regression | runtime | test-gap
  path: absolute/or/repository-relative/path
  lines: "start-end"
  hypothesis: "..."
  evidence:
    - command: "..."
      result: "..."
  confidence: confirmed | high | likely | speculative
  next_action: "..."
```

This makes it possible for existing review skills to consume machine output without each skill inventing a new report contract.

### Priority 3 — CI and baseline integration

Use CodeLens’s ref-to-ref health gate for “clean as you code,” but do not make a whole-project grade the only merge condition. The practical CI policy is:

- Block new health regressions in changed files.
- Publish SARIF or Markdown results for review.
- Keep historical debt visible but non-blocking.
- Save periodic trend snapshots.
- Run deeper CodeQL/Semgrep scans on the paths CodeLens prioritizes or on security-sensitive changes.

## New skills worth creating

### 1. `codebase-diagnostics` — highest priority

Trigger when the user asks where problems are happening, wants to understand an unfamiliar repository, asks what to investigate first, or wants a defect-risk map. Output a ranked diagnostic report, not a generic architecture summary.

Core sections:

- Repository profile
- Highest-risk paths
- Evidence-backed hypotheses
- Coupling and blast radius
- Test and observability evidence
- Recommended next checks
- Confidence and limitations

### 2. `regression-localizer`

Trigger when a behavior, test, performance metric, or build is known to have regressed. Compose CodeLens diff/trend, focused reproduction, Git history, and `git bisect`. Require a reproducible predicate and preserve the worktree state.

### 3. `semantic-risk-scan`

Trigger for security, data-flow, validation, authorization, serialization, or dangerous-API concerns. Choose CodeQL or Semgrep based on language and available installation, normalize SARIF, and distinguish pattern matches from proven flows.

### 4. `change-blast-radius`

Trigger before a risky refactor or cross-cutting change. Combine CodeLens coupling, recent diffs, ownership, affected tests, and architectural boundaries. Return files that must be reviewed together and files that should explicitly not be included.

### 5. `diagnostic-evidence-pack`

Trigger when a finding must be handed to another agent, ticket system, or reviewer. Package commands, outputs, paths, line locations, reproduction steps, confidence, and cleanup state into a stable artifact. This would improve handoff quality across `vette`, `pr-review`, `ticket-building-system`, and `planning-codebase-researcher`.

## How this fits the existing skills repository

The repository already has strong downstream capabilities:

- [`planning-codebase-researcher`](skills/planning-codebase-researcher/SKILL.md) gathers behavior, dependencies, risks, and test gaps for planning.
- [`vette`](skills/vette/SKILL.md) performs broad evidence-first risk review across security, data integrity, core flows, tests, and observability.
- [`pr-review`](skills/pr-review/SKILL.md) scopes findings to a source-vs-target branch and verifies review findings locally.
- [`pr-bug-bash`](skills/pr-bug-bash/SKILL.md) turns suspected PR defects into temporary failing tests.
- [`objective-check`](skills/objective-check/SKILL.md) checks coverage, dependencies, acceptance criteria, and readiness.

The missing piece is sequencing and signal triage. A good composition would be:

```text
codebase-diagnostics
        |
        +--> planning-codebase-researcher   (if planning work)
        +--> vette                          (if broad risk review)
        +--> semantic-risk-scan              (if security/data-flow hypothesis)
        +--> regression-localizer            (if known regression)
        +--> pr-bug-bash                     (if branch/PR defect proof)
        +--> ticket-building-system          (if a verified issue needs tracking)
```

Do not make `codebase-diagnostics` automatically invoke every analyzer. Start with CodeLens, inspect the repository signals, and escalate only when the hypothesis needs semantic, historical, test, or runtime evidence. This keeps analysis fast and reduces false confidence from a pile of uncorrelated warnings.

## Recommended implementation order

1. Add `codebase-diagnostics` with CodeLens CLI support, JSON parsing, and a stable report contract.
2. Add a small reference file describing how to interpret health, hotspot, coupling, and baseline output.
3. Add a `regression-localizer` skill using focused predicates and `git bisect run`.
4. Add optional Semgrep and CodeQL adapters with explicit capability detection.
5. Add SARIF normalization and handoff to `vette`/`pr-review`.
6. Add runtime evidence connectors only where the workspace already has an approved observability integration.
7. Add CI templates for non-blocking reports and changed-file regression gates.

## Caveats

CodeLens’s own documentation makes the right distinction: a hotspot is a combination of change activity and complexity, while a knowledge island is a review/maintainability risk. These are prioritization signals, not defect labels. The proposed skills should therefore prohibit statements such as “this file contains bugs” when the evidence only shows churn, complexity, or coupling. They should say “this file is a high-priority investigation target” until a test, semantic path, runtime symptom, or static proof confirms a concrete failure.

The repository should also preserve tool configuration in every report. Exclusions, language detection, duplication-scan mode, Git window, and baseline ref materially affect the result. Without that metadata, trend comparisons and agent conclusions are not reproducible.

## Sources

[^1]: DropFan, “Codelens,” GitHub repository README, accessed September 13, 2026. [https://github.com/DropFan/codelens](https://github.com/DropFan/codelens)
[^2]: DropFan, “codelens Agent Skill,” [SKILL.md](https://github.com/DropFan/codelens/blob/rust/skills/codelens/SKILL.md), accessed September 13, 2026.
[^3]: GitHub Docs, “Code scanning with CodeQL” and “Exploring data flow with path queries,” [CodeQL code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning), [path queries](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/scan-from-vs-code/explore-data-flow), accessed September 13, 2026.
[^4]: Semgrep, “Demystifying Taint Mode” and “Rule structure syntax examples,” [taint mode](https://semgrep.dev/blog/2022/demystifying-taint-mode/), [rule ideas](https://semgrep.dev/docs/writing-rules/rule-ideas), accessed September 13, 2026.
[^5]: Git documentation, “git-bisect,” [https://git-scm.com/docs/git-bisect](https://git-scm.com/docs/git-bisect), accessed September 13, 2026.
[^6]: OpenTelemetry, “Observability primer,” [https://opentelemetry.io/docs/concepts/observability-primer/](https://opentelemetry.io/docs/concepts/observability-primer/), accessed September 13, 2026.
