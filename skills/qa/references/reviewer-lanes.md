# QA Reviewer Lane Catalog

Launch every lane. The primary owner should lead synthesis for its concern; intentional secondary ownership is retained for independent boundary checks.

## 1. Correctness and Domain Behavior

**Primary sections:** Correctness, Domain Modeling, Data Design, Behavior Coverage, Case and Data Testing.

**Inspect:** functional outputs and business rules; operation ordering and required or unintended side effects; invariants; minimum/maximum, empty, missing/null, first/last, exact-threshold, precision, date/time/locale/timezone behavior; invalid operations, partial completion, rollback, useful errors, retryability; state transitions, impossible/duplicate/stale/out-of-order/concurrent updates; entities, value objects, identity, equality, lifecycle, policies, preconditions, outcomes, compensation, precedence, effective dates; types, nullability, referential integrity, ownership, source-of-truth, derived data, retention, archival, deletion; acceptance/Gherkin, happy/failure/regression coverage, partitions, fixtures, builders, parameterization, and tests that pass for the wrong reason.

**Look for:** missing rules, constructible invalid states, omitted boundaries, inconsistent related data, contradictory tests, missing requirement-to-test links, and fixtures hiding defects.

**Example:** a discount rule handles values above and below the threshold but applies the wrong rule at the exact threshold, or persists an order before validating an invariant and leaves partial state after failure.

## 2. Clarity and Code Structure

**Primary sections:** Clarity, Cohesion and Responsibility, Standards and Conventions, Reviewability.

**Inspect:** names, domain vocabulary, function/type/boolean names, units and abbreviations; visible intent, assumptions, business decisions versus plumbing, unusual behavior; grouping, control flow, function/module size, public behavior discoverability; indirection, cleverness, speculative flexibility, dead or obsolete paths, excessive configuration; why-comments, API and algorithm/workaround documentation, exit conditions; focused functions/modules/classes/services, layer responsibilities, abstraction level; language idioms, repository/file/export/test conventions, formatting, linting, type-checking; diff scope, cleanup, generated noise, debugging code, explanation, and evidence.

**Look for:** misleading names, mixed responsibilities, abstraction-level jumps, utility dumping grounds, hidden business behavior, comments compensating for structure, inconsistent patterns, and diffs that require broad system knowledge.

**Example:** a `validateAndSaveAndNotify` function combines policy, persistence, and messaging, while a generic `helpers` module hides business decisions behind vague names.

## 3. Architecture, Coupling, and Abstraction

**Primary sections:** Coupling and Dependencies, Abstraction, Maintainability, Portability and Compatibility, Sustainability.

**Inspect:** dependency direction, domain independence, policy/detail boundaries, stable abstractions, infrastructure and framework leakage; explicit versus hidden dependencies, injection, globals, service location, construction versus behavior; interface width, escaped internals, shared libraries and unused dependencies; library necessity, maintenance, upgrades, vendor isolation, failure behavior, replacement cost; temporal coupling, initialization, cleanup, partially usable objects; reuse, leaky or premature abstractions, shared syntax versus shared meaning; local reasoning, change isolation, consistency, deletability, extensibility, migrations; browser/runtime, filesystem, encoding, case, environment, and network assumptions; complexity, ownership, bus factor, debt, and dependency viability.

**Look for:** wrong dependency direction, framework logic in domain code, global coupling, internal implementation in APIs, abstractions before real duplication, incorrect unification, scattered platform assumptions, and ownership costs disproportionate to the problem.

**Example:** a domain policy imports a framework request object and a global service locator, making it impossible to run deterministically or replace infrastructure.

## 4. Testing Design and TDD

**Primary sections:** Test Strategy, TDD, Unit Testing, Test Design, Test Coverage, TDD as a Design Practice, Regression Testing.

**Inspect:** risk-based strategy, critical paths, baselines, change-aware selection, level distribution and confidence; red/green/refactor evidence, expected failure reason, one behavior per cycle, minimal implementation, refactoring and reverted attempts; pure transformations, calculations, validation, policies, transitions, and focused errors; arrange-act-assert, behavioral names, meaningful and negative assertions, precise outcomes, messages, readability and visible data; line/branch limitations, coverage gaps, mutation testing, incidental execution; regression reproduction, lowest reliable boundary, preserved intent, obsolete tests; design pressure toward small interfaces, visible dependencies, determinism, policy/infrastructure separation, and avoiding mock-heavy architecture.

**Look for:** meaningful behavior without tests, names unsupported by assertions, setup-caused red states, overimplementation, implementation-coupled tests, weak assertions, coverage numbers without confidence, broad regression tests, and TDD that creates fragmented or mock-heavy design.

**Example:** a test named `rejectsExpiredToken` only asserts that a mock was called, so the implementation could return success and still pass.

## 5. Test Boundary, Double, and Contract

**Primary sections:** Test Boundaries, Test Doubles, Integration Testing, Contract Testing.

**Inspect:** unit/integration/contract/end-to-end levels, smallest trustworthy boundary, distinct confidence, duplication; real implementations, fakes, stubs, spies, mocks, mock accuracy and interaction assertions; database, filesystem, HTTP, framework, authentication, broker, queue, and serialization boundaries; real engine constraints, transactions, rollback, isolation, locking, query behavior, migrations; request/response schemas, headers, statuses, events, consumer assumptions, provider verification, version and persisted-data compatibility.

**Look for:** central risk hidden behind mocks, integration tests with no added confidence, E2E tests for narrow logic, production behavior copied inaccurately, drifted contracts, in-memory databases masking constraints, missing transaction/constraint tests, and class-boundary rather than risk-boundary placement.

**Example:** unit tests mock a database transaction API while no integration test verifies rollback and uniqueness constraints against the production engine.

## 6. Test Reliability and Suite Maintainability

**Primary sections:** Test Independence, Test Reliability, Test Maintainability, Test Pipeline Design, Test Suite Architecture, Change-Aware Classification.

**Inspect:** ordering, parallelism, shared state, unique data, cleanup, transaction isolation and fixtures; time, randomness, locale, timezone, async completion, eventual consistency, network and environment variables; sleeps, polling, selectors, races, retries, quarantine, artifacts and ownership; helpers, fixtures, builders, hidden assertions, parameterization, organization and naming; local/watch, PR, mainline, scheduled and release stages, fail-fast, reproducibility, artifacts and budgets; baseline/capability tags, change-aware selection, duplicates, missing/obsolete tags, ownership, duration growth, confidence per stage.

**Look for:** order dependence, shared mutable fixtures, fixed delays, unawaited work, environment-dependent results, retries hiding defects, helpers hiding intent, fixture systems becoming applications, poor feedback ordering, missing critical PR tests, indiscriminate execution, and irreproducible CI failures.

**Example:** a test passes alone but fails in parallel because a shared fixture reuses the same account and cleanup runs asynchronously.

## 7. Error Handling, Resilience, and Concurrency

**Primary sections:** Error Handling and Resilience, Concurrency and Asynchrony, Testing Error Cases, Resilience Testing.

**Inspect:** validation/authentication/authorization/not-found/conflict/timeout/rate-limit/dependency/internal error classification; propagation boundaries, causes, context, translation, swallowed errors; retry/backoff/jitter/limits, idempotency, resumption, rollback, poison messages; safe degradation, stale-data signaling, resource cleanup, cancellation and timeouts; shared state, atomicity, races, check-then-act, deadlocks, lock ordering, contention, async tasks, bounded parallelism; duplicate/out-of-order/late delivery, deduplication, versions and eventual consistency; outage, partial response, timeout, duplicate request, stale update, concurrent modification, and recovery tests.

**Look for:** swallowed or misclassified errors, retries on permanent failures, unlimited retries, non-idempotent recovery, partial work, unsafe fallbacks, leaked resources, unawaited tasks, races, deadlocks, unbounded concurrency, and generic-only failure assertions.

**Example:** a timeout retry repeats a non-idempotent payment request without an idempotency key and can leave the system with duplicate charges.

## 8. Security and Privacy

**Primary sections:** Security, Security Testing, Abuse Resistance, Sensitive Data Protection.

**Inspect:** validation, injection, traversal, file restrictions, payload limits, encoding and normalization; credential/session expiry, revocation, token validation, failure leakage; server-side ownership, role/object/bulk authorization and default deny; minimization, encryption, secrets, sensitive logs, retention, backup/export protection; contextual output encoding, markup, redirects, headers and errors; lockfiles, dependencies, build scripts, provenance, CI permissions and credential scope; rate limits, quotas, expensive operations, repeated failures and audit events; negative tests for credentials, cross-user access, privilege escalation, injection, uploads, leakage and deletion.

**Look for:** unvalidated input, UI-only authorization, cross-user access, excessive privilege, secrets in code/logs, sensitive errors, missing rate limits, unsafe files/redirects, unverified dependencies, and happy-path-only security tests.

**Example:** an endpoint checks ownership in the frontend but accepts any object ID on the server, allowing one user to read another user's record.

## 9. Performance and Resource Efficiency

**Primary sections:** Performance, Performance Testing, Resource Management, Scalability Concerns.

**Inspect:** algorithmic complexity, repeated work, data structures and pathological inputs; network calls, batching, streaming, pagination, serialization and unbounded reads; indexes, N+1, over-fetching, transactions, lock contention and query plans; cache usefulness, invalidation, staleness, sensitive data and stampede prevention; frontend bundle/render/list/layout behavior; memory, threads, connections, queues, payloads, timeouts, backpressure and parallelism; benchmark/load/stress/soak/spike/capacity tests, percentiles, throughput, errors, saturation and budgets.

**Look for:** poor complexity, repeated expensive work, N+1 queries, unbounded collections/concurrency, memory growth, oversized payloads, invalidation defects, missing backpressure, unmeasured optimization, and unrealistic workloads.

**Example:** an API loads every record into memory and serializes the full collection for a screen that only displays the first page.

## 10. API, UX, Accessibility, and Compatibility

**Primary sections:** API and Contract Design, User Experience in Code, Accessibility and Inclusive Behavior, Accessibility Testing, Visual Testing, Compatibility Testing.

**Inspect:** input/output contracts, optionality/defaults, invalid combinations, error models, idempotency, side effects, ordering, versioning and deprecation; loading/success/error/progress feedback, prevention, destructive safeguards, duplicate submissions, unsaved work, recovery and undo; semantic HTML, names, keyboard/focus, announcements, contrast, zoom, text scaling, reduced motion, touch targets and fields; responsive states, breakpoints, design consistency, snapshots and animation; browsers/runtimes, locales/timezones, schemas, devices and platform behavior.

**Look for:** invalid API states, ambiguous absence/failure, hidden side effects, breaking changes without migration, missing feedback, unsafe destructive actions, lost input, inaccessible controls, broken focus, ARIA misuse, responsive regressions, huge snapshots, and locale/timezone assumptions.

**Example:** after a failed form submission, the component remounts and discards entered values, while focus is not restored to the first invalid field.

## 11. Observability, Operations, Traceability, and Appropriateness

**Primary sections:** Observability, Operability, Traceability, Appropriateness, Deployment and Configuration, Final System-Level Quality.

**Inspect:** meaningful logs, levels, correlation IDs, error context, noise and sensitive-data exclusion; throughput, errors, latency, saturation, business outcomes and metric cardinality; cross-service traces, external calls, queued work, slow operations and causality; audit actor/action/target/time, tamper resistance, access and retention; liveness/readiness, dependency health, versions and configuration/flag visibility; externalized settings, validation, safe defaults, secret separation and environment parity; reproducible builds, rollout/rollback, migration coordination, graceful shutdown and limits; flag purpose/owner/default/combinations/expiration; requirements-to-code, rules-to-tests, decisions-to-ADRs, builds-to-commits, migrations-to-releases and incidents-to-changes; risk proportionality for prototype/production, public/internal, reversible/irreversible decisions, failure cost, scale and delivery.

**Look for:** failures that cannot be diagnosed, context-free logs, missing metrics/traces, high-cardinality telemetry, bad health checks, silently invalid configuration, no rollback, ownerless flags, untraceable behavior, and rigor disproportionate to risk.

**Example:** a feature flag changes payment behavior but has no owner, expiry, activation audit, combination tests, or rollback procedure.

## Ownership map

| Concern | Primary | Secondary or intentional overlap |
|---|---:|---|
| Correctness, domain, data, behavior coverage | 1 | 4, 7, 10, 11 |
| Clarity, cohesion, conventions, reviewability | 2 | 3 |
| Coupling, abstraction, maintainability, sustainability | 3 | 2, 4 |
| Test strategy, TDD, unit tests, test design, coverage, regression | 4 | 1, 5, 6, 7 |
| Test boundaries, doubles, integration, contracts | 5 | 4, 6, 10 |
| Test independence, reliability, maintainability, pipeline | 6 | 4, 5, 9, 11 |
| Errors, resilience, concurrency, asynchrony | 7 | 1, 5, 6, 9 |
| Security, privacy, abuse resistance | 8 | 1, 5, 7, 9, 10, 11 |
| Performance, resources, scalability | 9 | 3, 5, 6, 7, 10, 11 |
| API, UX, accessibility, visual and compatibility | 10 | 1, 3, 5, 6, 8, 9 |
| Observability, operations, traceability, appropriateness | 11 | 1, 3, 6, 7, 8, 9, 10 |
