---
name: forge-game-idea
description: Use when turning an early or partial game concept into a distinctive, decision-ready game design and delivery plan across genres, platforms, and team sizes.
---

# Forge Game Idea

Turn a game concept into a coherent, distinctive plan that a team can evaluate and later break into work. The plan is a proposal, not authorization to implement or to decide material product questions for the user.

**Blackboard routing:** Use `blackboard` when the concept has material uncertainty, cross-domain tradeoffs, conflicting constraints, or needs specialist refinement or linked capability/feature planning. Follow its current SKILL.md and board contract for scope, evidence, authority, conflicts, stable IDs, and readiness; do not replace its process with a fixed review panel or consensus vote. For a small, bounded, low-stakes brainstorm, answer directly and keep decisions and assumptions clear. Use `prompt-review` when reviewing this skill or its instructions.

## When to use

Use for an original game idea, a rough pitch, a prototype concept that needs a broader design, or a request to compare and refine game directions. For a settled implementation request, use an implementation workflow instead. Do not imply that a game concept is wholly unprecedented; describe its specific differentiators and comparisons honestly.

## Working agreement

1. Restate the desired outcome and identify what the user has and has not decided. Inspect supplied material that is relevant, accessible, and authorized for this use before asking questions. If a source is unavailable, too large to review within the agreed scope, or contains private material that should not be shared, record that limit and do not transmit it to specialists without authorization.
2. Ask questions only when the answer could change the game's identity, intended audience, player experience, platform, scope, a material safety/rights/privacy obligation, or a high-cost design choice. Batch the key questions. Offer clearly labeled options when helpful. Continue with reversible proposals only when the user wants exploration; mark them as assumptions with owner and re-entry condition.
3. Set up a Blackboard with goals, non-goals, evidence, constraints, hypotheses, alternatives, behaviors, risks, dependencies, and evaluation criteria. Keep concepts, observed facts, and recommendations distinct. The user (or another identifiable, authorized decision owner) decides material product choices; specialists propose evidence and options only. Record accepted decisions with owner, date, scope, and an approval artifact; if sources conflict, preserve the conflict and ask the authorized owner rather than inferring precedence.
4. Choose specialists dynamically from actual uncertainties. Potential lenses include game design, narrative, player research/accessibility, technical feasibility, production, audio/visual direction, online systems, and commercial viability. Use only relevant roles. Separate overlapping scopes, specify deliverables and deadlines, and record dispatches and contributions per Blackboard guidance. Use the configured review window; mark silence, stale work, unavailable roles, or malformed contributions blocked and follow Blackboard's retry/fallback path rather than treating them as approval. Ask an end-user advocate to review player-facing trust, agency, accessibility, failure, and recovery when those concerns apply.
5. Iterate on the highest-impact uncertainty. Challenge the central hook, inspect counterexamples and adjacent cases, preserve disagreement, and revise the board when new evidence changes a premise. Do not equate volume of ideas, role consensus, or a long document with readiness.
6. Draft the game plan only when parent readiness is met. After drafting, run Blackboard's post-draft completeness pass: each participating expert checks their owned areas for missing, incorrect, unsafe, or unsupported content. Keep actionable gaps open; do not label the plan final-ready while required reviews or human decisions are unresolved.

## Game-plan contents

Include the sections that matter to this game. For each, give a concise proposal, evidence or rationale, and status (decided, proposed, assumption, or open). Mark irrelevant sections `not applicable` with a reason rather than silently omitting an expected concern.

1. **Pitch and identity:** working title (clearly provisional), genre/subgenre, one-sentence hook, short pitch, target experience, intended audience, platform/context, and the specific differentiators. Compare relevant precedents only to clarify the design; do not present resemblance as originality.
2. **Player promise:** player fantasy, design pillars (observable and testable), emotional range, accessibility goals tied to likely input, sensory, and cognitive needs, intended session shape, and what players should remember. Where accessibility is material, define observable acceptance criteria and a plan to validate them with affected players; label unvalidated goals as hypotheses.
3. **Core play:** primary gameplay loop, moment-to-moment verbs, challenges, choices, consequences, progression, fail/success states, replay or ending structure, and an illustrative play sequence that demonstrates internal coherence without claiming the loop has been proven. Identify mechanics still needing a prototype or playtest; only observed prototype/playtest results count as evidence that the loop works.
4. **Systems and content:** major mechanics, rules, resources, pacing, difficulty, world/level structure, content types, narrative delivery and cast/world where relevant, and how systems reinforce the pillars. Avoid specifying content volume without a scope basis.
5. **Player journeys and edge cases:** onboarding, normal play, pause/resume, save/load or session recovery as relevant, failure, accessibility settings, online/offline transitions where relevant, and abuse/moderation cases when social or user-generated features create those risks. Use a simple applicability/risk check: identify relevant player roles, data or identity use, social surfaces, and likely harms; include cases such as cheating, reports, appeals, and moderation response only when the concept warrants them. Describe observable behavior, not implementation guesses.
6. **Presentation:** visual and audio direction, readability, feedback, interface needs, and accessibility accommodations. Distinguish mood references from requirements and provide text alternatives for visual-only direction.
7. **Technical and production shape:** target devices/platform constraints, single/multiplayer and network assumptions, data/content needs, tools or risks that could affect design, vertical-slice/prototype strategy, and build-vs-cut tradeoffs. If staffing, schedule, budget, distribution, or support constraints could change feasibility and are unknown, ask for them or label bounded assumptions and their impact; do not invent estimates as commitments. Include platform/store certification, localization, age-rating/content-rating, legal/IP, and support gates only when relevant to the selected platform, audience, content, or distribution path, and identify evidence or approval still needed.
8. **Business and live operation (conditional):** monetization, distribution, retention, updates, privacy, safety, and ongoing operations when requested or triggered by features such as accounts, personal data, user-generated content, children as an intended audience, online play, or ongoing service. Treat these as explicit decisions; do not assume ads, purchases, accounts, telemetry, or live service. If a trigger applies, identify the relevant risk, decision owner, and required review; otherwise state why the area is not applicable.
9. **Risks and validation:** highest-impact hypotheses, cheap tests or prototypes, success/failure thresholds, test owner and player/context, dependencies, open decisions with owner and due/re-entry condition, and alternatives if a core hypothesis fails. Define how inconclusive results change the next test or decision; do not present proposed thresholds as observed results.
10. **Delivery map:** capability-level slices, dependencies, parallel lanes, join points, and critical path. Include feature-level behavior drafts only when requested or needed to make the plan verifiable. Do not create implementation tickets unless the current authorized user explicitly requests them; bound ticket scope to that request.

## Distinctiveness and coherence checks

- Express the hook as a player-visible combination of action, tension, and consequence—not a list of genre labels or features.
- For each pillar, identify at least one mechanic or player behavior that demonstrates it and one design choice that protects it.
- Check that the core loop, progression, content, presentation, and business model do not undermine the stated player promise.
- Name comparable works only as analysis, when relevant. Cite dated sources for factual comparisons; label unsourced comparisons as hypotheses or omit them. State what is shared and what differs. Treat a play sequence as illustration, not test evidence. Never claim legal clearance or guaranteed uniqueness; route legal conclusions to an authorized legal reviewer.
- Prefer a small number of integrated, testable ideas over feature accumulation. Flag combinations that need a prototype before they can be judged.

## Output

Return a readable plan in this order:

1. Resolved scope, audience/player promise, and non-goals.
2. Current decisions, evidence, assumptions, and open questions.
3. Game identity, differentiators, pillars, and core loop.
4. Systems, content, player journeys, and presentation relevant to the concept.
5. Technical/production shape and conditional business/live-operation decisions.
6. Validation plan, risks, dependencies, delivery map, parallel lanes, and critical path.
7. Deferred items with owner, affected IDs, expiry/approval record, and re-entry condition.
8. Readiness verdict: `parent-ready`, `blocked`, or `final-ready`, with reasons under Blackboard's definitions. A verdict applies to the Blackboard plan, not a compact brainstorm; unknown feasibility gates remain assumptions or blockers rather than implied approvals.

Cite paths or dated sources for evidence when available. Label recommendations and assumptions; do not write them as accepted decisions or commitments. Treat the Blackboard as the source of stable IDs, decision records, and re-entry conditions when one exists. Every unresolved blocker must name an owner, affected stable IDs, why current evidence is insufficient, and what reopens the question. A deferral must be reversible, scoped, time-bounded, and authorized by the decision owner defined in the Blackboard contract; record the approval artifact and expiry, and reopen it at expiry per Blackboard guidance. If the owner or approval artifact is missing, keep the item blocked rather than treating it as deferred. If the user asked only for a brainstorm, return a compact set of distinct directions plus the key choice that separates them; do not force a full production plan or imply parent-ready/final-ready status. This lightweight path may skip Blackboard when it is small, bounded, and low-stakes; it does not count as a completed readiness-checked plan.
