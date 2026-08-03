# UI Vette Review Rubric

All reviewers use the same normalized source/implementation evidence. Review only the assigned region, then note adjacent issues only when they materially affect the assigned responsibility.

## 1. Product Designer (UI/UX)

Focus on visual structure, visual weight, clarity, and brand integrity.

- **Layout and grid:** horizontal/vertical alignment, grid snapping, margins, whitespace, section rhythm, and proportional balance.
- **Visual hierarchy:** reading path, headline/key-visual emphasis, grouping, density, and whether the primary content is discoverable.
- **CTA prominence:** primary actions versus secondary/tertiary controls, destructive-action warning styling, and affordance clarity.
- **Empty and edge states:** illustration quality, copy clarity, recovery prompts, and whether the state communicates what happens next.
- **Typography and brand:** type family, weight, size, line height, color, token consistency, imagery, icons, and overall visual integrity.

## 2. Frontend / UI Developer

Focus on implementation accuracy, state transitions, layout fluidity, and asset quality.

- **Responsive breakpoints:** container reflow, layout stability, clipping, horizontal overflow, and desktop/tablet/mobile transitions.
- **Interactive states:** hover, active/pressed, disabled, cursor treatment, focus presentation, selected states, and transition feedback.
- **Loading visuals:** skeleton/shimmer behavior, reserved space, and cumulative layout shift during fetches.
- **Asset and text rendering:** SVG/vector crispness, high-DPI behavior, image crop/quality, long strings, wrapping, truncation, and overflow.
- **Implementation fidelity:** spacing, tokens, radii, shadows, fonts, component consistency, and visible differences between source and render.

## 3. QA / Test Automation Engineer

Focus on edge behavior, viewport extremes, cross-browser consistency, and functional feedback.

- **Dynamic data extremes:** maximum text, long names, localization/internationalization wrapping, missing data, avatar fallbacks, and zero/one/many-item states.
- **Notification layering:** toast alerts, modals, drawers, sticky banners, popovers, and viewport-boundary behavior; ensure key actions remain visible.
- **Mobile touch ergonomics:** interactive targets should be at least `48 x 48px` on mobile, with adequate spacing and no accidental overlap.
- **Cross-platform consistency:** font smoothing, borders, shadows, form controls, and browser-engine differences across macOS, Windows, iOS, and Android where evidence is available.
- **Reproduction quality:** record the viewport, state, sequence, and data needed to reproduce each issue.

## 4. Accessibility Lead / Specialist

Focus on WCAG compliance, readability, color usage, and keyboard navigation.

- **Contrast:** text/background at least `4.5:1` for standard text, `3:1` for large text, and `3:1` for meaningful interactive control boundaries where applicable.
- **Color independence:** errors, badges, statuses, selections, and charts must not rely on color alone.
- **Keyboard and focus:** every interactive element is reachable in a sensible order and has a clear, high-contrast focus indicator.
- **Theme contrast:** light/dark themes preserve legibility, semantic colors, focus visibility, and appropriate image/graphic treatment.
- **Readable presentation:** text scale, wrapping, line length, motion/feedback visibility, and state communication remain usable without relying on visual assumptions.

## Shared Mapping

| Category | Primary owner | Secondary / approver |
| --- | --- | --- |
| Visual hierarchy and layout | Product Designer | Frontend Developer |
| Color, contrast, and accessibility | Accessibility Specialist | QA Engineer |
| Typography and text presentation | Product Designer | Frontend Developer |
| Calls to action | Product Designer | QA Engineer |
| Interactive component states | Frontend Developer | QA Engineer |
| Responsiveness and screen adaptation | QA Engineer | Frontend Developer |

## Required Fidelity Surfaces

Every merged report explicitly checks:

1. Fonts and typography: family/fallback, weight, size, line height, wrapping, truncation, and optical hierarchy.
2. Spacing and layout rhythm: frame, crop, alignment, margins, padding, grid, gaps, radii, shadows, and vertical rhythm.
3. Colors and visual tokens: palette, gradients, opacity, semantic states, foreground/background balance, and contrast.
4. Image and asset fidelity: correctness, crop, scale, sharpness, transparency, masking, and raster/vector suitability.
5. Copy and content: visible text, labels, state messaging, capitalization, wrapping, and truncation.
