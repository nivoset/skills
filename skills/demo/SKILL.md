---
name: demo
description: Use when a code change or ticket needs a deterministic browser demonstration with a readable journey script, video evidence, and traceable artifacts.
disable-model-invocation: false
user-invocable: true
---
# Demo

`bin/demo` plans, reviews, records, and composes a deterministic browser demonstration. Use a supplied reachable HTTP(S) URL as-is; do not restart or clean up a service you did not start. If a target must be started, inspect the current branch's config, scripts, and docs. When subagents are available and useful, delegate one focused discovery pass; otherwise inspect as a reasonable developer. Try deployment options in this order, advancing immediately when an option is unavailable or fails: documented Docker setup, documented Podman setup, then build the app and run its documented `pnpm start` workflow. Never invent a startup command; if all options fail, report what was tried and the blocker. Derive the browser URL from the actual port mapping or verified startup output, use a free host port and run-unique resource prefix, and do not publish artifacts externally.

Only clean up resources and large files created by this run. Keep temporary large files (for example, frames, intermediate videos, logs, and build output) under `/tmp` and remove them after use; retain only requested demo deliverables in the ignored `.tmp/demo/` output directory. For a service started by this run, record its engine/provider, prefix, port mapping, and resource identifiers, then stop and remove only its containers, networks, volumes, run-built images, and orphans on success or failure. Check the selected Compose provider's naming before cleanup. Never remove shared or pre-existing resources. `bin/demo` does not manage container teardown; report remaining identifiers and errors if manual cleanup fails.

## Run without approval gates
1. Choose a short journey and write its exact routes, actions, selectors, target URLs/commands, annotations, and holds in the recipe. Do not ask for approval of each requirement or shot. Use `current-behavior` unless the user specifically wants a before/after comparison.
2. Run `skills/demo/bin/demo validate --recipe FILE`, then `skills/demo/bin/demo run --recipe FILE [--run-id ID]`. Validation protects executable inputs and artifact paths; it is not an operator sign-off.
3. Show the operator the readable `review/script.json` path printed by the command, or show its contents when they ask to inspect the script. `skills/demo/bin/demo review --recipe FILE --run-id ID` is optional and may be used to preview the script and storyboard without recording. Do not wait for approval unless the operator explicitly asks to review before capture.
4. Report the MP4, contact-sheet, script, and manifest paths that exist. Invite a single round of journey or pacing revisions if needed; do not turn every step into a question.

The runnable recipe is the script of record. A generated feature storyboard is a summary, not a substitute for showing the exact commands, URLs, actions, selectors, and durations. If the script changes, record from the current recipe; never silently reuse an older preview as the authority for the run.

## Before/after capture
Use `comparison.status: "before-after"` only when comparing two states, with explicit `targets.before` and `targets.after`; never infer commands or revisions. URL targets are supported. Command targets are not launched for before/after capture: start each target yourself and provide its URL. For a single journey, use `current-behavior`; its command target must be an argv string array and is launched without a shell. Choose only the steps the user needs to see rather than expanding every ticket item into a separate shot.

For before/after, pair each selected step with one before and one after shot with the same action and target. The script and optional storyboard show both targets, routes, selectors, annotations, and holds. For an omitted URL, follow supplied startup instructions or repository evidence and determine the URL from the actual host port mapping instead of asking the user. Recording uses a fresh browser context per shot. Shot evidence is linked to the selected requirement; do not claim to have demonstrated unrelated behavior.

**Frame the whole page in every recording.** Include the full document, including content below the initial viewport, not just a focus-selector crop or the first screen. Fit tall pages within the final video while preserving their aspect ratio; letterbox if needed instead of cutting off content. Keep the full-page framing after interactions that change page height. The focus selector identifies the action, not the video crop. Avoid push-in zoom that cuts off page edges. Composition uses hard cuts and produces H.264 MP4 plus a contact sheet when enabled. Labels are rendered in browser/CSS or supplied as PNG; never use `drawtext`, subtitles, or libfreetype.

## Pacing and watchability

`durationMs` is a wall-clock hold for each recorded shot, not virtual application time. Use a real wait after the action; a virtual clock advance alone does not extend the video. Check the final video and contact sheet for visible content and sensible pacing before sharing them. If an action fails or a page is blank, report the failure and the script path; do not call the recording a successful demo. These checks happen after capture and do not require sign-off for each item.

## Environment and reference
Run `skills/demo/bin/demo doctor` when capture dependencies are missing; it checks Playwright, ffmpeg filters, and H.264 encoder availability. Install dependencies in the demo project's own environment, not the persistent IPython kernel. The deployment and cleanup order is defined above. Use `references/prime-playwright.py` as a synchronous API example; it demonstrates video saving, clock control, mouse movement, bounding boxes, and array-based subprocess calls. Avoid async nested-loop workarounds and fictional `page.screencast` APIs.

Navigation and URL assertions accept only HTTP(S) or relative paths; active-content schemes are rejected. Outputs are realpath-contained beneath ignored `.tmp/demo/`, and ffmpeg paths reject protocol-like colon inputs. Failures use stable exit codes. Captions and highlights are presentation aids, not proof.
