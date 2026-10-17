#!/usr/bin/env python3
"""Build Claude Code subagent files from the blackboard agent library.

Each library definition in references/agents/<id>.md becomes subagents/bb-<id>.md
with Claude Code frontmatter (name, description, tools), the definition body,
the shared operating rules, and the documentation standards it links to,
inlined so the subagent works without the skill folder.

Usage:
  python scripts/build_subagents.py                 # write into <skill>/subagents/
  python scripts/build_subagents.py --out ~/.claude/agents   # install user-wide
  python scripts/build_subagents.py --out .claude/agents     # install per project
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
AGENTS_DIR = SKILL_DIR / "references" / "agents"
DOCS_DIR = SKILL_DIR / "references" / "documentation"
PLANNING = SKILL_DIR / "references" / "planning-outputs.md"
SKIP = {"README.md", "process-roles.md"}
PREFIX = "bb-"

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


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise SystemExit(f"{path.name}: missing frontmatter")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for key in ("id", "name", "summary"):
        if key not in meta:
            raise SystemExit(f"{path.name}: frontmatter missing '{key}'")
    return meta, m.group(2).strip()


def linked_docs(body: str) -> list[Path]:
    seen: list[Path] = []
    for target in re.findall(r"\]\(([^)]+\.md)\)", body):
        name = Path(target).name
        candidates = [DOCS_DIR / name, SKILL_DIR / "references" / name]
        for c in candidates:
            if c.exists() and c not in seen:
                seen.append(c)
    return seen


def delink(body: str) -> str:
    # [text](relative.md) -> text (see bundled standards below)
    return re.sub(r"\[([^\]]+)\]\(([^)]+\.md)\)", r"\1", body)


def build(out: Path) -> list[Path]:
    out.mkdir(parents=True, exist_ok=True)
    written = []
    for path in sorted(AGENTS_DIR.glob("*.md")):
        if path.name in SKIP:
            continue
        meta, body = parse(path)
        role_id = meta["id"]
        tools = meta.get("tools", "Read, Grep, Glob")
        description = (
            f"Blackboard expert ({meta.get('domain', 'general')}): {meta['summary']} "
            f"Use when a blackboard session dispatches the {role_id} role, or when a planning, "
            f"design-review, or investigation task needs this perspective as a propose-only expert."
        )
        parts = [
            "---",
            f"name: {PREFIX}{role_id}",
            f"description: {description}",
            f"tools: {tools}",
            "---",
            "",
            delink(body),
            "",
            OPERATING_RULES.replace("{role_id}", role_id),
        ]
        docs = linked_docs(body)
        if docs:
            parts.append("## Bundled documentation standards\n")
            for d in docs:
                content = d.read_text().strip()
                content = re.sub(r"^# ", "### ", content, count=1)
                content = re.sub(r"\n## ", "\n#### ", content)
                parts.append(delink(content))
                parts.append("")
        dest = out / f"{PREFIX}{role_id}.md"
        dest.write_text("\n".join(parts).rstrip() + "\n")
        written.append(dest)

    # Verifier: process role with every documentation checklist bundled.
    verifier_parts = [
        "---",
        f"name: {PREFIX}verifier",
        "description: Blackboard process role: independently verifies contributions, documents, decision records, and plan steps against their goals, evidence rules, and documentation standards. Use for one-way-door decisions, final-ready checks, and any high-stakes document, with an agent that did not produce the work.",
        "tools: Read, Grep, Glob, Bash",
        "---",
        "",
        "# Verifier",
        "",
        "## Goal",
        "Every contribution and document submitted for acceptance meets its role goal, its evidence rules, and its documentation standard checklist, with each failure returned as a specific finding.",
        "",
        "## Checks",
        "- Return schema complete; status honest (`passed` only if the role goal is met).",
        "- Evidence exists, is in scope, and is fresh; observations separated from interpretation.",
        "- Traceability: objective ↔ question ↔ decision ↔ document ↔ plan step ↔ validation check.",
        "- Documents meet the checklist of their standard (bundled below).",
        "- Decision records: Y-statement complete, ≥2 genuine options, stances recorded, no unresolved `block`, concrete confirmation, contra-memo for one-way doors.",
        "- Plan steps: objective link, owner, concrete actions, checkable exit criterion, verification.",
        "",
        "Return `support` or `challenge` operations with one finding per failed checklist item.",
        "",
        OPERATING_RULES.replace("{role_id}", "verifier"),
        "## Bundled documentation standards\n",
    ]
    for d in sorted(DOCS_DIR.glob("*.md")) + [PLANNING]:
        if d.name == "README.md":
            continue
        content = d.read_text().strip()
        content = re.sub(r"^# ", "### ", content, count=1)
        content = re.sub(r"\n## ", "\n#### ", content)
        verifier_parts.append(delink(content))
        verifier_parts.append("")
    dest = out / f"{PREFIX}verifier.md"
    dest.write_text("\n".join(verifier_parts).rstrip() + "\n")
    written.append(dest)
    return written


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", type=Path, default=SKILL_DIR / "subagents")
    args = ap.parse_args()
    written = build(args.out.expanduser())
    print(f"Wrote {len(written)} subagent files to {args.out}")
    for w in written:
        print(f"  {w.name}")


if __name__ == "__main__":
    main()
