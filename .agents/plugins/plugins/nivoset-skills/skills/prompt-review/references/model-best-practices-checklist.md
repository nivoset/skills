# Model best-practice checklist

Trigger: apply this checklist only when the reviewed artifact is a SKILL.md, an agent-skill package, or a tool/function definition (JSON schema, MCP tool description, etc.). For anything else, skip this file entirely.

Orthogonality note: items here (structure, token budget, invocation design, specificity/vagueness) are evaluated separately from the absolute-language/contradiction/gap lenses in the main review contract. Never double-count a line in both places unless it is genuinely both an absolute statement and a vague/underspecified instruction.

Each item is tagged with a confidence level (high/medium/low) reflecting how certain a flag against it is likely to be correct, based on adversarially verified research. Surface this same level in the `Confidence` column of the `## Model best-practice findings` table.

## 1. Frontmatter validity — confidence: high
- `name`: ≤64 characters, lowercase letters/numbers/hyphens only, matches the containing directory name exactly.
- `description`: non-empty, ≤1024 characters, contains no XML/HTML tags.
- Neither `name` nor `description` contains the words "anthropic" or "claude" (case-insensitive) — these are reserved words in Claude's own skill-frontmatter spec.
- These are objectively checkable (string length, regex, exact match), so flags here are high confidence.

## 2. Progressive disclosure budget — confidence: medium
- Frontmatter: roughly 100 tokens or fewer.
- Body (the SKILL.md itself, outside bundled reference files): under ~5k tokens.
- Bulky reference material (long checklists, schemas, examples) lives in separate bundled files under `references/`, not inlined into the body.
- These are soft targets, not hard limits, so flag only clear overages; confidence is medium because "bulky" and the exact token thresholds are judgment calls.

## 3. Execute vs. read-only code — confidence: medium
- Each bundled script states whether it is meant to be executed (a tool the model runs) or read as reference material (documentation/example code the model should not invoke).
- Deterministic or repetitive logic (parsing, validation, formatting) is implemented as a script rather than left to model reasoning on every invocation.
- Confidence is medium: the executable/reference distinction is sometimes implicit from context (file location, naming) rather than stated outright, so a missing explicit label isn't always a real defect.

## 4. Action/tool description depth — confidence: high
- Each tool, sub-command, or delegated-agent step has 3-4+ sentences covering: what it does, when to use it, when not to use it, parameter semantics, and caveats/edge cases.
- A one-line or single-sentence description for a non-trivial action is a concrete, high-confidence gap — it's directly observable by counting sentences and checking which of the four facets are covered.

## 5. Action consolidation — confidence: medium
- Related operations are exposed as one action with a mode/action parameter, rather than as several near-duplicate narrow actions that differ only in a fixed parameter value.
- Confidence is medium: whether two actions are "near-duplicate enough" to merge is sometimes a legitimate design choice (e.g. clearer error messages per action), not an unambiguous defect.

## 6. Output signal — confidence: medium
- Example outputs and documented return shapes surface only high-signal fields and stable identifiers.
- Bloated payloads, deeply nested objects, or opaque/internal IDs that the caller can't act on are a defect.
- Confidence is medium: "high-signal" depends on what the consuming agent actually needs, which isn't always fully specified in the artifact under review.

## 7. Instruction specificity — confidence: high
- Guidance is explicit and operational, not inference-reliant ("do the right thing," "as appropriate," "use good judgment" with no grounding).
- This is a distinct lens from the absolute-language review elsewhere in this skill: absolute language asks whether a rule is too broad; this asks whether a rule is too vague to execute at all.
- Vagueness is usually directly quotable and high confidence once identified — the hard part is noticing it, not confirming it.

## 8. Token efficiency — confidence: low
- Padding, redundant restatement of the same instruction, and decision-irrelevant background information are defects, not style nits — they cost context budget on every invocation.
- Confidence is low: this is the most subjective item on the checklist — reasonable authors disagree on how much restatement aids reliability versus wastes tokens, so treat findings here as suggestions, not firm defects.

## 9. GPT-6/Astra-specific guidance — confidence: medium (single primary source, not adversarially cross-verified)

Source: OpenAI, "Rethinking Skills and Prompts for GPT-6 Astra" (developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). Unlike items 1-8, this is drawn from one automated extraction pass of one blog post, not a 3-vote verified claim — treat findings here as suggestions to raise, not confirmed defects. Apply only when the reviewed artifact explicitly targets GPT-6/Astra/Codex; do not apply to a Claude-targeted skill.

- **Router pattern for multi-workflow skills:** for a skill covering several distinct workflows, the root document should be a minimal router that points to supporting docs/scripts rather than holding comprehensive guidance inline. (Same progressive-disclosure intent as item 2 above, independently stated for GPT-6.)
- **Description brevity under budget pressure:** OpenAI's own tooling (Codex) truncates skill descriptions when too many skills are installed — short, clear descriptions matter more as the number of installed skills grows, not just for the single-skill token count.
- **Narrow, concrete triggers:** prefer a specific trigger ("use when adding or changing a migration, or reviewing its rollout") over a broad category trigger ("use when working with databases") — broad triggers cause inappropriate/over-eager invocation.
- **Reduced prescriptiveness for capable models:** GPT-6-class models handle nuance well enough that rigid, step-by-step "recipes" or "itineraries" can now hinder results where they previously helped. This is about *how* a task is done, not *when/what* — it does not relax item 7's instruction-specificity requirement (being clear about trigger conditions, scope, and intent) or the absolute-language lens elsewhere in this skill; it only cautions against over-specifying procedure for a model capable of sound judgment. Flag an artifact that imposes a rigid multi-step recipe on a task that only needs a stated goal and constraints, when the artifact explicitly targets GPT-6/Astra.
- **AGENTS.md-style root docs:** don't require a full doc stack or repo map before every edit — that burns context and slows work on routine changes; scope file references conditionally (e.g., "use architecture.md for service boundaries, database.md for schema changes") instead of mandating blanket reading.
- Anti-patterns called out directly: overly broad or contradictory skill descriptions that cause inappropriate triggering, rigid "recipe"-style guidance for tasks needing judgment, mandating comprehensive doc review before routine edits, repetitive testing boilerplate, and overly restrictive boundary language that constrains a capable model without cause.

## Not established — do not flag, and do not require as a fix

These claims were explicitly tested and refuted during adversarial verification of the source research. They are not confirmed true, but they are also not confirmed false — do not encode either direction as a review criterion, and do not credit an artifact for having them or fault it for lacking them:

- That the `description` field is the sole or exclusive signal that triggers skill invocation.
- That artifact size is effectively unbounded because of progressive disclosure (the body-budget check in item 2 above still applies; this item only says not to treat total package size as unconstrained in either direction).
- That a `user-invocable: false` frontmatter field hides a skill from SDK/discovery arrays.
- That a tool description must let a reader "definitively determine" the single correct tool to use, or must include worked examples or stated defaults — the only confirmed requirement is the 3-4+ sentence coverage in item 4 above.
- That enum-constrained parameters prevent hallucinated/invalid values.

## Informational only — not a checklist item, not surfaced in SKILL.md

- System-message-vs-user-message placement for GPT-family prompts (role/tone in the system message, task specifics/examples in the user message) is generic current GPT-family guidance, not GPT-6-specific, and is **not applicable to Claude-targeted skills**. It's listed here purely for context in case a reviewed artifact explicitly targets a non-Claude deployment. Do not raise this in the `## Model best-practice findings` table for a Claude-targeted skill, and do not reference it anywhere in SKILL.md's body or summary checklist.
