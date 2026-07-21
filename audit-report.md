# Keep-or-Cut Audit Report

> Generated 2026-06-17 by running the `keep-or-cut` skill against all 14 SKILL.md files in parallel.

## Summary Dashboard

| Skill | Total | KEEP | CUT | Trim % | Assessment |
|-------|-------|------|-----|--------|------------|
| **bdd** | 52 | 41 | 11 | 21.2% | Mostly workflow/example redundancy |
| **linear-cli** | 58 | 47 | 11 | 19.0% | Some workflow steps restate operating rules |
| **naming** | 27 | 23 | 4 | 15.0% | Already tight; minor duplication |
| **objective-check** | 65 | 49 | 16 | 24.6% | Validation workflow re-states core rules |
| **planning-codebase-researcher** | 28 | 20 | 8 | 28.6% | Workflow duplicates core rules heavily |
| **planning-decomposer** | 35 | 25 | 10 | 28.6% | Same pattern — workflow echoes rules |
| **planning-orchestrator** | 43 | 35 | 8 | 18.6% | Compact already; minor cuts |
| **pr-bug-bash** | 66 | 63 | 3 | 4.5% | Very tight — almost nothing to cut |
| **pr-review** | 81 | 55 | 26 | 32.1% | Biggest trim opportunity — heavy redundancy with Core Rules and comment-contract.md |
| **questline** | 57 | 40 | 17 | 29.8% | Workflow steps + Common Mistakes repeat Core Rules |
| **tdd** | 84 | 71 | 13 | 15.5% | Loop steps re-state Core Rules; Purpose section is pure summary |
| **ticket-building-system** | 75 | 57 | 18 | 24.0% | Workflow steps duplicate reference sections |
| **ticket-master** | 220 | 193 | 27 | 12.3% | Dense/well-structured; mostly "PR targets integration branch" said 6x |
| **vette** | 60 | 53 | 7 | 11.7% | Tightest skill — almost all load-bearing |

## Key Patterns Across All Skills

### 1. Workflow sections restating Core Rules

The #1 source of bloat across the board. Nearly every skill has workflow steps that copy-paste rules verbatim. The core rules already govern agent behavior; re-stating them in ordered workflow steps adds tokens without adding signal.

**Affected skills:** pr-review, questline, tdd, objective-check, ticket-building-system, planning-decomposer, planning-codebase-researcher.

### 2. Purpose/Overview sections summarizing what follows

These "preview paragraphs" are consistently cuttable because the detailed sections that follow always say it better. They tend to be prose summaries of the entire file that duplicate frontmatter + core rules + workflow.

**Affected skills:** tdd, pr-review, questline, ticket-building-system, bdd.

### 3. Common Mistakes sections repeating rules

Several skills have "don't do X" rows that are just the inverse of an existing rule. While negative-framing can reinforce behavior, roughly half of these rows are verbatim restated elsewhere.

**Affected skills:** questline, bdd.

### 4. Inline duplication of referenced docs

Some skills inline checklist items from companion documents (e.g. `comment-contract.md`, `review-lanes.md`) that a simple pointer would cover. The agent already loads the referenced file — repeating its contents in the skill wastes tokens.

**Affected skills:** pr-review (7 cuts from inlined comment-contract.md).

### 5. Repeated safety rules across sections

Certain critical rules (e.g. "PR targets the integration branch", "do not create duplicate branches") appear 3–6 times in different sections of the same file. Once in Core Rules + once in the relevant workflow step is sufficient.

**Affected skills:** ticket-master, pr-review, tdd.

## Top Trim Opportunities (by impact)

| Priority | Skill | Trim % | CUT count | Primary bloat source |
|----------|-------|--------|-----------|---------------------|
| 1 | pr-review | 32.1% | 26 | Core Rule restating + inlined comment-contract.md |
| 2 | questline | 29.8% | 17 | Workflow steps + Common Mistakes duplicating Core Rules |
| 3 | planning-codebase-researcher | 28.6% | 8 | Workflow echoing Core Rules |
| 4 | planning-decomposer | 28.6% | 10 | Workflow echoing Core Rules |
| 5 | objective-check | 24.6% | 16 | Validation workflow re-stating Core Rules |

## Already Lean (low trim)

| Skill | Trim % | Notes |
|-------|--------|-------|
| pr-bug-bash | 4.5% | Nearly every statement is load-bearing |
| vette | 11.7% | Well-written, minimal redundancy; attack vectors + severity defs are all high-value |
| ticket-master | 12.3% | Dense and well-structured; main issue is "PR targets integration branch" repeated ~6 times |

---

## Per-Skill Details

### bdd

**Trim: 21.2% (11 of 52 statements)**

CUT statements fall into:

- Workflow steps that restate Core Rule or Quality Bar items
- Red Flags entries that mirror When to Use negatives
- Output Shape fields already implied by the Gherkin format itself

### linear-cli

**Trim: 19.0% (11 of 58 statements)**

CUT statements fall into:

- Workflow examples that restate Operating Rules
- Setup Check items implied by standard CLI behavior
- Redundant Common Workflows phrasing

### naming

**Trim: 15.0% (4 of 27 statements)**

Already a tight skill. Cuts are minor:

- Rewrite Pattern step that restates Core Rule
- One example that duplicates another's lesson
- Review Output field covered by the rewrite pattern itself

### objective-check

**Trim: 24.6% (16 of 65 statements)**

CUT statements fall into:

- Validation workflow steps that copy Core Rules verbatim
- Readiness Checklist items restated in Output Contract
- Common Mistakes entries that invert existing rules

### planning-codebase-researcher

**Trim: 28.6% (8 of 28 statements)**

CUT statements fall into:

- Workflow steps that echo Core Rules word-for-word
- Output Format fields already implied by the workflow
- Scope description redundant with frontmatter

### planning-decomposer

**Trim: 28.6% (10 of 35 statements)**

CUT statements fall into:

- Splitting Guidance items restated in Workflow
- Core Rules echoed in Workflow steps
- Output Format entries implied by the splitting workflow

### planning-orchestrator

**Trim: 18.6% (8 of 43 statements)**

CUT statements fall into:

- Workflow steps that restate Core Rules
- Companion Skills descriptions that duplicate the referenced skill's own frontmatter
- Scope Inputs phrasing redundant with Core Rules

### pr-bug-bash

**Trim: 4.5% (3 of 66 statements)**

The tightest skill by trim percentage. Only 3 cuts:

- One workflow sub-step restating a Core Rule
- One Comment Drafting item covered by the referenced comment-contract.md
- One Final Report field already reported in an earlier workflow step

### pr-review

**Trim: 32.1% (26 of 81 statements)**

The biggest trim opportunity. Cuts fall into three categories:

1. **Redundancy with Core Rules** (12 cuts) — Workflow restates branch defaults, isolation rules, and thermo-nuclear dispatch verbatim
2. **Redundancy with referenced docs** (7 cuts) — §5 Comment Preparation inlines comment-contract.md checklist almost verbatim; the pointer is sufficient
3. **Obvious/preview statements** (7 cuts) — Purpose summary, obvious git steps, When to Use entries that restate Core Rules

### questline

**Trim: 29.8% (17 of 57 statements)**

CUT statements fall into:

- Workflow steps 5–7 heavily duplicating Core Rules
- Common Mistakes rows that reword existing rules (creating Todo tickets, auto-splitting, Linear-only status names)
- Overview trailing clauses that preview the rules table
- One Linear-specific leak ("Todo is the runnable leaf status") that contradicts the tracker-agnostic rule

### tdd

**Trim: 15.5% (13 of 84 statements)**

CUT statements fall into:

- Purpose section (entirely summarative — the Loop defines everything concretely)
- Red Verifier checks that restate Core Rules (test-name rule, scope rule, file-ownership rule)
- Green Agent constraints already covered by Core Rules
- Risk Review step that just says "run the normal loop"

### ticket-building-system

**Trim: 24.0% (18 of 75 statements)**

CUT statements fall into:

- Workflow steps that duplicate Policy/Permissions, Template Reference, and Detail Gathering sections
- Writing Standard paraphrases
- Portability items restating Overview principles
- One redundant Example Invocation

### ticket-master

**Trim: 12.3% (27 of 220 statements)**

The largest skill by statement count (220). Despite size, it's dense and well-structured. Cuts are almost entirely pure redundancy:

- "PR targets the integration branch" appears ~6 times across sections
- "Do not create duplicate branches/PRs" appears ~3 times
- "B blocked-by A" stated alongside logically identical "A blocks B"
- Worker Prompt Contract restating Branch And PR Rules
- After Each Worker section restating Ticket Metadata Rules

### vette

**Trim: 11.7% (7 of 60 statements)**

The best-written skill by trim ratio. Only 7 cuts:

- Purpose laundry list (covered by frontmatter + Attack Vectors)
- Two redundant When to Use triggers
- "Do not permanently alter the repo" (covered by three other rules)
- Procedural test-documentation detail (obvious + already stated)
- Redundant Plan Risk Pass trigger
- Redundant operator-question scoping rule
