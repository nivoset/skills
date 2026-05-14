---
name: linear-cli
description: Use when Codex needs to inspect, create, update, comment on, or otherwise manage Linear issues, teams, projects, milestones, initiatives, documents, labels, or Linear GraphQL data through schpet/linear-cli from the command line. Trigger for Linear CLI workflows, agent-friendly Linear issue queries, branch-aware issue lookup, creating GitHub PRs from Linear issues, or using `linear api` as a fallback for unsupported Linear operations.
---

# Linear CLI

Use `linear` from `schpet/linear-cli` for Linear work that should stay in the terminal and remain close to the current repository. Prefer read-only discovery first, then make visible Linear changes only when the user explicitly asked for them or has confirmed the exact action.

Upstream source: https://github.com/schpet/linear-cli. The command surface changes over time; run command-specific `--help` before relying on less common flags.

## Setup Check

1. Check availability with `linear --version`. Command help and version checks are local-only and safe when the user asks not to contact Linear.
2. If missing, check whether the project can run it via package tooling, such as `npx @schpet/linear-cli --version`.
3. If unauthenticated, use `linear auth login`; do not print, log, or save API tokens.
4. In a repo without Linear config, run `linear config` only when the user wants this repo configured.
5. Use `linear auth whoami`, `linear team list`, and `linear config` to understand workspace/team context before creating or updating issues.

## Operating Rules

- Prefer `linear issue view`, `linear issue query --json`, `linear issue list`, and other read-only commands before mutations.
- Ask for confirmation before externally visible writes unless the user already requested that exact write: issue create/update/delete, comments, labels, projects, milestones, initiatives, documents, team changes, PR creation, or autolinks.
- Use `--json` for agent parsing whenever supported.
- Use file-based flags for markdown bodies: `--description-file` for issue create/update and `--body-file` for comments. Inline body flags are acceptable only for short single-line text.
- Preserve issue identifiers exactly, including team prefix casing when known, such as `ENG-123`.
- For git repos, prefer branch-aware commands only after checking the current branch with `linear issue id` or `linear issue view`.
- Do not use browser/app-opening flags (`--web`, `-w`, `--app`, `-a`) unless the user asks to open Linear.
- Verify visible writes afterward with the relevant `view`, `list`, or `--json` command.
- Treat delete, permanent delete, force, confirm, bulk, team, and autolink operations as high-risk; restate the target and get explicit confirmation before using flags such as `--force` or `--confirm`.

## Common Workflows

### Find or inspect work

Use these in order:

```bash
linear issue id
linear issue view
linear issue query --search "search terms" --json
linear issue query --all-teams --json --limit 0
linear issue list --sort priority
```

If `linear issue id` or `linear issue view` cannot infer an issue from the current branch, report that there is no branch issue and continue with explicit issue IDs or search results. If `issue list` cannot infer a team, run `linear team list` and retry with the team key or configure the repo.

For user-provided search terms, try the literal phrase first, then small variants if results are sparse. For example, search both `"OAuth timeouts"` and `"OAuth timeout"` before broadening to all teams. Use `--all-teams` when the configured team may be wrong or incomplete. In this CLI, `--limit 0` is used for unbounded exports; use a smaller explicit limit when the user only needs a summary.

### Start work from an issue

Use `linear issue start <ISSUE-ID>` to create or switch to the issue branch and mark the issue started. This mutates local VCS state and Linear status, so confirm unless the user explicitly asked to start that issue.

### Create or update an issue

Prepare substantial markdown in a temporary file, then run:

```bash
linear issue create --title "Short user-visible title" --description-file /tmp/linear-description.md
linear issue update ENG-123 --description-file /tmp/linear-description.md
```

Prefer adding `--project`, `--milestone`, labels, and assignee fields only after confirming valid names/IDs with list or view commands.

### Comment on an issue

When the user asks for a draft only, write the draft markdown in the final response and do not create or post a comment file. When the user asks to post or update a multiline comment, use a body file:

```bash
linear issue comment list ENG-123
linear issue comment add ENG-123 --body-file /tmp/linear-comment.md
linear issue comment update <comment-id> --body-file /tmp/linear-comment.md
```

Confirm before posting or editing comments unless the user explicitly requested the post.

For draft comments that synthesize issue search results, label the output as not posted, mention whether a current branch issue was found, summarize related issues by identifier and title, and list concrete next steps.

### Create a PR from a Linear issue

Use `linear issue pr` only after checking the current branch maps to the intended Linear issue. It invokes GitHub PR creation through `gh`, so confirm when the user has not already asked for a PR.

### Use GraphQL fallback

Prefer first-class CLI commands. Use `linear api` only when no CLI command covers the query or mutation. Inspect the schema with `linear schema` when field names are uncertain, and keep GraphQL mutations under the same confirmation rules as other visible writes.

## References

- Read `references/command-map.md` for command families, install options, and less common workflows.
- Run `linear <command> --help` or `linear <group> <command> --help` for exact flags in the installed version.
