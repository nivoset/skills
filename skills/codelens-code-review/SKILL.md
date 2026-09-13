---
name: codelens-code-review
description: Use when a codebase, branch, or changed area needs a harsh review for defect risk, maintainability failure, hidden coupling, weak tests, or likely under-reviewed AI-assisted code.
---

# CodeLens Code Review

## Purpose

Perform an evidence-first quality review that is intentionally hard to pass. Use CodeLens to narrow the search to risky areas, then inspect behavior, tests, history, and semantics. Judge the code that exists, not the author or the presumed tool that produced it.

“AI slop” means plausible-looking code with weak design, excessive duplication, missing failure handling, shallow tests, unexplained abstraction, or poor fit with the repository. It is a quality hypothesis, never an authorship verdict.

## Review contract

- Read-only by default. Do not fix code, commit, post external comments, or create tickets unless separately requested.
- Be severe about real risk and conservative about claims. A low CodeLens score is an investigation lead, not proof of a bug.
- Stop at 25 meaningful findings. Merge symptoms that share one root cause.
- Every finding needs a path, line or symbol, concrete failure mode, user or maintenance impact, confidence, and verification evidence.
- “Looks AI-generated,” style preference, or generic cleanup is not a finding without a specific risk.
- Do not call code safe merely because tests pass. Check whether the tests exercise the dangerous boundary and assert the right outcome.

## Workflow

### 1. Establish scope and baseline

Capture `git status --short`, identify the review scope, and read relevant requirements, docs, contracts, and tests. For a branch or PR, review the source-versus-target diff. Run `codelens --help` and relevant subcommand help before relying on flags.

Prefer machine-readable output for analysis:

```sh
codelens . -f json -O /tmp/codelens-stats.json
codelens health . --top 20 -f json -O /tmp/codelens-health.json
codelens hotspot . --functions -f json -O /tmp/codelens-hotspots.json
codelens coupling . -f json -O /tmp/codelens-coupling.json
```

Preserve the analysis configuration: repository path, Git window, exclusions, language detection, duplication mode, and baseline ref.

### 2. Rank investigation targets

Prioritize intersections, not isolated metrics:

1. New health regression in changed code.
2. High churn plus high complexity.
3. Hotspot functions inside files with poor health.
4. Cross-boundary change coupling.
5. Knowledge islands around critical behavior.
6. High-risk code with weak or misleading tests.

Inspect the top targets and their callers, callees, adapters, schemas, error paths, and tests. Use `--include-tests` when test blast radius matters.

### 3. Apply harsh review lanes

Run only lanes relevant to the discovered risk, but cover these when applicable:

- Correctness and core-flow behavior
- Error handling, retries, timeouts, and partial failure
- Validation, authorization, tenant isolation, and data integrity
- Concurrency, idempotency, caching, and resource cleanup
- Hidden coupling and architectural boundary violations
- Duplication, speculative abstraction, dead code, and misleading names
- Test weakness, mock dishonesty, missing negative paths, and observability gaps
- Security-sensitive data flow with CodeQL or Semgrep when available

For a known regression, create or identify a focused predicate and use Git history or `git bisect run` where practical. For runtime symptoms, correlate static targets with traces, logs, or metrics.

### 4. Verify before reporting

Prefer a focused failing test, reproducible command, static proof from code/contracts, or a documented analyzer result. If verification is impossible, downgrade confidence and say exactly why. Never promote a CodeLens hotspot to a confirmed defect without corroboration.

## Finding format

```md
### [P0/P1/P2/P3] Short behavioral title
- Location: `path/to/file:line` or symbol
- Verdict: confirmed | high confidence | likely | speculative
- Failure: what breaks, silently corrupts, leaks, races, or becomes expensive
- Evidence: commands, analyzer output, test result, or code path
- Impact: user, business, security, reliability, or maintenance consequence
- Fix boundary: smallest safe change; explicitly exclude unrelated cleanup
- Missing proof: the one check that would raise or lower confidence
```

Use P0 only for catastrophic security, data, financial, or production-flow impact; P1 for important likely breakage; P2 for meaningful defects or test gaps; P3 for real but limited risk. End with a blunt verdict: ship, ship with required repairs, or do not ship.

## Supporting rubric

Read [harsh-review-rubric.md](references/harsh-review-rubric.md) when performing the full review or when findings are disputed. It defines what counts as evidence, how to reject AI-authorship claims, and how to distinguish design debt from a concrete defect.
