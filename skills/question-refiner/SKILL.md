---
name: question-refiner
description: Use when a research or feedback request is broad, vague, hard to answer, or needs a reusable question format, especially when the right user perspective is unclear.
---

# Question Refiner

Turn a broad request into a focused, easy-to-answer question without silently assuming the answer. Questions should invite useful detail and feedback, not force the respondent to guess what level or perspective is wanted.

## When to Use

Use for exploratory research, asking someone to explain a feature or process, gathering feedback, or refining a prompt that could produce generic answers. Use the specialized functionality-tracing skill when the request is specifically about tracing or checking how an app feature works.

## Question Recipe

Write one clear main question, then add only the prompts needed to make its answer useful:

1. **Perspective:** Use the role or point of view supplied by the requester or established by evidence. If none is clear or needed, say **“from a basic user’s perspective.”** Do not invent specialized roles.
2. **Focus:** Name one feature, task, decision, or bounded topic. Replace “the app” or “everything” with a concrete subject whenever possible.
3. **Request:** State what kind of answer is useful—an explanation, walkthrough, comparison, feedback, or evidence.
4. **Useful detail:** Ask for examples, context, visible outcomes, or definitions only when they help answer the main question.
5. **Uncertainty:** Invite the respondent to flag unclear, unknown, or differing behavior rather than guess.

General form:

> From **[requested/relevant perspective; otherwise a basic user’s perspective]**, explain **[specific topic or task]**. Include **[the few details needed to answer well]**, and note anything unclear or uncertain. **[Optional feedback prompt.]**

## Make It Easy to Answer

- Ask one main question at a time; use short numbered sub-prompts for distinct details.
- Prefer familiar words and define domain terms that the respondent may not know.
- Give a bounded topic and a useful answer shape; do not ask only “How does it work?” when the subject can be named.
- For feedback, separate “describe what happens” from “what do you think should change?”
- Avoid leading questions that imply a desired answer. Ask what is clear, confusing, missing, surprising, or difficult.
- Do not assume a role, workflow, feature, rule, or failure mode. Mark unknowns as questions.
- Ask for evidence when factual accuracy matters; distinguish observed behavior from interpretation and suggestions.

## Examples

**Too vague:** “How does the app work?”

**Better:** “From a basic user’s perspective, how does **[named feature]** work? Please explain the main steps and what happens, and flag anything unclear or uncertain.”

**Too broad/leading:** “Is the sharing feature easy and secure?”

**Better:** “From a basic user’s perspective, explain how sharing **[specific item]** works. What can the user see or control, what is unclear, and what feedback would you give?”

**Too many goals:** “Explain setup, permissions, billing, and all errors.”

**Better:** Split into one question per workflow or decision, then order the questions by dependency.

## Quick Check

Before using a question, verify that it:

- names a bounded subject;
- makes the point of view explicit or falls back to a basic user;
- says what kind of answer is wanted;
- asks for concrete, answerable detail without embedding an assumed answer;
- leaves uncertainty and feedback visible.
