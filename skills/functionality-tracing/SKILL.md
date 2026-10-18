---
name: functionality-tracing
description: Use when explaining, documenting, or checking how a web-app feature or user flow works, including its steps, required information, expected results, and common mistakes or recovery paths.
---

# Functionality Tracing

Trace one web-app feature from a user's starting point to an observable result. Produce a usable flow and check, not an unsupported summary of what the feature probably does.

## Required Sub-Skill

**REQUIRED SUB-SKILL:** Use `question-refiner` to frame the investigation questions before tracing. Apply its basic-user point-of-view fallback when the relevant role is not supplied or established by evidence. Keep the feature or flow bounded; if it is unknown, ask which one or inspect available evidence without guessing.

## When to Use

Use when someone wants to understand, explain, document, or manually check web-app functionality step by step, including what information is needed, what the user should see, common mistakes, how to detect them, and how to recover.

Do not substitute this for automated browser testing when the user explicitly requests automated execution. Do not claim to have observed a live UI, run code, or verified a behavior unless that work actually happened.

## Investigation

1. **Bound the trace.** Name the feature, goal, point of view, starting condition, and what counts as completion. Use the role provided or evidenced; otherwise use a basic user.
2. **Frame questions with `question-refiner`.** Ask how this specific flow works and what evidence can confirm each step. Include questions for prerequisites, information needed, observable results, common mistakes, detection, and recovery.
3. **Inspect available evidence.** Use the current app/UI when accessible, then relevant help text, requirements, designs, routes, source code, schemas, and tests as appropriate. Record what each source establishes. Treat user-visible behavior and implementation details as different evidence; code or tests do not by themselves prove the current UI wording.
4. **Walk the flow in order.** Capture each user action, needed information, expected or observed result, and evidence/source. Include decision points and alternate paths that materially change the result.
5. **Trace mistakes and recovery.** For each evidence-supported common mistake or failure, record the cause only when evidenced, the visible symptom, how to detect it, and the documented or verified resolution. If resolution is unknown, mark it unknown and ask; do not invent a fix. With no product evidence, do not fill the flow or error table with conventional or guessed behavior. Turn plausible failure modes into questions to investigate, not claims that those mistakes occur.
6. **Produce a checkable result.** Give a short validation checklist using observable outcomes, then list unresolved questions, source conflicts, or context/version limits.

## Output Format

### Scope
- Feature/goal:
- Point of view: supplied/evidenced role, or basic user
- Starting condition and completion outcome:
- Evidence inspected and limits:

### Step-by-step flow

| Step | User action | Information needed | Expected/observed result | Evidence |
| ---- | ----------- | ------------------ | ------------------------ | -------- |

### Common mistakes and recovery

| Mistake or failure | How to detect it | Resolution/recovery | Evidence or unknown |
| ------------------- | ----------------- | ------------------- | ------------------- |

### Check it

- [ ] Observable condition that confirms the step or flow

### Open questions

- List only unresolved details that could change the flow, expected result, or recovery. Phrase them using `question-refiner`.

## Evidence Rules

- Label behavior as **observed**, **documented**, **inferred**, or **unknown**; include source references for observed/documented claims.
- Keep verified flow and failures separate from investigation prompts. When evidence is missing, leave the relevant table cells as unknown/TBD and ask what actually happens; do not use a typical web-app pattern as a stand-in for product evidence.
- Separate actual current behavior from user feedback, expected behavior, and suggested improvements.
- Preserve discrepancies between UI, documentation, code, and tests as open questions; do not choose a source silently.
- Use exact labels and messages only when directly observed or cited from a current authoritative source.
- If an evidence source is unavailable, state the limitation and leave the claim unresolved.

## Quality Check

Before returning the trace, confirm it:

- covers the ordered path from a clear start to a verifiable outcome;
- names information and prerequisites needed by the user;
- includes common mistakes, observable detection signals, and supported recovery steps;
- distinguishes evidence from interpretation and feedback;
- marks missing or conflicting behavior instead of filling gaps with assumptions.
