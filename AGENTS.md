# Repository Guidance

This repository is a source repo for Vercel-compatible agent skills.

## Structure

- Put publishable skills only under `skills/<skill-name>/`.
- Every publishable skill must include `SKILL.md`.
- Put examples and scaffolds under `templates/`, not `skills/`.
- Put repo-wide tooling under `scripts/`.

## Naming

- Skill directory names must be lowercase kebab-case.
- `SKILL.md` frontmatter `name` must match the directory name exactly.

## Editing Rules

- Do not place placeholder or draft skills under `skills/`.
- Keep optional resources scoped to the owning skill directory.
- Prefer concise trigger-oriented descriptions in frontmatter.

## Validation

Run:

```powershell
pwsh ./scripts/validate-skills.ps1
```

before finalizing structural changes.
