# Agent Skills Repository

This repository is structured to work cleanly with Vercel's agent skills ecosystem and the `npx skills` CLI.

It is set up as a multi-skill repository: each published skill should live under [`skills/`](./skills) in its own directory and include a `SKILL.md` file with YAML frontmatter.

## Why This Layout

Vercel's skills tooling expects skills to be discoverable from a repository in standard locations. The safest repository shape for a collection of skills is:

```text
.
├── README.md
├── AGENTS.md
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md
│       ├── references/      # optional
│       ├── scripts/         # optional
│       └── assets/          # optional
├── templates/
│   └── skill-template/
│       └── SKILL.md.example
└── scripts/
    └── validate-skills.ps1
```

This keeps actual installable skills separate from repository docs and templates.

## Skill Contract

Each skill must be a directory containing a `SKILL.md` file. At minimum, the file needs YAML frontmatter with:

```yaml
---
name: my-skill
description: Clear description of what the skill does and when it should be used
---
```

Rules:

- `name` should match the directory name.
- Use lowercase kebab-case for skill names.
- `description` should describe both capability and trigger conditions.
- Optional support files should stay inside that skill's directory.

Example:

```text
skills/
└── release-notes/
    ├── SKILL.md
    ├── references/
    │   └── format.md
    └── scripts/
        └── collect-changes.sh
```

## Creating a Skill

1. Create a new directory under `skills/` using kebab-case.
2. Copy [`templates/skill-template/SKILL.md.example`](./templates/skill-template/SKILL.md.example) into `skills/<your-skill>/SKILL.md`.
3. Replace the placeholder frontmatter and instructions.
4. Add `references/`, `scripts/`, or `assets/` only if the skill needs them.
5. Run the validator:

```powershell
pwsh ./scripts/validate-skills.ps1
```

If PowerShell 7 is not installed:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\validate-skills.ps1
```

## Installing From This Repository

Install all skills from the repository:

```bash
npx skills add https://github.com/nivoset/skills --skill '*'
```

Install a specific skill:

```bash
npx skills add https://github.com/nivoset/skills --skill my-skill
```

List discoverable skills without installing:

```bash
npx skills add https://github.com/nivoset/skills --list
```

## Bug Bash Skills

This repository includes a bug-bash skill family:

- `bug-bash`: orchestrates a whole-codebase or area-specific review and returns one merged report
- `bug-bash-security-privacy-permissions`
- `bug-bash-data-integrity`
- `bug-bash-financial-correctness`
- `bug-bash-core-flow`
- `bug-bash-error-handling`
- `bug-bash-validation`
- `bug-bash-race-idempotency`
- `bug-bash-external-integrations`
- `bug-bash-test-weakness`
- `bug-bash-frontend-state-ux`
- `bug-bash-observability`
- `bug-bash-maintainability-risk`

### Install The Bug Bash Skills

Install the full bug-bash family:

```bash
npx skills add https://github.com/nivoset/skills --skill 'bug-bash*'
```

Install only the orchestrator:

```bash
npx skills add https://github.com/nivoset/skills --skill bug-bash
```

Install one focused review skill:

```bash
npx skills add https://github.com/nivoset/skills --skill bug-bash-test-weakness
```

### Use The Bug Bash Skills

Use `bug-bash` when you want one combined report across the whole codebase or a named area.

Example prompts:

```text
Run bug-bash on this repo and focus on the highest-risk user flows.
```

```text
Use bug-bash on the billing area and prioritize payment, retry, and webhook problems.
```

Use a focused subskill when you want a domain-specific review without running the full orchestrator.

Example prompts:

```text
Use bug-bash-security-privacy-permissions on the admin export routes.
```

```text
Use bug-bash-test-weakness on the checkout tests and find false confidence.
```

```text
Use bug-bash-frontend-state-ux on the onboarding screens.
```

### Bug Bash Behavior

All bug-bash skills:

- default to whole-codebase review unless the prompt names a narrower area
- accept freeform scope such as a path, module, route, workflow, screen, data model, job, integration, or permission boundary
- prefer read-only investigation and existing tests
- follow the codebase's current testing standards first
- recommend the minimum test or harness additions needed when stable verification is not possible with the current setup
- use a shared bug-bash report format with severity and confidence, not numeric scoring

## Planning Skills

This repository also includes a planning skill family:

- `planning-orchestrator`: researches the codebase, clarifies unresolved decisions, and returns a developer-consumable ticket breakdown
- `planning-codebase-researcher`: maps existing behavior, reuse paths, risks, dependencies, and test coverage that matter to planning
- `planning-decomposer`: splits a scoped outcome into independently testable leaf tickets with plain-English acceptance tests

### Install The Planning Skills

Install the full planning family:

```bash
npx skills add https://github.com/nivoset/skills --skill 'planning-*'
```

Install only the orchestrator:

```bash
npx skills add https://github.com/nivoset/skills --skill planning-orchestrator
```

Install one focused planning skill:

```bash
npx skills add https://github.com/nivoset/skills --skill planning-decomposer
```

### Use The Planning Skills

Use `planning-orchestrator` when you want one main entrypoint that researches first, asks only decision-critical questions, and returns a ticket tree with detailed leaf tickets.

Example prompts:

```text
Use planning-orchestrator to break this feature into implementation tickets after inspecting the repo first.
```

```text
Use planning-orchestrator to plan the migration and call out real dependencies between tickets.
```

Use a focused planning skill when you already know the scope and want one part of the workflow.

Example prompts:

```text
Use planning-codebase-researcher to map the current invitation flow and identify reuse points before we plan changes.
```

```text
Use planning-decomposer to split this approved feature spec into independently testable tickets.
```

### Planning Skill Behavior

All planning skills:

- inspect the repository before asking avoidable questions
- prefer concise, evidence-backed code references with file paths and line numbers when available
- keep ticket titles outcome-oriented and user- or stakeholder-legible
- require plain-English acceptance tests for leaf tickets
- keep long templates and checklists in skill-local `references/` files instead of bloating `SKILL.md`

## Publishing Guidance

- Keep only real, installable skills under `skills/`.
- Keep templates outside `skills/` so they are not treated as published skills.
- Keep repository-wide guidance in root docs such as `README.md` and `AGENTS.md`.
- If a skill is experimental, prefer keeping it out of `skills/` until it is ready to publish.

## Validation

[`scripts/validate-skills.ps1`](./scripts/validate-skills.ps1) checks:

- `skills/` exists
- each skill directory contains `SKILL.md`
- each `SKILL.md` has frontmatter
- frontmatter includes `name` and `description`
- `name` matches the folder name

Run it before commits and before publishing new skills.

## References

- Vercel Agent Skills docs: https://vercel.com/docs/agent-resources/skills
- Vercel `skills` CLI: https://github.com/vercel-labs/skills
