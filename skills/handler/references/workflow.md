# Handler workflow

Use this runbook for a supplied bug or feature ticket. The orchestrator owns scope, branch selection, state publication, integration, ticket/PR actions, commits, pushes, and final claims. Specialists own only their assigned evidence or paths.

## Goal lifecycle and PR watch

Start `/goal` before delivery with an objective equivalent to:

```text
Deliver <TICKET> through research, conflict planning/repair, implementation, and PR validation to ready-for-human. When relevant, include documented task-local service startup/readiness and up/down request validation. Require exact-head checks, accessible scenario proof, resolved review findings, and a closed behavior inventory. Never approve or merge.
```

Keep this goal active across phases. Branch selection, a pushed fix, PR creation, or submitted CI is intermediate progress, not completion. Complete the goal only after the PR is ready for human review, relevant service validations and the behavior inventory are complete, the final notification is sent, and the handoff records the exact candidate SHA and proof. When blocked on a decision or external action, publish the blocker and awaited owner/input, leave the goal incomplete, and resume it when actionable; do not report success or spin on a condition that requires human input.

When a PR exists, follow `babysitting-pull-requests`: inspect immediately, then every 15 minutes, for at most two hours per watch window. Use its authorized inline cmux delayed self-ping; do not create scripts or duplicate watchers. Each check inspects new commits, required-check state, artifacts, and new human/bot/review comments. Classify each finding as related, unrelated, or uncertain; treat uncertain as related and handle it before the next wait. Stop when the watch contract permits, on external blockers, or when the PR closes/merges before readiness. On expiry, report the last observed state and keep the goal incomplete.

## 1. Intake and branch selection

Resolve the canonical ticket and comments/attachments, repository identity, acceptance criteria, current changes, active PRs, PR head/base/SHA/state, local/remote refs, and registered worktrees. Read repository instructions, naming rules, test scripts, CI workflows, PR template, and relevant product code/tests.

Prefer the single active ticket-linked PR's actual head branch and base; draft PRs are candidates and must be labeled draft. Multiple active candidates require a user choice. Closed or merged PRs are history; inspect refs for another existing fix before proposing new work. With no active PR, inspect ticket-associated branches and retained candidate refs. Reuse one verified matching branch; ask if multiple genuine candidates remain. Base precedence: explicit requested base, then PR base, then `origin/dev`. Create a branch only if no suitable branch exists; follow repository naming and use neutral category wording.

Reuse a registered worktree only if repository identity, branch, ownership, and non-overlap are verified. If the branch is checked out elsewhere, route work there rather than duplicating checkout. Preserve unrelated dirty work; never reset, clean, stash, force-checkout, or stage it. Conflicting writers or overlapping unowned changes block work until ownership is resolved. For an existing branch not checked out, use a sibling worktree with `git worktree add <path> <branch>`; for remote-only branches create a tracking local branch; use `-b` only for a genuinely new branch. If the intended path exists but is not that worktree, stop and ask for a safe path. Fetch the actual remote/base without pruning or forcing. Record baseline SHA and status.

## 2. Ticket workspace and lanes

At intake, inspect the current cmux session and its workspaces/panes/surfaces. Reuse a matching ticket workspace or create one when needed. Create or reuse a `<TICKET> ticket` browser subtab in the ticket pane and open the canonical ticket as soon as its URL is known. Create the PR browser subtab as soon as a PR exists. Keep new surfaces in the existing ticket pane; do not split or rearrange unrelated panes. Use explicit workspace/pane targeting, `--focus false`, and terminal `--working-directory`. Keep an idle shell/install subtab. Install dependencies once only when needed, using repository-supported setup. Local scenario capture is permitted under section 5 conditions; local E2E remains prohibited.

Name the workspace `<TICKET> — <neutral short summary>`, preserving the canonical uppercase identifier. Keep it under 80 characters and truncate only the summary. Never persist prohibited reference-product names. Branch/base go in its description:

```text
Ticket: <canonical URL>
Repository: <owner/repo>
Worktree: <absolute path>
Branch: <head branch>
Base: <base branch>
PR: <URL or none>
Phase: <research|conflicts|delivery|ci|ready-for-human|blocked>
Blocker: <reason or none>
Next: <one concrete next action>
Reference: <documented|source-gap|ambiguous>
CI: <not-started|pending|pass|fail>
Proof: <absolute .tmp/<TICKET>/proof path>
```

Use `unknown` for undiscovered values. `Next` is a specific command/task or awaited owner/input; `Blocker` is `none` except while blocked. Aggregate reference state: `ambiguous` if any in-scope behavior is ambiguous; else `source-gap` if any lacks supporting documentation; else `documented`. Retain per-behavior evidence separately. Refresh description when phase/blocker, branch/base/PR, or CI changes.

Use exact surface names: `<TICKET> research · <state>`, `<TICKET> conflicts · <state>`, `<TICKET> delivery · <state>`, `<TICKET> shell`, `<TICKET> ticket`, `<TICKET> proof`, and `<TICKET> PR #<number>`. Role state is `waiting`, `running`, `blocked`, `done`, or `not-needed`. Target each title explicitly. Launch interactive role sessions with `omp --no-title --cwd <worktree> <quoted-role-prompt>`. Open ticket and PR browser tabs when their URLs are known; reapply titles after navigation if needed. The proof surface is a terminal tab in the same ticket pane, not a browser or split. Verify startup via `tree`, `list-pane-surfaces`, `surface-health`, and targeted `read-screen`. `--command` normally submits automatically; send Enter only if observed prefilled. Never resend a running install or OMP launch.

The orchestrator is sole dispatcher and publisher. Each lane handoff names objective, exact allowed/forbidden paths, applicable skills, evidence inputs, finite deadline, stop conditions, and return schema. Research is tracked-code read-only and writes only its assigned research artifact; it may run with conflict discovery. Conflict lane owns the exclusive tracked-file writer lease until integrated SHA handoff. Delivery waits for research and conflict completion, re-reads at that SHA, and invalidates stale research. Test/production specialists follow TDD path ownership; no concurrent branch writers. Idle role tabs do not launch duplicate work. On missed deadline, mark blocked, stop/cancel owned stale task before one corrected replacement; never race a live writer.

## 3. Research and evidence

Read ticket, comments, attachments, relevant code/tests, and create a behavior inventory for user-visible outcomes, conditions/boundaries, consumers, fallback/recovery, evidence source, and planned test. For multi-service behavior, add a dependency/conflict matrix: service and owner, API/schema assumptions, dependencies, supported start/readiness/stop commands, expected up/down behavior, request fixture, test owner, and evidence source. Do not invent health endpoints, response codes, or service ownership. Query the relevant NotebookLM notebook with feature description/reproduction, not only ticket IDs. Follow `nlm-skill`; resolve authentication once and avoid concurrent login races.

For each documented behavior retain notebook/source IDs, exact supporting passage, retrievable URL if supplied, query, supported claim, and limitations. Generated answers without supporting source text are not citations. Ticket, clone code, and tests are not independent reference documentation. Record each behavior as `documented`, `source-gap`, or `ambiguous`; distinguish documented behavior from direct observation. Never claim a reference app was exercised based on static research. Missing docs alone do not block a clear bug fix. Contradictory or ambiguous behavior blocks implementation pending a narrow user decision. Do not externally edit ticket or ownership state without explicit authorization.

## 4. Conflict repair

Before editing, publish a conflict plan listing each conflicting branch/file or service contract, competing assumptions, evidence/source of truth, affected owners and dependencies, proposed minimal resolution, validation, and rollback/recovery path. Separate merge conflicts from product/API contract conflicts. Resolve documented contracts with evidence; if behavior remains ambiguous or ownership is unresolved, block for a narrow decision.

Conflict lane determines whether base integration is needed; clean/up-to-date is a no-op and state `not-needed`. If needed, merge fetched base into the selected ticket branch rather than rebasing or force-pushing existing PR history. If policy forbids merges, follow that policy; ask before history rewrite. Follow `fix-merge-conflicts`: resolve minimally, regenerate lockfiles with package tooling, run focused non-E2E validation, and report conflicts, choices, integrated SHA, results, and unresolved items. Conflict lane never pushes; only orchestrator commits/pushes.

## 5. Plan and implement

Compare existing fix with research and baseline; do not rebuild or delete working code to manufacture TDD. Parent maintains behavior inventory and concrete behavior/test plan. Follow `tdd` lane contracts and `naming` plus change-aware test classification guidance.

For a new fix, focused behavior regression must fail validly before production edits. For an existing fix, run the same regression against pre-fix base in an isolated baseline checkout and candidate; report existing coverage honestly. Prefer CI for scenario reproduction and capture when the repository supports it. If CI capture is unavailable or unsuitable, use the first safe repository-supported option in this order: task-local Docker service, `pnpm start`, then the documented local `dev` environment. Local scenario/E2E reproduction and video capture are allowed only on a task-local service or documented local `dev` target after verifying the selected port is unused; never displace another process or send traffic to shared, staging, or production services. Record which environment was used; local proof does not count as CI checks. If no safe option can reproduce the behavior, report the blocker; never claim unobserved evidence.

Push to the selected feature branch and update its existing PR; if none exists, create a draft PR. PR creation and pushing are allowed delivery actions. Never merge, approve, or move ticket state automatically. Never silently convert an already-ready PR to draft; state actual state and pending validation. Discover scripts, workflows, triggers, and required checks; push does not prove CI ran. Respect explicit no-push/no-PR restrictions while continuing allowed local work.

## 6. Local service lifecycle and request validation

Use this phase when behavior includes service dependencies or server up/down behavior. Discover startup, readiness, request, and shutdown commands from repository documentation/configuration; do not guess ports, health routes, response codes, or owners. Assign one owner per service. A lifecycle request names the service, desired state, supported command, observable readiness/failure criterion, request fixture, deadline, and return evidence. Coordinate owners: independent services with disjoint resources may validate in parallel; serialize state changes and shared-data access. If owner, contract, or safe local target is unknown, publish a blocker and ask.

Start only a task-local service through its supported command. Confirm `up` with its documented readiness check and a scenario-relevant request; a running process or open port alone is not proof. For an expected `down` case, stop only the process this task owns, verify its state, then make the documented request and assert the ticket-defined outcome. Never stop or send test traffic to shared, staging, or production services.

Watch only for the bounded duration needed by startup or a specific validation run; use the repository's readiness timeout and do not leave an indefinite poller. Report each observed state transition once, deduplicated by ticket/service/state/candidate SHA. Publish service state in a handler-owned cmux pill and notify with observed evidence and next action. `unknown` remains unknown until observation proves `up` or `down`. Clear the service pill when that task-local service is no longer part of active validation. Run focused unit/component/API checks and scenario reproduction/capture using CI when supported, otherwise the safe environment order in section 5. Treat local results as local evidence, not CI checks.

## 7. CI proof and exact-SHA gates

Use `.tmp/<TICKET>/proof/` for session-local evidence, plus sibling research/handoff files under `.tmp/<TICKET>/`. Check ignore coverage before writing. If missing, add narrowly scoped `.tmp/<TICKET>/` to `.git/info/exclude`; never add broad project ignore rules. Never stage scratch evidence or commit recordings.

Create or reuse a terminal surface in the ticket pane titled `<TICKET> proof`, with `--working-directory <absolute proof path>` and `--focus false`. When `manifest.json` exists or changes, display it with `cat manifest.json`; leave the terminal interactive so the user can inspect artifacts. Verify its title, cwd, and contents with `list-pane-surfaces`, `surface-health`, and targeted `read-screen`. Keep the proof subtab local; PR/browser links remain in the separate PR tab.

Create `proof/manifest.json` with ticket, repository, PR URL, baseline SHA, candidate SHA, research/source status, checks, and artifacts. Each check records name, command, result, run ID/attempt, job URL, and tested SHA. Each artifact records path, kind (`video`, `screenshot`, `api`, `test-log`, or `contact-sheet`), before/after/local role, provenance, originating run, and tested SHA when applicable. Relative paths are for downloaded CI artifacts. Local recordings use absolute `/tmp/demo/<ticket>/<run>/...` paths and are labeled `local capture`, never CI proof. Do not duplicate recordings into the repository. API proof contains the request fixture, status, asserted response/state, with secrets and personal data redacted. Before/after visual evidence covers the same behavior at respective SHAs; local capture is useful scenario evidence but does not replace CI checks.

Prefer CI for E2E and scenario capture when repository tooling supports the needed behavior. Otherwise use the safe local environment order in section 5. Download CI artifacts under `before/` and `after/` with logs/API data as applicable; retain local captures with their local provenance. Watch actual candidate CI runs; do not start duplicate watchers. Pending, failed, canceled, missing, inaccessible, skipped-required checks, missing scenario coverage/artifacts, or head-SHA mismatch never pass. Local evidence never counts as a CI check. Other skipped checks require repository-defined applicability evidence. Every push invalidates candidate checks and proof until refreshed. Preserve accessible CI links in PR evidence.

Before marking ready, discover each consumer repository's actual scripts, workflows, and job steps. Map three mandatory CI categories: lint, formatting, and TypeScript. Record each actual command, check/job/step identity, run URL/attempt, conclusion, and tested head SHA. A combined job counts only when its steps demonstrably run all three categories and propagate nonzero exits; a green umbrella gate alone is insufficient. After push, confirm remote branch head and PR head match the candidate. Inspect PR-attached checks with `gh pr checks` and underlying job/step evidence as needed. Require all three categories and other repository-required checks to succeed on that exact head. Pending, missing, inaccessible, canceled, neutral, skipped, failed, or stale-head checks do not pass. A local pass never substitutes. Every push invalidates prior candidate results. Immediately before `gh pr ready`, reread PR head/state and check conclusions; if the head changed, resume verification.

If a category lacks CI coverage, name the missing job/step as the readiness blocker and state the required workflow change. Do not invent commands/check names, waive a category, or change application CI during this infrastructure workflow. Never automatically approve, merge, or change ticket state. Do not demote an already-ready PR without authorization; report its actual state and failed gate.

## 8. Verified ticket evidence posting

Post only after successful capture and review. Watch the complete MP4, inspect its contact sheet, and require successful manifest evidence. Never publish failed captures or captions that claim unobserved results. Distinguish true paired before/after evidence from current-state video with a historical callout.

Resolve the canonical ticket from supplied ticket context and `source.changeId`; do not infer a tracker workspace from an arbitrary directory. If identity is absent or conflicts, retain the recording and report the exact posting blocker without guessing a destination.

Inspect existing comments with `linear issue comment list <TICKET> --json`. Identify a recording by ticket, run ID, and MP4 SHA-256. Put that identity in the comment body. On resume, reuse an existing matching comment. Write the body under the run directory. Include observed result, reproduction/demo steps, comparison kind, baseline/candidate revision when known, recording run ID/hash, and local/CI provenance.

Attach the actual playable MP4 and contact sheet with:

```sh
linear issue comment add <TICKET> --body-file <BODY> --attach <MP4> --attach <CONTACT_SHEET>
```

Filesystem paths alone are not ticket evidence. Read comments back and verify the returned comment ID/body and attachment URLs match the intended ticket and run. Record the comment URL/ID in the Handler handoff and proof manifest. If upload or readback fails, preserve artifacts and mark posting unverified. Inspect comments before retrying so a timed-out successful upload is not duplicated. Missing tracker authentication blocks posting, not local retention/review. Standing authorization permits posting verified evidence during ticket delivery; a newer explicit no-publication instruction takes precedence. Do not change ticket status or ownership. Agent playback review, not a new mandatory human sign-off, precedes posting. A demo without a ticket may remain a local recording.

## 9. Visible phase state and forward progress

Workspace colors communicate workflow phase only; labels communicate role state. Mapping: research Blue, conflicts Purple, delivery Orange, ci Amber, ready-for-human Green, blocked Red. Red overrides active phase until resolved. Display research while parallel read-only conflict discovery runs; then conflicts if repair remains, delivery, CI, ready. Source-gap remains a source pill, not a red blocker when behavior is clear. Publish task-local service state separately per service with `handler.service.<slug>` and `starting|up|down|unknown`; an expected down state in a validation scenario is evidence, not a blocker by itself.

Use explicit workspace-targeted commands:

```sh
cmux workspace-action --workspace <ws> --action set-color --color <name>
cmux set-status handler.phase <value> --workspace <ws> --priority 80
cmux set-status handler.blocker <reason> --workspace <ws> --color '#C0392B' --priority 100
cmux set-status handler.source <documented|source-gap|ambiguous> --workspace <ws>
cmux set-status handler.ci <pending|pass|fail|not-started> --workspace <ws>
cmux set-status handler.service.<slug> <starting|up|down|unknown> --workspace <ws>
cmux rename-tab --workspace <ws> --surface <surface> --title '<TICKET> <role> · <state>'
cmux notify --workspace <ws> --title '<ticket>: <state>' --body <reason-and-next-action>
cmux trigger-flash --workspace <ws>
```

Clear only handler-owned stale blocker keys when resolved and inactive service keys. Do not overwrite unrelated sidebar entries, global palettes, or other workspace colors. Do not invent progress percentages. Notify/flash once entering a blocker and once at ready-for-human; service notifications are deduplicated per ticket/service/state/candidate SHA. Separately emit `reference-validated` only with actual reproduction evidence and independent supporting citations. Deduplicate other notifications by ticket/state/candidate SHA in the handoff log. If cmux is unavailable, continue safe ticket work with textual status and report the visibility limitation.

A blocker states what failed or is prohibited, why it prevents the next gate, observed evidence, who can resolve it, and the exact next action. Use `unknown` when cause is not established. Ticket Todo/In Progress status alone is not an implementation blocker because Handler does not change ticket state. Pending CI stays in phase `ci` with its next scheduled check; it is not product ambiguity. Continue independent permitted recording, posting, and review while waiting. A failed lint check permits a scoped fix/review/push loop; the new push invalidates candidate evidence. Stop only the dependent lane for missing permissions, ambiguous behavior, conflicting ownership, or unavailable prerequisites. Reevaluate restrictions and clear stale blocker pills when authorization changes or evidence establishes recovery.

## 10. Handoff

Return ticket, repository, selected branch/base/worktree, baseline and candidate SHAs, PR URL/state, behavior inventory, source evidence/status, lane roster/results, conflict plan/choices and integration SHA, service dependency matrix/owners/observed states/request results, test plan/red-green evidence, changed files, review findings, exact check commands/results/run URLs/SHA, proof paths/accessibility, posting comment URL/ID or blocker, cmux state/limitation, assumptions/risks, and next action. Include this compact per-gate evidence table:

| Gate | Observed state | Candidate SHA | Evidence | Cause | Owner | Next action |
|---|---|---|---|---|---|---|
| Implementation / capture / ticket posting / lint / formatting / TypeScript / review | ... | ... | ... | ... | ... | ... |

Separate implementation, capture, ticket posting, CI categories, and review. Do not describe a failed upload as failed implementation. Overall state is `blocked`, `ready-for-human`, or another observed state; never claim completion from an unobserved gate.
