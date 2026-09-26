---
name: deck-vette
description: Use when reviewing a presentation for factuality, grammar, narrative flow, audience fit, pacing, notes, accessibility, visual consistency, or browser reliability through narrow independent review lanes.
---
# Deck Vette

## Purpose
Apply the evidence-first review discipline of `vette` to presentation artifacts. This is an orchestrator, not a general “make it better” critic.

## Review contract
- Review is read-only. Do not edit the deck.
- Each lane answers one review question only.
- Run deterministic checks before agent review.
- Return structured findings with slide IDs, evidence, severity, confidence, and recommendation.
- Treat missing tools, sources, or renders as `blocked`, never `pass`.

## Lanes
Run independent lanes in parallel when their inputs do not depend on each other:

- factuality: claims and sources
- grammar: spelling, grammar, punctuation, consistency
- audience: business/developer comprehension
- narrative: order, setup, progression, repetition, close
- pacing: slide count, notes length, density, timing
- notes: presenter script and transitions
- accessibility: headings, contrast, readable text, keyboard flow
- visual: hierarchy, alignment, consistency, overload
- render: browser load, navigation, overflow, fonts, console errors

Never ask one lane to review another lane’s concern. Use `presentation-quality-check`, `presentation-grammar-checker`, `presentation-narrative-reviewer`, and `presentation-browser-validate` for the matching deterministic prechecks.

## Finding schema
```json
{
  "reviewer": "narrative",
  "slide_ids": ["slide-03"],
  "category": "unsupported-leap",
  "severity": "medium",
  "confidence": "high",
  "evidence": "The mechanism is asserted but not explained",
  "recommendation": "Add one plain-language bridge",
  "autofix": false
}
```

Use severities `critical|high|medium|low` and confidence `confirmed|high|likely|needs-external-research|speculative`. Include an explicit empty findings result for clean lanes.

## Lifecycle
1. Resolve artifact, audience, objective, timing, sources, and review mode.
2. Run static checks and record their exact commands and outputs.
3. Dispatch narrow lanes with stable slide IDs and read-only scope.
4. Validate each finding against the artifact or source.
5. Deduplicate by slide, category, and evidence.
6. Report findings in severity order, preserving source and reviewer attribution.
7. Obtain human approval before edits. Grammar-only edits may be marked as autofix candidates; claims, structure, tone, visuals, notes, and accessibility changes require approval.
8. Rerun static checks and browser validation after approved edits.

## Completion
A deck is `pass` only when required lanes have completed, no blocking findings remain, and final render evidence exists. Otherwise return `needs-review` or `blocked` with the owner and next action.
