---
name: bdd-vette
description: Use when reviewing BDD scenarios, Gherkin, acceptance criteria, or behavior specifications for misleading names, duplicate coverage, vague requirements, missing cases, or contradictions.
---

# BDD Vette

## Purpose

Review a set of behavior specifications for whether it gives readers a coherent, trustworthy account of user and domain expectations. Find evidence-backed defects and meaningful uncertainties; do not rewrite the whole specification by default.

Use this skill to review existing Gherkin, acceptance criteria, behavior examples, or related specification sets. Use the `bdd` skill when the main task is drafting or refining scenarios. A review may include a small rewrite when needed to make a finding actionable.

## Review lenses

Review the full supplied specification set, including titles, steps, rules, examples, and linked product evidence. Use only lenses relevant to the material; do not manufacture findings to fill a checklist.

### Run review lanes as separate agents

When multi-agent delegation is available, run each applicable lens below as its own independent review agent. The parent skill is the orchestrator: it defines the shared scope and evidence set, dispatches the lanes against the same specification snapshot, then validates, deduplicates, prioritizes, and presents one combined report. Do not ask one agent to cover several lenses or return disconnected agent reports to the user. If delegation is unavailable, perform the same lanes sequentially and state that they were not independently delegated.

Dispatch these lanes separately:

1. **Name promises:** Feature, Rule, Scenario, Outline, and meaningful step names; test whether names match reader expectations and the behavior demonstrated.
2. **Duplicate and overlap:** compare behavior and boundaries across scenarios; classify equivalent, partially overlapping, or similar-but-distinct cases.
3. **Vague or unplaced requirements:** find broad expectations, determine whether they are concretized elsewhere in the supplied material, and report uncovered ambiguity once.
4. **Gaps, edges, and recovery:** trace relevant states, boundaries, denial, failure, retry, interruption, and recovery paths evidenced or implied by the source.
5. **Contradictions and assumptions:** compare related rules, scenarios, examples, and source statements for incompatible expectations or assumptions.

Give every lane the same scope, source material, and instruction to stay within its lens. Require each to return findings with artifact location, direct evidence, interpretation, uncertainty, user impact, and a proposed disposition; require explicit `no findings` or `blocked` when applicable. Agents propose findings only: they must not invent product rules, rewrite source files, or resolve choices reserved for the user. The parent checks citations against the supplied material, rejects unsupported claims, merges reports about the same underlying issue, and preserves meaningful disagreements. Do not treat an empty lane report as proof that another lane's concern is resolved.

Run independent lanes in parallel when possible. If the material is too small for a lane to have meaningful scope, still record that lane as not applicable with a brief reason rather than silently omitting it.

### Names as promises

Treat Feature, Rule, Scenario, Scenario Outline, and meaningful step names as promises about behavior. Check whether the body demonstrates what the name leads a stakeholder to expect, whether it names a recognizable capability or outcome, and whether it distinguishes the behavior from nearby cases. Prefer evidenced user or domain language. A broad title is a finding only when it obscures what is covered, overpromises, or plausibly misleads a reader. Do not require a title to repeat context clear from its parent Feature or Rule.

For a finding, cite the name and the behavior it promises, then compare that promise with the actual steps or evidence. Suggest a replacement only when the intended behavior is supported; otherwise state the ambiguity or question.

### Duplicate and overlapping coverage

Compare scenarios by actor, intent, meaningful preconditions, action or domain event, rule, observable outcome, and relevant boundaries such as role, state, timing, data scope, and failure condition. Similar wording, shared steps, or similar titles alone do not prove duplication.

Classify cases as:

- **Equivalent:** same behavior and meaningful boundaries; consolidation may be useful.
- **Partially overlapping:** a shared path exists, but a rule, boundary, or outcome differs; identify the common part and preserve the distinction.
- **Similar, distinct:** wording resembles another case, but the behavior differs; explain the distinguishing condition when confusion is likely.

Recommend merging only equivalent cases. If consolidation is suggested, state what coverage must remain. Do not call examples redundant merely because they share setup or an outcome phrase.

### Vague or unplaced requirements

Look across the entire supplied material for broad claims such as “easy to use,” “handles errors,” or “users can manage their account.” Determine whether the vague expectation is already made concrete in a scenario, finding, or explicit product question elsewhere. Report uncovered ambiguity once and link related material; do not repeat it under multiple findings. Do not invent acceptance rules. Separate a known coverage gap from an unresolved product choice and from an optional suggestion.

### Gaps, edges, and recovery

Trace relevant behavior through states and boundaries indicated by the source. Consider negative paths, permissions, invalid or boundary inputs, duplicates, expiry, unavailable dependencies, retries, asynchronous completion, interruption, and recovery when they matter to the described workflow. Check cross-role and cross-scenario effects where the material implies them. Use the `bdd` skill's missed-case guidance as a prompt, not as a mandate to add every case.

A missing case is a finding only when source evidence, an accepted rule, or a clear user expectation establishes that it matters. Otherwise list it as a suggested scenario or product question, with the uncertainty stated.

### Contradictions and assumptions

Compare related Rules, scenarios, examples, and source statements for incompatible preconditions, outcomes, permissions, terminology, or assumptions. Cite both sides. Do not silently choose one interpretation or repair the conflict by inventing a rule. State the narrowest question that would resolve it.

## Evidence and calibration

- Inspect the provided spec set as a whole before reporting “not covered” or “not mentioned elsewhere.”
- Keep observation separate from interpretation and recommendation. Cite file and line, scenario title, or supplied source excerpt for each material claim.
- Distinguish confirmed specification defects, likely gaps, optional coverage ideas, and unresolved product decisions.
- Prioritize by expected user or business impact and confidence. Do not use numeric scores or treat every omission as a defect.
- Merge findings that describe the same underlying problem. Keep distinct findings when the affected behavior or remedy differs.
- When evidence is insufficient, say what was unavailable and what would resolve the uncertainty. Do not infer behavior from implementation details unless the user has supplied them as authoritative product evidence.
- Review specifications, not implementation quality. Do not turn this into a code review or prescribe implementation mechanics.

## Output

Return one consolidated report. Adapt section names to the supplied material and omit empty sections.

```md
# BDD Vette Report
## Executive summary
## Scope reviewed
## Findings by priority
## Duplicate and overlapping coverage
## Suggested scenarios and product questions
## Review limits
```

Group findings by Critical, High, Medium, and Low only when severity distinctions are useful. For each actionable finding, include:

- **Title** and **priority/severity**
- **Confidence**: Confirmed, High confidence, Likely, Needs external research, or Speculative
- **Affected specification**: path and line, scenario/rule/title, or supplied artifact reference
- **Evidence**: the relevant name, step, rule, or source statement
- **What readers expect** and **what the spec actually establishes**
- **Impact** and why the finding matters
- **Suggested resolution**: rename, clarify, split, merge, add a scenario, preserve a distinction, or ask a product question
- **Open question**, when behavior cannot be inferred

Keep straightforward wording improvements as concise notes. Elevate a naming issue when it can mislead readers about expected behavior or hide missing, duplicate, or conflicting coverage. Suggested scenarios must be clearly labeled as suggestions, not established requirements. State unreviewed files, unavailable sources, and other material limits; do not imply exhaustive coverage beyond what was inspected.
