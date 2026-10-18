# Model tiers

Every expert in the library has a provider-neutral `tier`. `scripts/models.json` maps tiers to concrete models for each runtime, and `scripts/build_subagents.py` renders the library for Claude Code, Codex, or OpenRouter. Change a model in one place (`models.json`) and rebuild.

| Tier | Use for | Claude Code | Codex | OpenRouter (primary → fallback) |
| --- | --- | --- | --- | --- |
| `deep` | Finding the decisive insight, falsifying the front-runner, designing sound experiments, one-way architecture calls | `opus` ✔ | `gpt-6-astra`, effort `high` | `anthropic/claude-opus-5.5` ✔ → `openai/gpt-6-astra` |
| `standard` | Precision matters (security, money, data, contracts, test design) but the work is structured | `sonnet` | `gpt-6.1-sol`, effort `medium` | `anthropic/claude-sonnet-5.5` → `openai/gpt-6.1-sol` |
| `fast` | Procedural work: specs, checklists, state coverage, mapping | `haiku` ✔ | `gpt-6-luna`, effort `low` | `anthropic/claude-haiku-5.5` ✔ → `openai/gpt-6-luna` |

✔ = this tier was benchmarked with that model. Everything else is a reasoned mapping, not a measured one. Model IDs were checked against provider docs and listings on 2026-10-17 (`openai/gpt-6.1-sol` on OpenRouter was inferred from the OpenAI API ID and the slugs of its siblings; confirm it before relying on it as a fallback).

## Why each role has its tier

Tiers come from the per-expert bench: 13 roles, each given an identical brief and definition on Opus and Haiku, graded 1–5 for usefulness. Opus scored 5 on every role; Haiku averaged 3.7. Haiku followed the definitions faithfully — the gap was in spotting the decisive point and in experiment design.

| Role | Tier | Basis |
| --- | --- | --- |
| skeptic | deep | Haiku 3–4 vs Opus 5; missed the decisive counterexample |
| product-strategist | deep | Haiku 3; no research, no stance |
| sre-reliability | deep | Haiku 3; controlled comparison couldn't separate causes |
| codebase-researcher | deep | Haiku 3; tooling couldn't reach the baseline window |
| solution-architect | deep | Haiku 4; missed server-side budget enforcement; one-way decisions |
| security-reviewer | standard | Haiku 4; generic threats, missed specific bypasses |
| finance-analyst | standard | Haiku 4; compared unequal time windows |
| market-customer-researcher | standard | Haiku 4; didn't check dated sources |
| root-cause-analyst | standard | Haiku 4; missed experiment confounds |
| qa-test-strategist | standard | Haiku 4; its main race check couldn't fail |
| delivery-planner | standard | Haiku 4; over-serialized the plan |
| requirements-analyst | fast | Haiku 4; precision gaps only (tags, mapping) |
| evidence-researcher, domain-modeler, api-integration-designer, data-engineer, risk-compliance-officer, business-analyst | standard | untested; mistakes are costly or hard to reverse |
| ux-flow-designer, end-user-advocate, stakeholder-change-lead | fast | untested; procedural |
| verifier (process role) | deep | independence and checklist rigor |

The `standard` tier was not benchmarked. Roles there scored 4 with Haiku but made at least one substantive error, so they get a middle model rather than the fast one. If cost matters more than precision, rebuild with `--tier standard=fast`; if quality matters more, `--tier standard=deep`.

## Process roles

The facilitator and stopper run in the main session, on whatever model the session uses. The curator can run on `fast`. The verifier runs on `deep`, and should be a different agent from the one that produced the work. The decider is a human.

## Choosing at dispatch time

When dispatching an expert, use its tier unless one of these applies:

- **One-way-door decision pending** → bump every expert touching that decision to `deep`.
- **Large fan-out of near-identical checks** (e.g. an implication sweep over 20 locales) → `fast` is fine even for a `standard` role.
- **Runtime has no subagent model control** → run the expert in the session model and note the tier in the dispatch record so a later run can honor it.

Record the model actually used in `dispatch.yaml` (or the light board) so the contribution ledger can compare models over time.

## Rebuilding

```bash
python scripts/build_subagents.py --target all                        # all three runtimes, into the skill folder
python scripts/build_subagents.py --out ~/.claude/agents              # install Claude Code subagents user-wide
python scripts/build_subagents.py --target codex --out .codex/agents  # install Codex agents for a project
python scripts/build_subagents.py --target openrouter                 # agents.json for your own app
python scripts/build_subagents.py --tier fast=standard                # remap a tier
python scripts/build_subagents.py --pin skeptic=opus                  # pin one role (single target)
```

- **Claude Code** — `subagents/bb-*.md`, `model:` set from the tier. See https://code.claude.com/docs/en/sub-agents.
- **Codex** — `subagents-codex/bb-*.toml` with `name`, `description`, `model`, `model_reasoning_effort`, `sandbox_mode = "read-only"` (experts are propose-only), and `developer_instructions`. Copy to `.codex/agents/` (project) or `~/.codex/agents/` (personal).
- **OpenRouter** — `subagents-openrouter/agents.json`: one entry per agent with `system` (the full instructions), `model`, and `models` (primary then fallbacks, for OpenRouter's fallback routing). Intended for your own orchestrator, e.g. a Vercel AI SDK app with the OpenRouter provider.
