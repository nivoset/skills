# Test Quality Review

## Lane Id

`test-quality`

## Purpose

Review changed test files for quality issues that create false confidence: weak names, dishonest mocks, brittle assertions, and tests that would not catch real regressions.

## Topic Scope

Review changed test files only. Detect test quality issues:

- test names that do not accurately describe the behavior actually exercised and asserted
- mocks/stubs/spies used where the dependency works inside an isolated test system and the real implementation or simple fake would be more honest
- missing mocks/fakes for dependencies that do not work reliably in isolation, such as API calls, database access, external services, browser-only APIs, or components/web components that are not renderable in the test environment
- multiple test cases that assert the same observable outcome without differing inputs, setup, or edge-case coverage (consider `beforeEach`/`describe`-level setup when judging distinctness)
- weak matchers (`toBeTruthy`, `toBeFalsy`, `toBeDefined`, `toBeUndefined` as the sole assertion)
- brittle snapshots that capture noise such as generated class names, volatile values, or full DOM structure instead of the narrow behavior under test
- generic assertions where a domain-specific matcher would be clearer
- bundled expectations that hide independent behaviors, such as `expect({ focusedToolbar, blurredToolbar }).toEqual(...)`, `expect([button.disabled, label.textContent]).toEqual(...)`, or `expect(actual).toMatchObject(...)` — prefer direct assertions on each observable outcome with the most specific matcher available
- for TypeScript tests using jsdom, prefer `.toBeInTheDocument()` / `.not.toBeInTheDocument()` for presence
- question `fireEvent` when `userEvent` would better model real async interactions, focus, typing, pointer, or keyboard behavior; `fireEvent` is acceptable for simple synchronous low-level DOM events
- flag jsdom/unit tests that claim to prove browser-owned interactions such as drag/drop, resize, pointer capture, focus management, selection, scrolling, keyboard navigation, or layout measurement through mocked geometry, synthetic pointer events, timers, style values, or callback calls; recommend keeping narrow unit coverage for deterministic logic and adding one browser-level regression such as Playwright for the actual user flow
- flag tests that assert DOM implementation details such as class names, Tailwind layout tokens, inline styles, CSS variables, data attributes, or internal structure when the user-visible result could be asserted through visible text, accessible role/name/state, enabled/disabled behavior, navigation, persisted values, rendered affordances, or completing the interaction
- treat assertions like `toHaveClass` plus visual Tailwind tokens such as `top-`, `w-`, `h-`, `px-`, `py-`, `gap-`, `rounded`, `font-`, `shadow`, `translate`, `z-`, or arbitrary values like `w-[544px]` as brittle unless they are the only practical regression signal; recommend behavior/accessibility assertions for unit tests and browser-level visual coverage for exact look/layout parity
- flag brittle date/time tests where time is not frozen first, or where timezone/local-time/DST behavior is not pinned; prefer frozen time, and when freezing is not possible, harden the chosen timestamps/timezone expectations so the test is accurate without being flaky
- do not complain about justified isolation of network, filesystem, time, randomness, external APIs, expensive/flaky boundaries, unrenderable platform components, or last-resort DOM probes when no user-visible assertion is available
- return no findings when no changed test files are relevant

## When to Use

- Use when the diff touches `*.test.*`, `*.spec.*`, e2e specs, or other test harness files.
- Use when new tests were added alongside behavior changes.
- Do not use for missing scenario coverage; route that to test-scenarios.

## Core Rules

- Inspect changed test files only unless a production change clearly invalidates an unchanged test's honesty.
- Compare assertions and mocks against real code paths and repo testing conventions.
- Do not rewrite tests during review.
- Use shared severity, confidence, and finding schema from `vette`.

## Investigation Focus

For each weak test finding, explain:

1. what confidence the test appears to provide
2. why that confidence is false or incomplete
3. what bug could escape
4. whether a production bug is already visible
5. what stronger assertion, setup, or test type would catch it

Attack vectors to emphasize:

- weak assertion
- mock honesty
- test could pass while product is broken

## Workflow

1. State resolved scope and changed test files.
2. Read each changed test for name accuracy, setup honesty, and assertion strength.
3. Check whether tests prove user-visible outcomes rather than implementation details.
4. Flag brittle DOM, snapshot, time, or geometry assertions.
5. Return findings with topic severity `blocker`, `concern`, or `suggestion`, or return no findings when changed tests are not relevant.

## Reporting

Return lane findings for parent merge. Include the test file, the weak pattern, the escaped risk, and a concrete stronger assertion or test approach.
