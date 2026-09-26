# Notification / Email / Message

Example: invite email, status alert, Slack notification.

Use these as prompts for coverage; rewrite them into domain-specific, observable scenarios before finalizing Gherkin.

## Happy cases

- Notification is sent after trigger
- Notification contains correct recipient
- Notification contains correct content
- Notification includes correct link/action
- User can act from notification
- Notification is recorded/logged

## Sad cases

- Recipient missing
- Recipient invalid
- Notification provider fails
- Notification is delayed
- User unsubscribed
- User lacks permission by time they open link
- Duplicate notification risk

## Edge cases

- Multiple recipients
- Role-based recipients
- Localization
- Time zones
- Retry behavior
- Notification preference settings
- Digest vs immediate notification
- Notification sent after rollback

## Research / decision notes

- What triggers the notification?
- Who receives it?
- Is it required or best-effort?
- Can users opt out?
- What happens on delivery failure?
