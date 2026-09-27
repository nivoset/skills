# Team Model

Use these role families to assign distinct, outcome-oriented goals. They are starting points, not a permanent roster or fixed minimum team size. Select enough relevant specialists to cover the main parts of the idea. Assign each a bounded question and evidence scope, and record their goal, authority, return contract, and handoff.

## Product leads

Have relevant product specialists work in parallel on non-duplicative areas. Typical ownership areas include:

- **Outcome and scope:** keep the intended result, success measures, and non-goals explicit; identify scope drift.
- **User and customer value:** identify affected user groups, their needs, accessibility, trust, agency, and recovery concerns.
- **Viability and differentiation:** examine the value proposition, alternatives, adoption assumptions, and build/support costs where evidence is available.
- **Assumptions and evaluation:** challenge central premises, define evidence that could disconfirm them, and make tradeoffs decision-ready.

Adapt or omit these areas based on the idea. Add domain experts such as privacy, security, compliance, or accessibility when their triggers apply. Reuse a role rather than duplicating it under another title. Specialists coordinate on overlaps and return a coherent set of recommendations and open issues for the user-controlled product gate.

Experts may resolve details that can be swapped out within a sprint or two without major changes. A decision is not trivial if it changes outcomes, users, scope, success measures, material risk or cost, infrastructure, system connections, or creates a hard-to-reverse commitment. Record such issues with options, evidence, affected work, and likely rework; the user or named human decision authority must sign off. Expert agreement is not a substitute for user approval at a gate.

## Technical and engineering specialists

After the user passes the product gate, activate only the disciplines implicated by the approved product direction and evidence. Common goals include:

- Define architecture boundaries, key components, dependencies, and constraints needed to meet accepted outcomes.
- Specify infrastructure, deployment, security, privacy, reliability, and operational requirements when triggered.
- Define data, API, event, and integration contracts, including relevant compatibility, error, retry, and ownership questions.
- Identify technical unknowns that need bounded research or a human decision before feature planning can proceed.

Engineering specialists may communicate directly with product specialists to refine system boundaries, contracts, sources, and plans. Technical recommendations do not silently change product behavior. If an option changes user outcomes, cost, risk, scope, infrastructure, or a system connection, return the tradeoff to product and the authorized human decision owner. The user passes the architecture and technical-plan gate before documentation preparation proceeds.

## Feature-preparation specialists

After the user passes the technical-plan gate, turn approved product and technical inputs into a reviewable, linked document set:

- Group Markdown documents by purpose, with an index and relative links to supporting, source, and prerequisite documents.
- Decompose outcomes into capabilities and feature-level drafts with observable acceptance behavior; use Gherkin where feature files fit the work.
- Define OpenAPI documents for applicable HTTP contracts, plus architecture, system connections, and technical plans; use Mermaid for diagrams where it clarifies the relationships.
- Map prerequisites, dependencies, parallel work, join points, and a critical path. Keep each rendered document under 10 pages and split oversized topics cleanly.
- Map each accepted ask to validation evidence and identify missing contracts, scenarios, or ownership.
- Review for gaps, ambiguity, contradictions, boundary and recovery cases, and unsupported assumptions; route findings upward.

Keep the breakdown at capability and feature level unless the user explicitly requests implementation tickets. Plans may describe how behavior should be verified. Run available lint and structural checks on included Markdown, Mermaid, Gherkin, and OpenAPI artifacts; report results and any unavailable checks. This checks the planning documents and does not authorize implementation or execution of product work. The user decides whether the documentation gate is passed.

## Handoff contract

Every tier receives the current board version, accepted constraints, relevant evidence, its bounded question, and its return schema. Every contribution identifies its base version, claims and recommendations, evidence, uncertainty, affected IDs, changed paths, and any new trigger. The main agent validates freshness and authority before integrating it. A later tier may flag an upstream gap, but may not silently rewrite an upstream decision. Material conflicts remain visible until resolved by evidence or the proper authority.

At every handoff or gate, check:

1. Which accepted outcomes and constraints does this work serve?
2. Which assumptions, decisions, contracts, or evidence does the next tier need?
3. What remains unclear, contradictory, unsafe, or unverified, and who owns re-entry?
4. Did this work introduce a new specialist trigger or invalidate an earlier review?
5. Is any unresolved choice likely to require major changes if reversed, and has the user or named decision authority signed off?
6. For documentation handoff, are all files linked, grouped by purpose, within the rendered page limit, and checked with the applicable available tools?
