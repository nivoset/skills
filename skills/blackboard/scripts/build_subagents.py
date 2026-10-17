#!/usr/bin/env python3
"""Build runnable subagent definitions from the blackboard agent library.

Each library definition in references/agents/<id>.md has a provider-neutral
`tier` (deep | standard | fast). scripts/models.json maps tiers to concrete
models per runtime. This script renders the library for one runtime:

  claude      -> subagents/bb-<id>.md              (Claude Code subagents, `model:` frontmatter)
  codex       -> subagents-codex/bb-<id>.toml       (Codex custom agents)
  openrouter  -> subagents-openrouter/agents.json   (system prompts + model fallbacks for your own app)

Each output inlines the role definition, the shared operating rules, and the
documentation standards the role links to, so it works without the skill folder.

Usage:
  python scripts/build_subagents.py                            # claude, into <skill>/subagents/
  python scripts/build_subagents.py --target codex             # into <skill>/subagents-codex/
  python scripts/build_subagents.py --target openrouter        # into <skill>/subagents-openrouter/
  python scripts/build_subagents.py --target all               # all three
  python scripts/build_subagents.py --out ~/.claude/agents     # install Claude Code subagents user-wide
  python scripts/build_subagents.py --target codex --out .codex/agents
  python scripts/build_subagents.py --tier fast=standard       # remap a tier (e.g. no fast model available)
  python scripts/build_subagents.py --pin skeptic=opus         # pin one role to a specific model (single target only)
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
AGENTS_DIR = SKILL_DIR / "references" / "agents"
DOCS_DIR = SKILL_DIR / "references" / "documentation"
PLANNING = SKILL_DIR / "references" / "planning-outputs.md"
MODELS = Path(__file__).resolve().parent / "models.json"
SKIP = {"README.md", "process-roles.md"}
PREFIX = "bb-"
DEFAULT_OUT = {
    "claude": SKILL_DIR / "subagents",
    "codex": SKILL_DIR / "subagents-codex",
    "openrouter": SKILL_DIR / "subagents-openrouter",
}

OPERATING_RULES = """\
## Operating rules (blackboard)

You are one expert on a blackboard: a shared, versioned board of typed artifacts run by a controller (the facilitator). You have **propose-only** authority.

- Work only on the activation in your brief: its goal, trigger IDs, bounded question, and bound. Do not widen scope.
- Assess independently. You may not have seen other experts' drafts; do not guess at them.
- Never modify repository files or shared systems. Put proposed documents in your contribution (or under the board's `documents/` folder if the brief allows it).
- Separate observations (with evidence) from interpretations and recommendations. Unsupported material claims are marked `unverified`.
- Cite a source only for content you actually read from it in this activation. If a page failed to load, say so; label remembered figures `unverified (recalled)`.
- Before returning, check your own goal: does the contribution produce the observable outcome stated under **Goal**? If only partly, return `blocked` or list the unmet parts — do not mark `passed`.
- Do not settle product, scope, architecture, financial, legal, or operational decisions; propose and record your stance (`agree`, `disagree-and-commit`, `block` + reason).
- If you cannot meet your goal within the bound, return `blocked` with the missing input, affected IDs, owner, and re-entry condition. Silence is never approval.

Return this contribution contract (YAML), then any document drafts:

```yaml
contribution_id: contribution-<id>
board_id: <from brief>
base_version: <from brief>
role_id: {role_id}
activation_id: <from brief>
status: passed | failed | blocked
operation: propose | support | challenge | refine | split | connect | answer | retract
target_ids: []
artifacts: []          # typed: objective, option, behavior, constraint, risk, finding, question, decision, document, plan-step, ...
relations: []          # from / type / to
evidence:
  - id: evidence-<id>
    source: <path:line, test, command, URL, document>
    result: <observation, not interpretation>
    version_or_retrieved_at: <commit or date>
documents: []          # path + standard + objectives served
stances: []            # decision_id / stance / reason
uncertainty: <remaining uncertainty or none>
implication: <what changes if accepted>
new_trigger_conditions: []
```
"""

VERIFIER_BODY = """\
# Verifier

## Goal
Every contribution and document submitted for acceptance meets its role goal, its evidence rules, and its documentation standard checklist, with each failure returned as a specific finding.

## Checks
- Return schema complete; status honest (`passed` only if the role goal is met).
- Evidence exists, is in scope, and is fresh; observations separated from interpretation; cited figures actually appear in the cited source.
- Traceability: objective ↔ question ↔ decision ↔ document ↔ plan step ↔ validation check.
- Documents meet the checklist of their standard (bundled below).
- Decision records: Y-statement complete, ≥2 genuine options, stances recorded, no unresolved `block`, concrete confirmation, contra-memo for one-way doors, status not `accepted` without the decider.
- Plan steps: objective link, owner, concrete actions, checkable exit criterion, verification.

Return `support` or `challenge` operations with one finding per failed checklist item.
"""


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise SystemExit(f"{path.name}: missing frontmatter")
    meta: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for key in ("id", "name", "summary", "tier"):
        if key not in meta:
            raise SystemExit(f"{path.name}: frontmatter missing '{key}'")
    return meta, m.group(2).strip()


def linked_docs(body: str) -> list[Path]:
    seen: list[Path] = []
    for target in re.findall(r"\]\(([^)]+\.md)\)", body):
        name = Path(target).name
        for c in (DOCS_DIR / name, SKILL_DIR / "references" / name):
            if c.exists() and c not in seen:
                seen.append(c)
    return seen


def delink(body: str) -> str:
    return re.sub(r"\[([^\]]+)\]\(([^)]+\.md)\)", r"\1", body)


def demote(content: str) -> str:
    content = re.sub(r"^# ", "### ", content.strip(), count=1)
    return re.sub(r"\n## ", "\n#### ", content)


def instructions(body: str, role_id: str, docs: list[Path]) -> str:
    parts = [delink(body), "", OPERATING_RULES.replace("{role_id}", role_id)]
    if docs:
        parts.append("## Bundled documentation standards\n")
        for d in docs:
            parts += [delink(demote(d.read_text())), ""]
    return "\n".join(parts).rstrip() + "\n"


def library(models: dict) -> list[dict]:
    """Return a list of {id, name, summary, domain, tools, tier, tier_basis, instructions}."""
    roles = []
    for path in sorted(AGENTS_DIR.glob("*.md")):
        if path.name in SKIP:
            continue
        meta, body = parse(path)
        roles.append({
            "id": meta["id"],
            "name": meta["name"],
            "summary": meta["summary"],
            "domain": meta.get("domain", "general"),
            "tools": meta.get("tools", "Read, Grep, Glob"),
            "tier": meta["tier"],
            "tier_basis": meta.get("tier_basis", ""),
            "instructions": instructions(body, meta["id"], linked_docs(body)),
        })
    docs = sorted(p for p in DOCS_DIR.glob("*.md") if p.name != "README.md") + [PLANNING]
    roles.append({
        "id": "verifier",
        "name": "Verifier",
        "summary": "Independently verifies contributions, documents, decision records, and plan steps against their goals, evidence rules, and documentation standards.",
        "domain": "process",
        "tools": "Read, Grep, Glob, Bash",
        "tier": models["process_roles"]["verifier"],
        "tier_basis": "process role; independence and checklist rigor",
        "instructions": instructions(VERIFIER_BODY, "verifier", docs),
    })
    return roles


def description(role: dict) -> str:
    if role["id"] == "verifier":
        return ("Blackboard process role: " + role["summary"] + " Use for one-way-door decisions, final-ready checks, "
                "and any high-stakes document, with an agent that did not produce the work.")
    return (f"Blackboard expert ({role['domain']}): {role['summary']} Use when a blackboard session dispatches the "
            f"{role['id']} role, or when a planning, design-review, or investigation task needs this perspective as a propose-only expert.")


def resolve(role: dict, runtime: dict, tier_map: dict, pins: dict) -> dict:
    tier = tier_map.get(role["tier"], role["tier"])
    if tier not in runtime:
        raise SystemExit(f"{role['id']}: tier '{tier}' not in models.json for this runtime")
    spec = dict(runtime[tier])
    if role["id"] in pins:
        pin = pins[role["id"]]
        if "models" in spec:
            spec["models"] = [pin] + [m for m in spec["models"] if m != pin]
        else:
            spec["model"] = pin
        spec["pinned"] = True
    spec["tier"] = tier
    return spec


def toml_str(s: str) -> str:
    if "'''" not in s:
        return "'''\n" + s + "'''"
    return '"""\n' + s.replace("\\", "\\\\").replace('"""', '\\"\\"\\"') + '"""'


def toml_basic(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def build_claude(roles, models, tier_map, pins, out: Path) -> list[Path]:
    rt = models["runtimes"]["claude"]
    out.mkdir(parents=True, exist_ok=True)
    written = []
    for r in roles:
        spec = resolve(r, rt, tier_map, pins)
        text = "\n".join([
            "---",
            f"name: {PREFIX}{r['id']}",
            f"description: {description(r)}",
            f"tools: {r['tools']}",
            f"model: {spec['model']}",
            "---",
            f"<!-- tier: {spec['tier']} ({r['tier_basis']}) — generated by scripts/build_subagents.py; edit references/agents/ and models.json instead -->",
            "",
            r["instructions"],
        ])
        dest = out / f"{PREFIX}{r['id']}.md"
        dest.write_text(text.rstrip() + "\n")
        written.append(dest)
    return written


def build_codex(roles, models, tier_map, pins, out: Path) -> list[Path]:
    rt = models["runtimes"]["codex"]
    out.mkdir(parents=True, exist_ok=True)
    written = []
    for r in roles:
        spec = resolve(r, rt, tier_map, pins)
        lines = [
            f"# Generated by blackboard scripts/build_subagents.py — tier: {spec['tier']} ({r['tier_basis']})",
            f"name = {toml_basic(PREFIX + r['id'])}",
            f"description = {toml_basic(description(r))}",
            f"model = {toml_basic(spec['model'])}",
        ]
        if spec.get("model_reasoning_effort"):
            lines.append(f"model_reasoning_effort = {toml_basic(spec['model_reasoning_effort'])}")
        lines.append(f"sandbox_mode = {toml_basic(rt.get('sandbox_mode', 'read-only'))}")
        lines.append("")
        lines.append(f"developer_instructions = {toml_str(r['instructions'])}")
        dest = out / f"{PREFIX}{r['id']}.toml"
        dest.write_text("\n".join(lines).rstrip() + "\n")
        written.append(dest)
    return written


def build_openrouter(roles, models, tier_map, pins, out: Path) -> list[Path]:
    rt = models["runtimes"]["openrouter"]
    out.mkdir(parents=True, exist_ok=True)
    agents = []
    for r in roles:
        spec = resolve(r, rt, tier_map, pins)
        agents.append({
            "id": PREFIX + r["id"],
            "role_id": r["id"],
            "name": r["name"],
            "description": description(r),
            "domain": r["domain"],
            "tier": spec["tier"],
            "tier_basis": r["tier_basis"],
            "model": spec["models"][0],
            "models": spec["models"],
            "tools_hint": [t.strip() for t in r["tools"].split(",")],
            "system": r["instructions"],
        })
    dest = out / "agents.json"
    dest.write_text(json.dumps({
        "_comment": "Generated by blackboard scripts/build_subagents.py. Send `system` as the system prompt and `models` to OpenRouter (primary first, then fallbacks).",
        "agents": agents,
    }, indent=2, ensure_ascii=False) + "\n")
    return [dest]


BUILDERS = {"claude": build_claude, "codex": build_codex, "openrouter": build_openrouter}


def parse_pairs(items: list[str], what: str) -> dict:
    out = {}
    for item in items or []:
        if "=" not in item:
            raise SystemExit(f"--{what} expects key=value, got '{item}'")
        k, v = item.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--target", choices=[*BUILDERS, "all"], default="claude")
    ap.add_argument("--out", type=Path, help="output directory (single target only)")
    ap.add_argument("--models", type=Path, default=MODELS, help="tier-to-model map (default scripts/models.json)")
    ap.add_argument("--tier", action="append", metavar="FROM=TO", help="remap a tier, e.g. fast=standard")
    ap.add_argument("--pin", action="append", metavar="ROLE=MODEL", help="pin a role to a model (single target only)")
    args = ap.parse_args()

    models = json.loads(args.models.read_text())
    tier_map = parse_pairs(args.tier, "tier")
    pins = parse_pairs(args.pin, "pin")
    targets = list(BUILDERS) if args.target == "all" else [args.target]
    if len(targets) > 1 and (args.out or pins):
        raise SystemExit("--out and --pin need a single --target")

    roles = library(models)
    for t in targets:
        out = (args.out.expanduser() if args.out else DEFAULT_OUT[t])
        written = BUILDERS[t](roles, models, tier_map, pins, out)
        print(f"[{t}] wrote {len(written)} file(s) to {out}")


if __name__ == "__main__":
    main()
