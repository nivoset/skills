# Documentation standards

Each expert in the agent library owns specific documents. This folder defines the standard each document must meet before the verifier accepts it. Load only the standard for the documents in play.

| Standard | File | Typical owner | Use when | Don't use when |
| --- | --- | --- | --- | --- |
| BDD / Gherkin | [gherkin-bdd.md](gherkin-bdd.md) | `requirements-analyst`, `qa-test-strategist` | Observable behavior, business rules, acceptance criteria, permissions, recovery paths | Internal refactors, unit-level mechanics, pure infrastructure |
| UML | [uml.md](uml.md) | `domain-modeler`, `api-integration-designer`, `ux-flow-designer` | Domain structure (class), interactions over time (sequence), lifecycles (state), workflows (activity), actor goals (use case) | When a C4 view or a Gherkin scenario already says it more simply |
| C4 | [c4.md](c4.md) | `solution-architect`, `sre-reliability` | System boundaries, containers, components, deployment for software architecture | Business process flow (use BPMN), object lifecycles (use UML state) |
| ADR / decision record | [adr.md](adr.md) | `solution-architect` (ADR); facilitator (all decision records) | Every material decision; ADR specifically for architecturally significant ones | Trivial, easily reversed choices with no lasting constraint |
| Other formats | [other-formats.md](other-formats.md) | varies | OpenAPI/AsyncAPI, ERD, threat model, BPMN, risk register, business case, story map, journey map, RACI/DACI, OKRs, SLOs, runbooks, research briefs | — |

## Rules for every document

1. **Serves something.** Front matter or the first lines name the objective(s), decision(s), or plan step(s) it serves. A document that serves nothing is not produced.
2. **Traceable.** Uses board IDs (`obj-…`, `dec-…`, `q-…`) so reviewers can follow links both ways.
3. **Evidence-honest.** Facts cite evidence; assumptions are labeled `assumption:`; open questions are listed, not invented away.
4. **One level of abstraction per view.** Don't mix a context diagram with class attributes, or business rules with HTTP status codes.
5. **Diagrams as code.** Prefer Mermaid (renders in GitHub, docs tools, and most Markdown viewers). Use PlantUML or Structurizr DSL only if the repository already does. Every diagram has a title, a legend when notation is not obvious, and fewer than ~20 elements per view — split rather than cram.
6. **Draft on the board, promote on approval.** Drafts live under `.tmp/planning/blackboard/<board-id>/documents/`. Write to the repository (`features/`, `docs/adr/`, `docs/architecture/`, …) only when the user asks or approves, following existing repo conventions.
7. **Verifier checklist.** The `verifier` checks the standard's quality checklist and returns findings per item; a document is `accepted` only when every material item passes or is explicitly waived by the decider.

## Choosing a notation

- "What should happen, from the user's point of view?" → Gherkin.
- "What are the things and how do they relate?" → UML class / ERD.
- "Who talks to whom, in what order?" → UML sequence.
- "What states can it be in?" → UML state.
- "What runs where, and what are the boundaries?" → C4.
- "How does work flow across people and systems?" → BPMN or UML activity.
- "Why did we choose this?" → decision record / ADR.
- "What could go wrong?" → threat model, risk register, FMEA.
- "Is it worth it?" → business case.
