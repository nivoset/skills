---
name: bug-bash-external-integrations
description: Review a whole codebase or named area for third-party API, webhook, timeout, and fallback bugs using the shared bug bash report format.
---

# Bug Bash External Integrations

## Purpose

Use this skill to investigate whether third-party dependencies fail safely, visibly, and consistently.

## When to Use

- Use for external APIs, SDKs, webhooks, auth providers, storage services, messaging platforms, and file or export integrations.
- Use when the user names a vendor, adapter, client, webhook, or sync process.

## Scope Inputs

Default to the full codebase. Narrow when the prompt names an `integration`, `module`, `route`, `workflow`, `job`, `path`, or `screen`.

## Core Rules

- Inspect provider interactions, retries, timeouts, and fallback behavior before asking questions.
- Prefer existing mocks, fixtures, and integration-specific tests where they are trustworthy.
- Do not commit or repair code.
- If current tests over-mock the provider boundary, explain the minimum stable contract coverage needed.
- Use the shared severity, confidence, and finding schema from `bug-bash`.

## Investigation Focus

Look for:

- timeout handling gaps
- malformed or partial responses
- non-200 response handling
- auth expiration or credential drift
- rate limiting behavior
- retry exhaustion
- partial success where local and remote state diverge
- sync jobs that silently fall behind
- tests that mock away the behavior they claim to verify

Attack vectors to emphasize:

- external dependency failure
- silent failure
- unhandled exception
- swallowed error
- file, import, or export failure
- background job failure
- configuration or environment assumption
- mock honesty

## Workflow

1. State the resolved scope.
2. Map provider calls, inbound events, retries, and fallbacks.
3. Inspect adapters, consumers, jobs, and tests.
4. Verify whether failures are surfaced, retried appropriately, and kept consistent with local state.
5. Report impact on users, operators, and downstream systems.

## Reporting

Return a standalone scoped `# Bug Bash Report`.

Treat overly fake integration tests as findings when they create false confidence around important business behavior.
