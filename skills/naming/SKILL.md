---
name: naming
description: Use when writing, reviewing, editing, or renaming tests, variables, functions, classes, types, components, scenarios, tickets, branches, or other identifiers where names may be vague, implementation-focused, misleading, or hard to understand.
---

# Naming

## Purpose

Make names carry domain intent. A good name explains behavior, responsibility, or concept before the implementation is read.

## Core Rule

Name the observable behavior, domain concept, responsibility, or condition. Avoid implementation mechanics, temporary shape, or vague category.

Prefer names that answer:

| Thing being named | Name should answer |
| --- | --- |
| Test or scenario | What user, stakeholder, or system-domain behavior must hold? |
| Function or method | What outcome or capability does this provide? |
| Boolean | What condition is true? |
| Variable or parameter | What domain value is this? |
| Class, type, or component | What responsibility or concept does this represent? |
| Ticket or branch | What user-visible outcome or delivery intent changes? |

## Request Changes For

Reject or rewrite names that are:

- vague: `works`, `handles errors`, `manager`, `helper`, `data`, `thing`, `temp`, `result`, `process`, `handle`, `doStuff`
- implementation-focused: `calls retryOrder`, `uses mock`, `renders component`, `sets flag`, `database row`
- misleading: names that promise different behavior than the code/test covers
- abbreviation-heavy: single letters or private shorthand outside tiny local conventions
- type-only: `stringValue`, `arrayData`, `responseObject` when domain meaning is known

Implementation words are allowed only when they are the user's visible domain language or the artifact is inherently technical, such as a parser, compiler, migration, CLI flag, or API contract test.

Generic technical names are acceptable only when the abstraction is genuinely generic and constraints are obvious, such as `mapValues`, `parseJson`, `RetryQueue`, or `HttpRequest`. If a generic name hides a product concept, request a domain name.

Unused private fields still need clear names. Request a meaningful domain name or removal if no role is demonstrated.

## Rewrite Pattern

1. Identify actor, domain object, condition, and observable outcome.
2. Remove framework, mock, storage, selector, or private-method language.
3. Include the context that prevents ambiguity.
4. Check that the name survives internal refactors.
5. For tests, verify setup/action/assertions match the name.

## Examples

| Weak | Strong |
| --- | --- |
| `it('works')` | `customers can save a draft invoice before sending it` |
| `it('calls retryOrder')` | `customers do not receive duplicate orders when checkout is retried` |
| `handle(user)` | `canViewAccountSettings(userSession)` |
| `flag` | `isSessionExpired` |
| `Manager` | `SessionAccessPolicy` |
| `Fix auth middleware` | `Prevent expired sessions from viewing account settings` |

## Review Output

When reviewing names, separate accepted names from requested changes:

```md
## Naming review
### Request changes
- `<name>`: why it is vague, implementation-focused, misleading, or too broad; suggested replacement when enough context exists.

### Accept
- `<name>`: why it clearly communicates behavior, responsibility, or domain meaning.

### Open questions
- Use only when the right domain term cannot be inferred safely.
```

Do not invent business rules. If the domain term is unclear, suggest two alternatives when code narrows the possibilities; ask an open question only when replacement would invent product meaning.
