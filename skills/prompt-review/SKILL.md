---
name: prompt-review
description: Use when reviewing prompts, agent instructions, skills, policies, or workflow guidance for contradictions, missing conditions, hidden assumptions, or absolute language such as always, never, must, only, or cannot. Also use when reviewing a SKILL.md file, agent-skill package, or tool/function definition (JSON schema, MCP tool description, etc.) for model best-practice issues such as frontmatter validity, token/progressive-disclosure budget, action design, output signal, and instruction specificity.
---

# Prompt Review

Review instruction text as a conditional policy, not as prose to polish. Find rules that are too broad for their context, conflict with other rules, or omit the conditions needed to apply them safely.

## Review contract

Trigger condition: if the reviewed artifact is a SKILL.md, an agent-skill package, or a tool/function definition (JSON schema, MCP tool description, etc.), additionally apply the Model best-practice review below; otherwise skip it. That dimension's specificity/vagueness lens is orthogonal to the absolute-language/contradiction/gap lenses in this contract — report them in separate output sections and never double-count a line as both unless it is genuinely both an absolute statement and a vague/underspecified instruction.

1. Read the complete prompt or instruction set before judging individual lines.
2. Extract every normative absolute, including `always`, `never`, `must`, `only`, `cannot`, `do not`, `required`, and equivalent wording. Include the exact quote and location.
3. Identify contradictions and gaps:
   - direct conflicts (`always X` versus `never X`)
   - scope conflicts (a broad rule conflicts with a narrower exception)
   - missing conditions, actors, inputs, timing, exceptions, or fallback behavior
   - undefined terms or success criteria
4. Return findings in the order they appear, separating **Absolute statements**, **Contradictions**, and **Gaps**. Do not silently rewrite or discard a rule.
5. For each absolute, propose an if-then rule that preserves the apparent intent while making its trigger, scope, exception, and fallback explicit. Mark assumptions and ask for confirmation where intent is unclear.
6. Treat genuine invariants as candidates for keeping absolute. Explain why they appear invariant instead of weakening them automatically.
7. Review exception paths and lifecycle states, not just sentence-level conflicts. Check default versus opt-in modes, normal versus integration work, checkpoint versus final completion, blocked/waiting/human-required states, retries, waivers, and recovery.
8. Check operational completeness for every strong rule: trigger, scope, actor, authority, approval artifact, expiry/timeout, fallback, evidence, and completion condition. Flag rules that rely on undefined words such as “approved,” “required,” “complete,” “overlap,” or “equivalent.”
9. Check authority boundaries. Distinguish repository content from controller policy, user requirements from inferred assumptions, and read-only observation from mutation. Surface an explicit precedence question when sources can conflict.
10. Group repeated absolutes across referenced documents, but preserve each distinct exception and cite every relevant location.

## Review dimensions

For each absolute or lifecycle rule, ask:

- **Mode:** Is this the default, or does an explicitly enabled mode create an exception?
- **Scope:** Which actor, phase, path, lane, scenario, or artifact does it govern?
- **Authority:** Who can approve, waive, override, retry, or close it?
- **State:** What happens in ready, active, blocked, waiting, human-required, failed, and complete states?
- **Evidence:** What observable command, artifact, hash, decision, or owner proves compliance?
- **Recovery:** What happens on timeout, malformed output, unavailable tooling, stale leases, flaky checks, or source changes?

A rule is incomplete when one of these dimensions is necessary for safe execution but absent. Do not invent the missing value; report it as a gap and offer an if-then shape with a placeholder.

## Model best-practice review

Trigger (see Review contract above): apply this dimension only when the reviewed artifact is itself a SKILL.md, an agent-skill package, or a tool/action definition — not a general policy prompt. Run it alongside, not instead of, the absolute-language review above: this dimension checks structure, token budget, and invocation design, not if/then conditionality.

Summary checklist (full checklist, with per-item confidence ratings, in `references/model-best-practices-checklist.md`):
- Frontmatter validity: `name` ≤64 chars, lowercase/numbers/hyphens only; `description` non-empty, ≤1024 chars, no XML tags; neither field contains the words "anthropic" or "claude".
- Progressive disclosure budget: frontmatter ~100 tokens; body <5k tokens; bulky reference material pushed to separate bundled files, not inlined.
- Execute vs. read-only code: skill states whether each bundled script is meant to be executed or read as reference; deterministic/repetitive logic goes in a script, not model reasoning.
- Action/tool description depth: each tool/sub-command/delegated-agent step gets 3-4+ sentences: what/when-to-use/when-not-to-use/parameter semantics/caveats.
- Action consolidation: related operations are one action with a mode/action parameter rather than several near-duplicate narrow actions.
- Output signal: example outputs return only high-signal fields and stable identifiers, not bloated/opaque-ID-laden payloads.
- Instruction specificity: guidance is explicit, not inference-reliant (distinct lens from absolute-language above).
- Token efficiency: padding/redundant restatement/decision-irrelevant info is a defect, not a style nit.
- Model-family fit: if the artifact explicitly targets GPT-6/Astra/Codex, also check the GPT-6-specific items in the references file (router-style root docs, narrow triggers, reduced procedural prescriptiveness) — single-source, lower confidence than the items above, and not applicable to a Claude-targeted skill.

Do not flag, and do not require as a fix: description-as-sole-invocation-trigger, artifact size being "unbounded" via progressive disclosure, `user-invocable: false` hiding skills from SDK discovery, "a human could definitively determine which tool" phrasing or missing embedded examples/defaults, or enum-constrained parameters as hallucination prevention. None of these are established findings — see the references file for why.

## Output format

```md
# Prompt review
## Scope and assumptions
- Reviewed: <source or excerpt>
- Assumptions requiring confirmation: <none or list>

## Absolute statements
| # | Location | Exact statement | Risk/context | Conditional rewrite |
|---|---|---|---|---|
| A1 | line/section | “...” | Why this may overreach | If `<condition>`, then `<action>`; otherwise `<fallback>`. |

## Contradictions
| # | Rules in conflict | Why they conflict | Resolution question or proposed precedence |
|---|---|---|---|
| C1 | A1 vs section 3 | ... | ... |

## Gaps
| # | Missing decision | Why it matters | Suggested condition or question |
|---|---|---|---|
| G1 | ... | ... | If `<condition>`, then ... |

## Model best-practice findings
<Include this section only when the Model best-practice review trigger fires (reviewed artifact is a SKILL.md, agent-skill package, or tool/function definition). Omit the whole section — not an empty table — when the trigger does not fire.>
| # | Area | Location | Finding | Confidence | Suggested fix |
|---|---|---|---|---|---|
| M1 | Frontmatter / Progressive disclosure / Execute-vs-read-only / Action depth / Action consolidation / Output signal / Instruction specificity / Token efficiency | file/section | ... | high/medium/low | ... |

## Recommended rule set
<Only include the rewritten rules after the findings; preserve unresolved items as questions.>
```

## Conditional rewrite pattern

Prefer this shape:

```text
If [observable trigger and scope], then [required action], unless [specific exception]; otherwise [fallback or escalation].
```

Make the condition operational. Replace “always validate” with “If the input crosses the external API boundary, validate it against schema X; for trusted internal values, use the typed constructor; if validation fails, return the documented error.”

## Guardrails

- Quote before interpreting; distinguish the author’s words from your recommendation.
- Do not treat every occurrence of “must” in an example, quotation, heading, or description as an active rule; label its role.
- Do not weaken safety, legal, security, data-loss, or explicit user constraints merely because they are absolute. Ask whether the rule is intentionally invariant.
- Do not invent exceptions to make a prompt appear consistent. Surface the unresolved choice.
- Do not produce only rewritten prose: the original absolute statements and rationale are required.
- If the source is incomplete, review what is present and list the missing context instead of guessing.
