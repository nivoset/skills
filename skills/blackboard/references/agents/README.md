# Standard agent library

Ready-made experts for development, business, and investigation boards. Each file is a goal contract: definitive goal, owned tradeoff axes, triggers, inputs, outputs, documentation duties with the standard they must meet, natural dissent partners, and completion/blocking conditions. All experts are **propose-only**.

Load only the definitions you will dispatch this wave. **Tier** is the recommended model class (`deep` / `standard` / `fast`); see [../models.md](../models.md) for the evidence and the Claude Code, Codex, and OpenRouter mappings. Process roles (facilitator, curator, verifier, decider, stopper) are in [process-roles.md](process-roles.md) and are not counted toward the 3–5 active experts.

## Development

| ID | Tier | Owns (axis / transition) | Documentation duties | Natural dissent with |
| --- | --- | --- | --- | --- |
| [requirements-analyst](requirements-analyst.md) | `fast` | outcomes → behaviors; scope fidelity | Gherkin features, example maps, use-case table | solution-architect, delivery-planner |
| [domain-modeler](domain-modeler.md) | `standard` | concepts, invariants, lifecycles | UML class + state, glossary, context map | api-integration-designer |
| [solution-architect](solution-architect.md) | `deep` | options → structure; quality attributes | C4 context/container/component, ADRs, quality-attribute scenarios | finance-analyst, sre-reliability |
| [api-integration-designer](api-integration-designer.md) | `standard` | interfaces, compatibility | OpenAPI/AsyncAPI, UML sequence | domain-modeler, security-reviewer |
| [data-engineer](data-engineer.md) | `standard` | data invariants, migration | ERD + data dictionary, migration plan | delivery-planner |
| [security-reviewer](security-reviewer.md) | `standard` | trust boundaries, abuse | STRIDE threat model, negative Gherkin scenarios | ux-flow-designer, delivery-planner |
| [qa-test-strategist](qa-test-strategist.md) | `standard` | verifiability | Validation plan, test strategy, Gherkin review | delivery-planner |
| [sre-reliability](sre-reliability.md) | `deep` | operability, availability, release safety | C4 deployment, SLOs, runbooks, release/rollback | solution-architect, finance-analyst |
| [ux-flow-designer](ux-flow-designer.md) | `fast` | interaction flows and UI states | Journey map, UML state/activity flows, UI state matrix | security-reviewer |
| [end-user-advocate](end-user-advocate.md) | `fast` | trust, agency, accessibility, recovery | Accessibility checks, recovery scenarios | product-strategist, finance-analyst |
| [delivery-planner](delivery-planner.md) | `standard` | delivery → sequence; time to value | Story map, slice plan, Mermaid Gantt, dependency graph | qa-test-strategist, security-reviewer |
| [codebase-researcher](codebase-researcher.md) | `deep` | repository evidence | Findings log with path/line evidence, current-state C4 | anyone making unverified claims |

## Business

| ID | Tier | Owns | Documentation duties | Natural dissent with |
| --- | --- | --- | --- | --- |
| [business-analyst](business-analyst.md) | `standard` | process and business rules | BPMN/swimlanes, SIPOC, business-rule catalog, RACI | product-strategist |
| [product-strategist](product-strategist.md) | `deep` | value, positioning, objectives | OKRs, Lean/Business Model Canvas, JTBD | finance-analyst, end-user-advocate |
| [finance-analyst](finance-analyst.md) | `standard` | cost, ROI, budget | Business case, cost model, sensitivity analysis | solution-architect, product-strategist |
| [market-customer-researcher](market-customer-researcher.md) | `standard` | customer evidence, market | Personas, research briefs, competitive analysis, journey maps | product-strategist |
| [risk-compliance-officer](risk-compliance-officer.md) | `standard` | risk, regulation, privacy | Risk register, controls mapping, DPIA | delivery-planner, product-strategist |
| [stakeholder-change-lead](stakeholder-change-lead.md) | `fast` | adoption, decision rights | Stakeholder map, DACI/RACI, comms and change plan | delivery-planner |

## Investigation (any domain)

| ID | Tier | Owns | Documentation duties | Natural dissent with |
| --- | --- | --- | --- | --- |
| [evidence-researcher](evidence-researcher.md) | `standard` | external and documentary evidence | Research brief, findings log with dated sources | skeptic |
| [root-cause-analyst](root-cause-analyst.md) | `standard` | causal explanation | Timeline, fishbone, 5 whys, fault tree | skeptic, sre-reliability |
| [skeptic](skeptic.md) | `deep` | falsification of the leading view | Pre-mortem, contra-memo | whoever leads |

## Picking a starting panel

| Situation | Starting active panel (3–5) | Bench to rotate in |
| --- | --- | --- |
| New feature, behavior unclear | requirements-analyst, domain-modeler, ux-flow-designer, qa-test-strategist | security-reviewer, solution-architect, delivery-planner |
| Architecture / platform decision | solution-architect, sre-reliability, finance-analyst, skeptic | security-reviewer, data-engineer, codebase-researcher |
| Integration or API change | api-integration-designer, security-reviewer, qa-test-strategist, codebase-researcher | sre-reliability, domain-modeler |
| Data migration | data-engineer, sre-reliability, qa-test-strategist, risk-compliance-officer | codebase-researcher, delivery-planner |
| Outage / defect investigation | root-cause-analyst, codebase-researcher, sre-reliability, skeptic | evidence-researcher, qa-test-strategist |
| Business process change | business-analyst, stakeholder-change-lead, finance-analyst, risk-compliance-officer | end-user-advocate, product-strategist |
| New product / market bet | product-strategist, market-customer-researcher, finance-analyst, skeptic | end-user-advocate, risk-compliance-officer |
| Open research question | evidence-researcher, skeptic, + 1–2 domain experts for the topic | root-cause-analyst |

These are starting points. Re-select from board state every cycle using the coverage matrix.

## Relationship to the example overlays

The files in `examples/` (delivery planning, product strategy, auth, migration, performance, etc.) define finer-grained specialists such as `scope-guardian`, `edge-case-hunter`, or `authorization-policy-reviewer`. Treat them as specializations of library roles: record `specializes: <library-id>` and don't dispatch both for the same scope. Overlay roles inherit the documentation duties of the library role they specialize.

## Adding a role

Copy any definition, keep the section headings, and state one definitive observable goal. Register it in `roles.yaml` with the event that justified it. Give it a `tier` (and a one-line `tier_basis`). To make it available as a runnable subagent, add the file here and run `scripts/build_subagents.py --target all` (Claude Code, Codex, OpenRouter).
