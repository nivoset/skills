# Linear CLI Command Map

This reference summarizes `schpet/linear-cli` commands useful to agents. It is based on upstream docs checked on 2026-05-13, when the latest GitHub release was `v2.0.0` published on 2026-04-03. Prefer installed `--help` output when it differs.

## Install Options

- Homebrew: `brew install schpet/tap/linear`
- Deno/JSR: `deno install -A --reload -f -g -n linear jsr:@schpet/linear-cli`
- Project dependency: `npm install -D @schpet/linear-cli`, `pnpm add -D @schpet/linear-cli`, or `bun add -D @schpet/linear-cli`
- One-off/package runner check: `npx @schpet/linear-cli --version`
- Binaries: https://github.com/schpet/linear-cli/releases/latest

## Authentication and Config

- `linear auth login`: authenticate with a Linear API key.
- `linear auth whoami`: verify the active account.
- `linear auth list`, `linear auth default`, `linear auth logout`: manage saved auth contexts.
- `linear config`: generate repo config such as workspace, team, VCS, and issue sort preferences.
- Config may be supplied by `.linear.toml`, `linear.toml`, user config, or environment variables such as `LINEAR_TEAM_ID`, `LINEAR_WORKSPACE`, `LINEAR_ISSUE_SORT`, `LINEAR_VCS`, and `LINEAR_DOWNLOAD_IMAGES`.

## Issue Commands

- `linear issue id`: print the issue inferred from git branch or jj trailers.
- `linear issue view [ISSUE]`: render issue details in the terminal.
- `linear issue title`, `linear issue url`: print specific current issue fields.
- `linear issue mine`: list unstarted issues assigned to the authenticated user.
- `linear issue list`: list issues; may require `--team` or config and a sort value.
- `linear issue query --search "text" --json`: search issues with structured output.
- `linear issue query --all-teams --json --limit 0`: export/search across teams.
- `linear issue start [ISSUE]`: create or switch branch and mark the issue started.
- `linear issue create`: create an issue interactively or with flags.
- `linear issue update [ISSUE]`: update fields interactively or with flags.
- `linear issue delete [ISSUE]`: delete an issue; high-risk operation.
- `linear issue pr`: create a GitHub PR using the issue details through `gh`.
- `linear issue comment list/add/update/delete`: manage issue comments.
- `linear issue relation list/add/delete`: manage issue relationships.
- `linear issue attach`, `linear issue link`: attach or link external resources.
- `linear issue commits`: show commits for an issue in jj workflows.
- `linear issue agent-session list/view`: inspect agent sessions when available.

## Organization Commands

- Teams: `linear team list`, `linear team id`, `linear team members`, `linear team create`, `linear team autolinks`.
- Projects: `linear project list`, `linear project view`, `linear project create`, `linear project update`, `linear project delete`.
- Project updates: `linear project-update list`, `linear project-update create`.
- Cycles: `linear cycle list`, `linear cycle view`.
- Milestones: `linear milestone list/view/create/update/delete`; alias `linear m`.
- Initiatives: `linear initiative list/view/create/update/archive/unarchive/delete/add-project/remove-project`.
- Initiative updates: `linear initiative-update list/create`.
- Labels: `linear label list/create/delete`.

## Documents

- `linear document list` or `linear docs list`: list accessible documents.
- `linear document view <slug> --raw`: output raw markdown for piping.
- `linear document create --title "Title" --content-file ./doc.md`: create from file.
- `linear document create --title "Notes" --issue ENG-123`: attach to an issue.
- `linear document update <slug> --content-file ./doc.md`: update content.
- `linear document delete <slug>`: soft delete; `--permanent` is high risk.

## Raw API

- `linear schema`: print the Linear GraphQL schema.
- `linear api '{ viewer { id name email } }'`: run a simple query.
- For queries with variables or non-null type markers, pass GraphQL through stdin or a temp file to avoid shell escaping issues.
- Use `linear auth token` only for controlled integrations that need an auth header, and never expose the token in final answers or logs.
