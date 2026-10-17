---
name: blackboard
description: Use for any problem, topic, initiative, decision, or investigation that benefits from several specialist perspectives working over a shared board — discovery and research ("figure out why X", "explore options for Y"), decisions and tradeoffs ("should we A or B"), product or business planning, and implementation planning for features, architecture, migrations, or process changes. Produces goal-based objectives, a staffed panel of expert agents (from a standard dev/business library with BDD/Gherkin, UML, C4, ADR, and other documentation duties), recorded decisions and sidebars, and a detailed step-by-step plan for investigating or implementing. Use it whenever the user asks to plan, scope, explore, de-risk, or break down something ambiguous or cross-cutting, wants expert agents or a "blackboard" / "war room" / design-review style session, or wants a plan backed by documentation, even if they never say "blackboard".
---

# Blackboard

Work a problem through an opportunistic blackboard: a small rotating panel of specialist agents contributes typed, attributed entries to a shared board, a controller decides who acts next, and the board itself becomes the record. The output is a goal-based plan — step by step — for investigating, deciding, or implementing, plus the documentation each step needs.

The goal is the smallest coherent, evidence-backed model of the problem that satisfies agreed objectives. Consensus, activity, agent count, and ticket volume are not completion signals.

The design draws on 1970s blackboard systems (Hearsay-II, BB1, GBB), 2025 LLM blackboard research (LbMAS, volunteer-based blackboards, Terrarium), human design-review practice (ATAM, Fagan, NASA/Apollo boards, DACI/RAPID), and design-rationale methods (IBIS/QOC, ADR/MADR). Read [references/research-basis.md](references/research-basis.md) when you need the reasoning or sources behind a rule, or when the user asks why the skill works this way.

## When to use

Use it for anything above a well-specified task: incomplete, disputed, cross-domain, or likely to improve through back-and-forth. It works for software and non-software topics alike — a feature, an outage investigation, a pricing change, a vendor choice, a research question, a migration, a hiring process, a game mechanic.

Skip it for an ordinary implementation ticket, a bounded code review, or a question with one obvious answer.

### Scale the ceremony to the stakes

The board's logic (objectives, staffed panel, typed entries, decision records, harvested sidebars, step plan) always applies. Its **storage** does not have to. Pick a weight at the start and record it:

- **Light** — one person deciding, a conversational topic, no repository, or a single session. Keep the board as sections of one working markdown file (or just in context). No YAML contract files, no per-event files. Spend the effort on the deliverables the user will read.
- **Full** — real subagents are dispatched, work spans sessions or people, the board must survive handoff, or the user asks for it. Use the file layout in the board contract.

Light is the default unless a full-weight condition holds. In tests, a full YAML board on a solo business decision roughly doubled cost without improving the answer.

## Modes

Choose a mode at the start and record it on the control board. Modes chain: investigation often feeds a decision, and a decision feeds implementation. Switch mode when the board shows the current one is finished or wrong, and record why.

| Mode | Use when | Central question | Primary output |
| --- | --- | --- | --- |
| `investigate` | The problem, cause, landscape, or facts are unknown. | What is true, and what don't we know yet? | Findings with evidence, answered and open questions, investigation plan. |
| `decide` | Options exist (or can be generated) and must be weighed. | Which option best meets the objectives, and what are we giving up? | Option analysis, decision records, dissent, follow-on plan. |
| `implement` | The outcome is roughly agreed; the path is not. | How do we deliver and prove each objective is met? | Validation plan, sequenced step-by-step implementation plan, specs. |

## Architecture

Maintain two linked boards:

- **Domain board** — the problem and emerging solution: objectives, non-goals, observations, evidence, constraints, behaviors, hypotheses, options, risks, dependencies, decisions, documentation artifacts, and partial plans.
- **Control board** — the reasoning process: mode, current focus, roster, agenda of triggered activations, sidebars, parking lot, resource bounds, strategy, stalls, and why each next action was chosen.

Preserve five functional planes across those boards:

- **knowledge** — observations, evidence, and computations;
- **plan abstractions** — candidate patterns, strategies, options, and desirable properties;
- **emerging plan** — the partial solution and plan currently being developed;
- **executive** — priorities, focus, eligible activations, and scheduling;
- **meta-plan** — framing, mode, reasoning method, policies, and evaluation criteria.

The first three belong to the domain board, the last two to the control board. Organize domain artifacts across levels of abstraction. Generic levels that fit most topics:

- **outcomes** — what must become true and for whom;
- **options** — candidate ways to understand, structure, or solve the problem;
- **behaviors** — observable flows, mechanisms, boundaries, failures, and recovery;
- **delivery** — steps, slices, dependencies, owners, and validation.

Work moves in both directions. A delivery constraint can invalidate an option; a behavior can expose a missing outcome; evidence can revive a rejected alternative. Record these moves instead of smoothing them into a linear story. While requirements are vague, work level by level; once facts settle, let attention jump to the most promising island. (Hearsay-II found opportunistic jumping halved work at well-defined levels but was harmful at noisy ones.)

Specialists are knowledge sources with **propose-only** authority. They never call each other; they communicate through the board. The controller schedules work, validates contributions, and maintains derived state. It may not settle material product, scope, architecture, financial, or operational decisions that belong to the user or another named authority.

Read [references/board-contract.md](references/board-contract.md) before creating or resuming a persisted board. It defines artifact types, the objective tree, the contribution schema, agenda records, sidebars, decision records, the parking lot, and readiness checks.

## Step 1 — Frame goal-based objectives

Before staffing anything, turn the request into an **objective tree**. Experts are chosen to serve objectives, so a vague objective produces a vague roster.

1. **Mission** — one sentence: what must be true when this work is done, and for whom.
2. **Objectives** — 2–6 outcome statements, each with an observable success measure, the evidence that would prove it, a priority, and the authority who accepts it. Write outcomes ("on-call can identify the failing region within 5 minutes"), not activities ("look at monitoring").
3. **Key questions or asks** under each objective — the specific unknowns (`investigate`), choices (`decide`), or deliverables (`implement`) that must be resolved to meet it.
4. **Non-goals and constraints** — what is explicitly out, plus budget, deadline, policy, and technical limits.
5. **Evaluation criteria** — how options or plans will be compared (cost, risk, time, reversibility, user impact, …). These become the tradeoff axes that drive staffing.

If the request is too thin to write measurable objectives, search available evidence first (code, docs, prior decisions, the existing board). Ask the user only for what evidence cannot supply, and propose draft objectives for them to correct rather than asking open-ended questions. Classify each decision the work will produce as **one-way door** (costly to reverse — more experts, a contra-memo step, explicit user sign-off) or **two-way door** (cheap to reverse — move fast, fewer experts).

## Step 2 — Staff the board

### Process roles are not experts

Keep process roles separate from domain experts and outside the expert count. In the LbMAS ablation, removing the controller nearly quadrupled token use with no accuracy gain; MAST found weak verification and missed completion among the top multi-agent failure causes.

| Process role | Responsibility | Usually played by |
| --- | --- | --- |
| `facilitator` | Runs the control loop: selects who acts, enforces turn equality, prevents runaway debate. | The controller (you). |
| `curator` | Keeps the board clean: dedupes, summarizes, prunes what agents *see* (never what is *stored*), writes cycle notes. | The controller, or a cheap subagent on large boards. |
| `verifier` | Checks evidence, traceability, and whether contributions actually met their goals. | A subagent that did not write the work under review. |
| `decider` | Holds decision rights for material choices. Exactly one per decision. | The user, unless they delegate a class of decisions. |
| `stopper` | Applies readiness, budget, stall, and round-cap rules; decides when the board is done. | The controller. |

Definitions are in [references/agents/process-roles.md](references/agents/process-roles.md).

### How many experts

- **Active panel: 3–5 experts per wave, default 4.** Use 1 for a trivial question, 2–4 for an A-vs-B tradeoff. Group-size evidence (about 4 voices per conversation, satisfaction peaking at 4–5, costs rising faster than people expect), review practice (ATAM 3–5 evaluators, Fagan 3–7, Apollo's 5-member board), and multi-agent results (Anthropic's 3–5 parallel subagents; AgentVerse getting *worse* on math with more reviewers) all land in this band.
- **Standing roster: any size.** Keep the wider roster on the control board and rotate members in by topic, level, island, or canvas tab. Scale by adding islands (parallel rooms with their own small panel), not by enlarging one room. Apollo ran subsystem reviews first, then an integrated review, then a five-member change board.
- **Widen only when it pays.** Add experts when the top options are rated about equally (the Hearsay-II rule), when an objective or tradeoff axis has no owner, or when a one-way-door decision is pending. More voting samples help on answer-checking tasks; more *distinct experts* do not automatically help deliberation.
- **Every extra expert costs integration.** n experts produce n(n−1)/2 critique pairs (5 → 10, 7 → 21). Multi-agent runs cost roughly 15× the tokens of chat.

### Which experts

Pick experts by the **structure of the problem**, not by job titles:

1. **Coverage matrix.** Rows are board levels and level transitions (outcomes → options → behaviors → delivery). Columns are objectives and evaluation criteria (tradeoff axes). Each transition needs at least one generator and one verifier; each tradeoff axis needs one owner. An empty cell is a silent failure — a missing expert never announces itself — so an empty cell triggers recruitment.
2. **Documentation duties.** Each output document (Gherkin features, C4 diagrams, ADRs, a risk register, …) needs a responsible expert. The library lists which agent owns which artifact.
3. **Unique knowledge.** Prefer the expert who knows something no one else on the panel knows. Groups tend to discuss shared information and miss unique facts, so ask each expert for what only its perspective reveals before convergence.
4. **Authentic dissent.** Seat at least one expert whose objective *genuinely conflicts* with the emerging consensus (the cost owner against the reliability owner, the operator against the builder). An assigned devil's advocate is far weaker than a real conflicting goal. Before a one-way-door decision, run a contra-memo: the dissenting expert writes the full case for the leading alternative.
5. **Downstream verifier.** Always include someone who must live with or check the result (tester, operator, support, finance, end user) — the Fagan "tester seat".

Write each expert as a **goal contract**, not a persona: one definitive observable goal, trigger, inputs, owned tradeoff axis, artifact types and documents it produces, completion and blocking conditions, bound, and fallback. Persona titles barely move accuracy; specific objectives, output formats, and boundaries do. "Identify every affected trust boundary and give each material risk an evidence-backed disposition" is a goal; "review security" is not.

### Start from the standard library

[references/agents/README.md](references/agents/README.md) catalogs ready-made experts for software development (requirements/BDD, domain modeling/UML, architecture/C4+ADR, API contracts, data, security, testing, reliability, UX, delivery) and business work (business analysis, process, finance, market and customer research, risk and compliance, stakeholders and change, strategy), plus investigation roles (evidence researcher, root-cause analyst, skeptic). Each definition names its documentation duties and standards. Load only the definitions you will dispatch. Adapt or create roles freely — record `specializes: <library-id>` when you narrow one, and register new roles with the event that justified them.

When the bundled Claude Code subagent files are installed (see `subagents/` and `scripts/build_subagents.py`), dispatch the matching subagent type; otherwise dispatch a general-purpose agent with the library definition pasted into its brief. If no subagent tool exists, play the roles sequentially yourself and label the output honestly as single-agent role play.

### Announce the wave

Before each delegated wave, announce only the experts actually being dispatched:

```text
Blackboard roster — cycle <cycle-id>, board v<version>, mode <mode>
- <stable-name> — <speciality>: goal <observable outcome>; owns <axis/doc>; triggered by <artifact IDs>; investigates <question>; returns <artifact types and documents>.
Bench: <roster members not dispatched this wave and why>
```

Record the announcement and dispatch in `.tmp/planning/blackboard/<board-id>/dispatch.yaml` (verify `.tmp/` is gitignored first). Each dispatch includes the board version, triggering artifact IDs, bounded scope, question, authority, readable paths, prohibited mutations, deadline, fallback, and return contract. Use `planned` until a real handle exists and `dispatched` afterward.

## Step 3 — Run the opportunistic control loop

Run cycles until a stop condition is met. Do not pre-commit to a phase pipeline or a fixed roster.

1. **Observe the delta.** Compare the board with the prior version: additions, revisions, contradictions, newly answerable questions, reopened items, stale evidence, empty coverage cells.
2. **Generate opportunities.** Evaluate every roster trigger against the delta. When the delta changes a behavior, rule, setting, variant, boundary, or shared mechanism, trigger an implication sweep. Create an activation record for each plausible contribution; do not dispatch yet.
3. **Select, don't round-robin.** Ask candidates for a cheap **response frame** — one line on what they would add and which artifacts it would change — or post an unaddressed request and let relevant experts volunteer. Select the activations most likely to reduce a material uncertainty, resolve a critical conflict, test a central hypothesis, or unblock downstream work. Keep the wave at 3–5 experts. (Selector-driven boards cut tokens about 3.7× at similar accuracy; volunteer boards beat assigned sub-agents by 14–57%.)
4. **Record control.** Write the focus, alternatives considered, priority signals, bound, and expected delta to the control board.
5. **Fan out independently.** Dispatch with the same board version, trigger IDs, bounded question, evidence requirements, and contribution schema. On a fresh question, experts assess *without seeing each other's drafts* first — like Amazon's silent memo reading or 1-2-4-All — to avoid anchoring.
6. **Validate.** Reject or retry malformed contributions without filling gaps by inference. Check evidence, scope, authority, changed paths, documentation standards, and base version.
7. **Apply as events.** Append valid contributions, preserve provenance and competing hypotheses, derive a new snapshot, increment the version. Never last-writer-wins.
8. **Converge centrally.** Synthesis happens in one place with full context (the facilitator, then the decider), not in open-ended agent debate. Debate adds little beyond independent assessment plus aggregation, and uncoordinated agents amplify each other's errors. Target critique at specific disagreements; open a sidebar when it needs more than one exchange.
9. **React and re-staff.** Let new artifacts trigger the next cycle. Update the contribution ledger (which experts' entries survived, changed the board, or were noise), recruit for empty coverage cells and unanswered questions, and merge or bench experts whose contributions duplicate others or never change the board.
10. **Reassess strategy.** If progress stalls, change approach: move up or down a level, switch evidence-first and hypothesis-first, bring in the dissenter, split an island, or ask the user for missing authority. Record why.
11. **Check stopping conditions** (readiness, blocked, budget, round cap, exhaustion below).

### Priority order

1. correctness, safety, authorization, legal, or irreversible-risk blocker;
2. contradiction affecting the central objective or critical path;
3. question with high expected information gain;
4. work that unblocks several other artifacts;
5. cheap, reversible exploration that discriminates between live hypotheses;
6. completeness, documentation polish.

Do not let an easy leaf displace an unresolved premise because it is easier to finish.

## Implication sweeps and balanced coverage

Treat a material change as a possible member of a larger case family: sibling cases, shared invariants, consumers, dependents, lifecycle states, and counterexamples supported by evidence. Examples: other supported languages after a locale change, other roles after a permission change, other regions after a pricing change, other states after a transition change.

For each discovered case, record the trigger, relationship, authoritative source, and one disposition: `required`, `covered`, `research`, `deferred`, `not-applicable`, or `duplicate`. A plausible relationship without evidence is `research`, not a fact. Balanced coverage means every known member is considered under the same relevant dimensions and evidence standard. It does not mean equal effort or a blind cross-product. Shared evidence may cover an equivalence class when the common mechanism is demonstrated. Product-impacting scope expansion requires user authority. Full rules are in the board contract.

## Back-and-forth refinement

Contributions use explicit operations: `propose`, `support`, `challenge`, `refine`, `split`, `connect`, `answer`, or `retract`, each targeting stable artifact IDs and creating a new event. Revisions preserve earlier versions through typed relations (`supports`, `challenges`, `responds-to`, `refines`, `depends-on`, `blocks`, `answers`, `derived-from`, `supersedes`, `duplicates`, `same-family-as`, `shares-invariant-with`, `can-regress`, `counterexample-to`).

For a material challenge: preserve proposal and challenge as distinct artifacts; ask whether evidence can decide it; give the proposer a chance to respond to the strongest form of the challenge; synthesize only if the synthesis preserves the real tradeoff; escalate value judgments to the decider once evidence questions are exhausted. Rejection is memory, not deletion: keep the rejected option, rationale, authority, and reopening conditions.

## Sidebars and the parking lot

Side conversations are where useful divergence happens and where decisions get lost. Every mature practice (Open Space harvests, 1-2-4-All, Rust's "summarize offline discussion back onto the RFC") converges on one rule: **a sidebar is fine; an unharvested sidebar is a failure.**

Open a **sidebar** on the control board when:

- two supported artifacts conflict on facts, required behavior, authorization, or safety (a **disagreement room**);
- a narrow question needs a few experts and several exchanges (a **working sidebar**);
- an expert needs verification of its own claim (a **verification sidebar**).

Each sidebar records a parent anchor (artifact, decision, step, or canvas node), a purpose question, participants (usually 2–3), the base board version, a bound, and status `open`, `converged`, `parked`, or `abandoned`. It **cannot close without a harvest** posted to the main board: summary, decision candidates, new issues, action items, and preserved dissent, linked to the full transcript. Close disagreements by evidence or by the named authority — never by majority vote, confidence averaging, or last-writer-wins. Sidebars scope context; they are not a privacy boundary, so never brief an expert with secrets on the assumption a sidebar contains them.

Keep a **parking lot** for out-of-scope or premature items: origin artifact, raiser, why parked, and at review time one disposition — `delete`, `defer` (owner, expiry, re-entry condition), or `delegate` (owner). Review it before every readiness check; an ownerless parking lot is hidden scope.

## Documentation

Let the board be the minutes. Agents remove the capture cost that killed earlier design-rationale tools, so every entry is typed, attributed, timestamped, and linked as it is written. The remaining cost is human reading time, so curate summaries on top.

- **Live deliberation** uses IBIS/QOC structure: questions, options, criteria, arguments, assessments.
- **Decisions** become decision records: MADR fields plus a one-sentence **Y-statement** ("In the context of …, facing …, we decided for … and neglected …, to achieve …, accepting that …"), a one-way/two-way door flag, each participating expert's stance (`agree`, `disagree-and-commit`, `block` with reason), a confirmation check, and a pinned board version. Records are numbered, never deleted, and reversed only by a superseding record. Software architecture decisions also become ADRs.
- **Domain documents** are produced by the expert who owns them, to the standard in [references/documentation/](references/documentation/README.md): Gherkin/BDD features, UML (class, sequence, state, activity, use-case), C4 (context, container, component, deployment), ADRs, ERDs, OpenAPI/AsyncAPI contracts, threat models, BPMN process maps, risk registers, business cases, and others. Prefer Mermaid for diagrams unless the user's repo uses another notation. Every document traces to the objectives and decisions it serves.
- **Traceability** is bidirectional: objective ↔ question/ask ↔ decision ↔ document ↔ plan step ↔ validation check ↔ origin sidebar ↔ superseded record.

Write documents only when they serve an objective, a decision, or a plan step. A board that produces six diagrams nobody needs is noise.

## User participation

Treat a user correction, constraint, answer, or reframing as an authoritative board event, not a reason to discard the board. Mark affected artifacts contested, superseded, stale, or reopened; preserve the cause; regenerate the agenda. A user decision does not rewrite contrary evidence; it records the chosen tradeoff with that evidence visible.

Ask the user only after evidence and specialist work cannot resolve a material issue. Show the live alternatives, strongest supported tradeoff, affected IDs, and why it needs their authority. After the answer, update only the affected artifacts and resume. Generated experts are contributors with a voice and no vote; the user is the decider unless they delegate.

## Parallel islands

Partition independent questions into islands with their own scope, small panel, version base, and exit condition. Record shared invariants and join points. An island blocker blocks only that island unless it invalidates a shared invariant or the parent objective. Before merging, check the base version and shared invariants, rebase or re-review stale work, and run an integration review at each join.

## Evidence and uncertainty

Separate observations, interpretations, and recommendations. Every material claim cites evidence or is marked `unverified`. External evidence records source, retrieval time, version, and local verification status. Repository evidence uses stable paths plus symbols, lines, tests, commands, or commits.

Confidence ratings are signals, not truth. Single-expert confidence is unreliable (Hearsay-II's ratings put the correct word only around 4.5th of 20), so prefer corroboration from independent experts or evidence. Treat accepted decision records as constraints until superseded; drafts are hypotheses; rejected and superseded records remain evidence.

Before asking the user, search code, tests, schemas, feature files, decisions, research, and the board. Bound the search. When nothing can answer safely, create a `human-required` question with owner, affected IDs, why evidence is insufficient, and the re-entry condition.

## Stall, budget, and recovery

Repeated activations with no meaningful delta, duplicate findings, circular challenges, or unchanged confidence are a stall. Record it and try one materially different strategy; don't spend budget paraphrasing.

Every run has a bounded cycle, time, or cost budget. Default round cap: 4 waves on a single question before the stopper forces a strategy change or a user question. Reaching a bound never implies readiness: persist the snapshot, agenda, open sidebars, parked items, blocked islands, and a precise resume trigger.

Blackboard state under `.tmp/planning/` is working state, never committed. Promote only finalized, approved projections (plans, specs, decision records, diagrams) to a user-approved location and record the promotion. On resume, verify sources, board version, open sidebars, decisions, and shared invariants before dispatching.

## Readiness

`parent-ready`: mission, objectives with success measures, non-goals, evaluation criteria, constraints, main behaviors or findings, live hypotheses, blocking questions, and material case families are explicit enough to begin the next mode or downstream work.

`final-ready`: the requested plan and documents exist; all material claims trace to evidence or authorized decisions; every objective has a met success measure or a planned validation; material implication sweeps are balanced and closed; no blocking conflict, open disagreement sidebar, ownerless parking-lot item, stale island, or unresolved `required`/`research` case remains; and a completeness cycle found no material omission. Silence and budget exhaustion are not approval.

`blocked`: names the affected artifact or island, owner, evidence, and re-entry condition. Continue other islands unless the blocker invalidates the parent.

Before declaring readiness, ask:

- Can any triggered expert, or any empty cell in the coverage matrix, materially change the conclusion?
- Did recent changes create an expert need that the initial roster lacked?
- Does any material change lack a balanced implication sweep?
- Is any sidebar unharvested, or any parked item without a disposition?

If any answer is yes, continue. The final completeness cycle evaluates all triggers and the coverage matrix against the full candidate output, not just the last delta.

## Step 4 — Produce the step-by-step plan

Every run ends in a plan the user can execute, shaped by mode. Read [references/planning-outputs.md](references/planning-outputs.md) for the templates. Every step has:

- **ID and objective link** — which objective and question/ask it advances;
- **owner** — library role or human, plus the decider for any decision it produces;
- **inputs** — evidence, documents, access, and prior steps it needs;
- **actions** — concrete, ordered actions specific enough that someone else could start;
- **outputs** — board artifacts and documents produced, named by standard (e.g. `features/checkout-refund.feature`, ADR-0007, C4 container view);
- **exit criterion** — the observable condition that ends the step, including what result would change the plan (for investigations, the finding that would kill or redirect a hypothesis);
- **verification** — how someone checks the output (test, review, metric, source);
- **dependencies, effort, and risk** — what it waits on, a comparative size, and what could go wrong.

These fields apply to **every** step you present as part of the plan, including follow-on steps after a decision and steps inside post-decision playbooks. If a later step can't be specified yet, keep it out of the numbered plan and list it under "Sketched next steps" with the trigger that will make it plannable — don't present half-specified steps as plan steps.

Investigation plans order steps by information gain per cost and include decision points ("if X, go to step 5; else step 7"). Decision plans end in a decision record and its follow-on implementation or validation steps. Implementation plans reach a first end-to-end validated slice before breadth work, and map every step back to an objective — work with no objective is scope creep, and an objective with no check is unverified.

## Completion output

Return a concise projection of the board, not a transcript. Everything below belongs in what the user reads (the reply or the delivered documents), not only in board working files — a panel or decision that exists only in `control.yaml` is invisible to them:

- mode(s), mission, objective tree with success measures, non-goals, and evaluation criteria;
- roster used: experts per wave, who was benched or added and why, and the coverage matrix with any intentionally empty cells;
- current model of the problem: findings, behaviors, or options;
- decisions as Y-statements with stances and dissent; accepted, contested, rejected, and deferred hypotheses;
- documentation produced (with paths) and what each serves;
- sidebar harvests and parking-lot dispositions;
- evidence, risks, dependencies, and open questions;
- the step-by-step plan;
- control summary: cycles run, strategy shifts, stalls, blocked islands, why processing stopped, and the contribution ledger (whose entries survived into decisions);
- verdict: `parent-ready`, `final-ready`, or `blocked`.

### Required closing block

End the reply to the user with this block, filled from the board. It is the part most often lost when work stays in working files, so write it even when the same content appears in a delivered document:

```markdown
## Board summary
- **Mode / weight:** <mode(s)> · <light|full> · <single-agent role play | N subagents dispatched>
- **Mission:** <one sentence>
- **Objectives:** <id — outcome — success measure> (one line each)
- **Panel:** wave 1: <3–5 experts> · later waves: <changes> · bench: <role — why not active>
- **Decisions:** <id — Y-statement — status — stances (agree / disagree-and-commit / block)>
- **Open sidebars / parking lot:** <id — disposition>
- **Plan check:** <N> steps, all with objective link, owner, exit criterion, verification: yes | no (<which are missing>)
- **Unverified claims:** <list, or "none">
- **Verdict:** parent-ready | final-ready | blocked — <why>
```

Before sending, actually perform the plan check: walk every numbered step and confirm all four fields are present. Fix a missing field rather than reporting it, unless it genuinely can't be known yet; then move the step to "Sketched next steps".

### Evidence integrity

Every number or fact attributed to a source must come from a source you actually read in this run. If a page failed to load, say so and do not cite it for that figure; label remembered figures as `unverified (recalled)`. Never attach a citation to a figure the cited page did not contain.

Do not claim that agents, commands, tests, or research ran unless they did. Do not convert an unresolved material choice into a recommendation to make the board look complete.
