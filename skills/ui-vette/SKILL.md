---
name: ui-vette
description: Use when a rendered UI must be visually compared with supplied references through four focused review roles covering design fidelity, frontend implementation, QA edge cases, and accessibility. Requires a reachable implementation URL and at least one usable visual reference; produces a read-only, evidence-backed ui-vette.md report.
---

# UI Vette

Run a four-role visual QA review of a rendered implementation against its intended visual reference. This skill is read-only: inspect, capture, compare, and report; do not edit the application, commit changes, or claim that an issue was fixed.

## Preconditions

Require both artifacts before reviewing:

- A reachable implementation URL, route, or already-rendered screen supplied by the user. Do not invent a dev-server command or start the application automatically.
- At least one visual reference supplied by the user or discoverable in the task context: image, screenshot, Figma frame, mockup, reference URL, design board, or visual specification.

If either artifact is missing, inaccessible, or represents a materially different route/state, write a blocked report naming the exact missing artifact and stop the comparison. Do not infer visual truth from source code alone.

Use the available browser or screenshot tooling to open the reference and implementation. If a browser tool is unavailable, use another available read-only capture path; never state that a visual comparison happened without visual evidence.

## Workflow

1. **Resolve the target.** Record the implementation URL, route, viewport, device/theme, auth state, content/data state, and interaction state. Identify every supplied reference and select the one that best represents the requested output. Keep additional references as supporting evidence.
2. **Capture matched evidence.** Capture the implementation at the same viewport and state as the reference. Capture relevant variants when available: desktop/tablet/mobile, light/dark, loading/empty/error, and hover/focus/active. Include the source and implementation together in each comparison input; do not judge from memory or from separate unpaired views.
3. **Normalize.** Align crop, viewport, scale, device frame, CSS dimensions, and pixel density before judging. Prefer content-region captures over browser chrome. Record source pixels, implementation pixels, CSS viewport, and device scale factor in the report. Treat density, browser chrome, canvas padding, and device-frame mismatches as capture issues to resolve—not findings.
4. **Dispatch four reviews.** Run one independent reviewer per responsibility region. Give each reviewer the shared normalized evidence and exactly one role file:
   - Product Designer: [`references/product-designer.md`](references/product-designer.md)
   - Frontend / UI Developer: [`references/frontend-ui-developer.md`](references/frontend-ui-developer.md)
   - QA / Test Automation Engineer: [`references/qa-test-automation.md`](references/qa-test-automation.md)
   - Accessibility Lead / Specialist: [`references/accessibility-specialist.md`](references/accessibility-specialist.md)

   When parallel subagents are available, dispatch all four together. Otherwise run four isolated local passes, one per role, and preserve the role boundaries. Do not give a reviewer another role file; the main skill supplies the shared evidence, reviewer contract, severity levels, and report contract.
5. **Merge findings.** Deduplicate issues found by multiple roles while preserving every responsible role. Verify each accepted finding against the captured evidence. Separate objective mismatches from subjective polish suggestions and distinguish intentional product constraints from unexplained drift.
6. **Write the report.** Save `ui-vette.md` at the reviewed project root. Return its path and a concise handoff summary.

## Shared Reviewer Contract

Each reviewer must return only findings grounded in the shared visual evidence, plus an explicit all-clear statement for checked areas. Every finding includes:

- Role and severity (`P0`, `P1`, `P2`, or `P3`)
- Exact screen, region, selector, or interaction state when known
- What the reference shows versus what the implementation shows
- Evidence from the paired capture
- User impact
- Concrete suggested resolution
- Suggested validation or reproduction step
- Confidence and open question, if applicable

Use these severity levels:

- `P0`: core use is blocked, the layout is unusable, or there is a severe accessibility failure.
- `P1`: major visual drift, usability regression, or important state/responsive failure likely to be noticed by users.
- `P2`: meaningful visual drift, edge-state issue, or responsive inconsistency that does not block the primary task.
- `P3`: minor polish or fidelity refinement.

The final result is `passed` only when no actionable `P0` or `P1` findings remain. `P2` items remain visible as follow-up work; `P3` items are polish. Use `blocked` when the evidence is unavailable, the comparison states cannot be matched, or actionable `P0`/`P1` findings remain.

## Report Format

Write the report with this structure:

```md
# UI Vette Report
## Executive summary
## Scope and comparison contract
## Evidence
## Role coverage
## Findings by priority
## Testing gaps and open questions
## Follow-up checklist
## Final result
```

The evidence section must include:

- Source visual truth path or URL.
- Implementation URL and screenshot path(s).
- Viewport, route, state, theme, content, and auth context.
- Source and implementation pixel dimensions, CSS dimensions, and density normalization.
- Full-view comparison evidence.
- Focused-region evidence, or why it was not needed.

For findings, use this compact format:

```md
### [P1] Short issue title
- Roles: Product Designer; QA Engineer
- Location: screen/region/selector/state
- Difference: reference shows X; implementation shows Y
- Evidence: paired capture path or URL
- Impact: concrete user or product consequence
- Suggested resolution: actionable fix direction
- Suggested validation: exact state or viewport to recheck
- Confidence: Confirmed | High | Likely
```

Every merged report explicitly checks these shared fidelity surfaces: fonts and typography; spacing and layout rhythm; colors and visual tokens; image and asset fidelity; and copy/content. Do not report “matches,” “done,” or “ready” until these surfaces and all four responsibility regions have been checked. If a required state or comparison cannot be captured, list it as a testing gap and mark the report `blocked`.

## Safety and Scope

- Inspect only the supplied implementation and references plus files needed to identify route/state context.
- Do not modify source files, install dependencies, start processes, commit, deploy, or send external messages.
- Do not treat a screenshot generated from the wrong viewport, route, state, theme, density, or device frame as valid evidence.
- Do not turn an unavailable browser or screenshot capability into an unverified visual conclusion.
- Keep the final response concise; the detailed evidence belongs in `ui-vette.md`.
