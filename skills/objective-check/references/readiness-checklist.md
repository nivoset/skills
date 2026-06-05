# Objective Check Readiness Checklist

## Tracker and Graph

- [ ] Root ticket can be an Epic, Feature, or parent ticket.
- [ ] Tracker statuses, labels, ticket types, hierarchy, and blocker relation types are discovered or explicitly confirmed.
- [ ] Triage/review-needed, implementation-ready, in-progress, verification-ready, done, and canceled semantics are mapped or listed as unknown.
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

- [ ] Leaf is in the tracker workflow's implementation-ready status, not merely triage/review-needed.
- [ ] Leaf is not done, canceled, blocked, or owned by an active PR automation path that should be skipped.
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
- [ ] No parent objective is stranded behind an unresolved triage/review-needed ticket without a comment.
- [ ] If a triage/review-needed ticket blocks remaining descendant work, the affected branch stops and receives a blocker comment.
- [ ] No feature/ticket dependency makes the selected leaf impossible to verify.
- [ ] Duplicate or conflicting coverage is either intentional or commented.
- [ ] Blocked local leaves do not prevent unrelated ready leaves from continuing.

## Comment Routing

- [ ] Existing objective-check comments for the same scenario/AC/problem are updated when possible instead of duplicated.
- [ ] Leaf-local issue comments target the leaf.
- [ ] Scenario coverage or decomposition issues target the parent.
- [ ] Root contract issues target the root ticket.
- [ ] Comments include scenario/AC IDs, evidence, question/decision needed, and run impact.
