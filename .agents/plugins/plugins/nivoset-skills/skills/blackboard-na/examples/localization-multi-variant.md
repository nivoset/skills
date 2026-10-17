# Localization and multi-variant overlay

Use when behavior or content varies by locale, language, script, region, market, tenant, brand, platform, or tier. The central artifact is a variant matrix: every in-scope member crossed with every relevant review dimension, with disposition and evidence per cell.

Linguistic quality, locale behavior, international formats, layout/accessibility, and release completeness are separate dimensions; evidence for one never proves another.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `locale-scope-keeper` | Establishes the authoritative membership and support tier the matrix depends on. | The locale/market list or support tier is absent or changed. | Case-family membership plus tier proposals as `human-required` questions. | Membership or expected quality remains undecided. |
| `linguistic-quality-reviewer` | Provides language-specific quality evidence that mechanical checks cannot replace. | Copy changes in a locale whose accepted tier requires review; an undecided tier reactivates `locale-scope-keeper`. | Terminology, tone, grammar, placeholder, and in-context findings plus a request for qualified human sign-off. | Required human linguistic validation is unavailable. |
| `locale-behavior-reviewer` | Prevents selection, persistence, search, server output, and fallback from producing mixed behavior. | Selection, persistence, fallback, server output, search, or market logic changes. | Behavior cases and fallback-chain checks. | Selection or fallback remains ambiguous. |
| `international-format-reviewer` | Separately proves display, parsing, and storage for locale-sensitive values. | Dates, times, numbers, currencies, units, plurals, names, addresses, or phones appear. | Parameterized display, parsing, and storage checks against a stated locale-data version. | A required format lacks an authoritative rule or test. |
| `localized-layout-accessibility-reviewer` | Finds expansion, direction, script, input, and pronunciation failures hidden in source-language UI. | Translatable UI changes or a new direction/script class enters scope. | Expansion, truncation, direction, glyph, line-break, language metadata, accessible-name, and input evidence. | A required script class is unusable or inaccessible. |
| `localization-release-reviewer` | Makes release completeness exhaustive and catches stale or hardcoded content. | A translation schedule/freeze is absent or at risk, or a release changes translatable assets. | Completeness, hardcoded-string, placeholder, stale-translation, gating, and fallback checks. | Required assets are missing, stale, or unscheduled. |
| `variant-matrix-keeper` | Maintains balanced coverage across all members and dimensions, not only locales. | The overlay is active and the matrix is missing, or a member, dimension, invariant, or mechanism changes. | Variant membership, shared invariants, exceptions, and balance record. | A required member or dimension is unexplained. |

## Role relationships

`localized-layout-accessibility-reviewer` specializes `accessibility-reviewer`; `localization-release-reviewer` specializes `release-reviewer`. Reuse `compliance-reviewer` for market obligations, `end-user-advocate` for user agency, `integration-reviewer` and `privacy-reviewer` when content leaves the system, and `ai-safety-reviewer` when automated translation is used. Reuse `validation-planner`, `observability-reviewer`, and `tradeoff-broker`; every tradeoff names its authority.

## Validation additions

Use exhaustive catalog and placeholder checks; parameterized format/parse/storage tests; representative expansion/direction/script renders; accessibility checks; fallback checks; human in-context linguistic review; representative end-to-end variants; and production missing-key/error signals. If required human review is unavailable, keep the case `required`/`human-required`; content fallback is an authority decision, not reviewer approval.

## Implication sweeps

Cover supported locales, script/direction classes, plural classes, fallback chains, surfaces, and non-language variants. Linguistic quality is never equivalent across languages. Mechanical completeness is exhaustive. Layout sampling records its rule and includes expansion, right-to-left, complex-script, and boundary representatives.

## Tradeoffs

- Block a locale on missing content vs. use fallback content.
- Human translation vs. assisted translation and post-editing by support tier.
- Automatic selection vs. explicit user choice.
- Full market parity vs. staged release.
- Shared layout/variant mechanism vs. specialized implementations.
