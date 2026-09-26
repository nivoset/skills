# Objective Check Readiness Checklist

## Tracker and Graph

- [ ] Root ticket can be an Epic, Feature, or parent ticket.
- [ ] Tracker statuses, labels, ticket types, hierarchy, blocker relation types, comments, and PR links are discovered or explicitly confirmed.
- [ ] Triage/review-needed, Todo/implementation-ready, in-progress, verification-ready, done, and canceled semantics are mapped or listed as unknown.
- [ ] Tracker state is re-fetched before verdicts; no durable local manifest or cached run state is treated as source of truth.
- [ ] All descendants are fetched recursively.
- [ ] Dependencies/blockers include feature-feature, ticket-ticket, and mixed feature-ticket relationships.
- [ ] Linked PRs/branches and known tracker automation are recorded when visible.

## Parent Objective Coverage

- [ ] Parent Summary and Desired/Expected Outcome are clear.
- [ ] Scope boundaries are explicit.
- [ ] Behavior Blueprint scenarios are behavior-level and user/system observable.
- [ ] Every scenario has a stable ID.
- [ ] Every parent scenario/objective maps to child tickets, or has an explicit deferred/non-goal note.
- [ ] A parent with uncovered direct work is classified as requiring decomposition or explicitly approved direct parent work.
- [ ] Parent verification/QA readiness requires all descendant requirements to be implemented, unblocked, and verified with executed passing evidence or approved exceptions.
- [ ] No child ticket contradicts parent scope or sibling/dependent work.

## Leaf Readiness

- [ ] Leaf is in the tracker workflow's runnable status, not merely triage/review-needed; for current Linear TDD orchestration, runnable means Todo.
- [ ] Leaf has no children.
- [ ] Leaf is not done, canceled, blocked, or owned by an active PR automation path that should be skipped as `todo_has_pr`.
- [ ] Leaf has numbered, independently testable acceptance criteria.
- [ ] Leaf scope boundaries are clear.
- [ ] Leaf dependencies/blockers are clear and currently satisfied or sequenced.
- [ ] Leaf references parent scenario IDs when applicable.
- [ ] Leaf includes Test Evidence for each AC.
- [ ] Expected red failure is specific enough to write or identify a failing test.
- [ ] Automated tests are planned for every AC unless an explicit approved exception exists.
- [ ] For verification/QA readiness, each AC has executed passing evidence or an approved exception.
- [ ] Manual review/testing is listed only as supplemental evidence or an approved exception.

## Dependency and Sequencing

- [ ] No circular blockers exist.
- [ ] Parent objectives stranded behind triage/review-needed tickets are summarized in refinement priorities.
- [ ] If a triage/review-needed ticket blocks remaining descendant work, the affected branch stops; do not comment solely because the ticket is triage.
- [ ] If no runnable leaves remain, produce a no-runnable-work summary with per-ticket states and refinement priorities.
- [ ] No feature/ticket dependency makes the selected leaf impossible to verify.
- [ ] Duplicate or conflicting coverage is either intentional or commented.
- [ ] Blocked local leaves do not prevent unrelated ready leaves from continuing.

## Comment Routing

- [ ] Existing objective-check comments with the stable marker are updated when possible instead of duplicated.
- [ ] Triage-only blockers are summarized rather than commented unless they also have a concrete validation finding.
- [ ] Leaf-local issue comments target the leaf.
- [ ] Scenario coverage or decomposition issues target the parent.
- [ ] Root contract issues target the root ticket.
- [ ] Comments include scenario/AC IDs, evidence, question/decision needed, and run impact.
