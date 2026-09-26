# Validation Checklist

Run through this checklist before creating any ticket.

## Universal Checks

- [ ] Role or permission policy is explicit when it affects creation, editing, assignment, or status changes
- [ ] Parent context and placement are resolved when required by the target tracker or team workflow
- [ ] Draft has been shown to the user and explicitly approved before any create step
- [ ] State defaults to `Todo` unless the user overrides it
- [ ] Assignee remains unassigned unless the user overrides it
- [ ] Tracker-specific metadata is explicit and not hidden in the body

## Tag and Type Checks

- [ ] Ticket type is one of the active workflow's accepted types
- [ ] Suggested tags match the ticket type unless the user or tracker policy overrides them
- [ ] Required labels, components, projects, milestones, or priorities are present when the target workflow requires them
- [ ] Optional tags are omitted when they would conflict with tracker-native fields

## Hierarchy Checks

- [ ] Epic has no parent unless the active workflow supports larger initiatives
- [ ] Feature links to a Parent Epic when the team uses that hierarchy
- [ ] Task links to a Parent Feature when the team uses that hierarchy
- [ ] Bug links to the relevant parent, component, release, or affected area when known
- [ ] Spike links to the relevant parent, decision, or affected area when known

## Estimation Checks

- [ ] Feature estimate is provided when the active workflow requires it
- [ ] Estimate uses the active workflow's sizing scheme, defaulting to T-shirt sizing when unspecified
- [ ] Spike has a time box

## Content Checks

- [ ] Bug reports include reproduction steps
- [ ] Bug reports include severity
- [ ] Bug reports match `references/template-bug.md`
- [ ] Spikes have expected deliverables
- [ ] Spikes have success criteria
- [ ] Feature and Task bodies do not duplicate tracker-native metadata
- [ ] Epic descriptions remain concise (avoid planning dumps in body)
- [ ] Final body is self-contained and understandable without chat history
- [ ] Final body uses plain Markdown for portability
- [ ] Reusable templates contain no company-specific, customer-specific, or private information unless intentionally supplied by the user for this ticket

## Session Context

- [ ] Confirmed parent, project, and team are reused unless the user overrides
- [ ] Native tracker or team template is used only when explicitly requested and available
