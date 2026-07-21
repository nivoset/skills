# Assignment / Ownership / Routing

Example: assign ticket, route task, set reviewer.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- User assigns item to valid owner
- User reassigns item
- User unassigns item
- Assignment triggers notification
- Assignee sees item in their queue

## Sad cases

- Assignee invalid
- Assignee lacks access
- User lacks permission to assign
- Item cannot be assigned in current state
- Assignment update fails

## Edge cases

- Assign to self
- Assign to team/group
- Multiple assignees
- Round-robin routing
- Assignee deactivated
- Assignment while item is closed
- Race condition with another assignment

## Research / decision notes

- Can there be multiple owners?
- What happens when owner leaves?
- Is assignment required?
- Does assignment affect permissions?
