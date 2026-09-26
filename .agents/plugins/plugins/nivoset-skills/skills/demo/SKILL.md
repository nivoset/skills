---
name: demo
description: Use when a code change or ticket needs a deterministic browser demonstration with an operator-reviewed journey, video evidence, and traceable artifacts.
disable-model-invocation: false
user-invocable: true
---
# Demo

`bin/demo` plans, reviews, records, and composes a deterministic browser demonstration. When the user has not supplied a target URL or startup instructions, inspect the repository's Dockerfile, Compose files, scripts, and project documentation, then deploy the current branch locally with Docker. Do not ask the user for the URL or how to start the app when the repository provides enough information to determine them. Use a unique Compose project/resource prefix for the run and an available custom host port so the demo does not collide with other services. Derive the browser URL from the app's configured port and the selected host port. Do not publish artifacts externally.

Keep the Docker deployment available only for the demo run. On every completion or failure path, stop and remove the run's containers and network, remove its orphaned containers and volumes, and remove images built specifically for that run. Scope cleanup to resources bearing the run's unique project/resource prefix; never remove shared or pre-existing Docker resources. Confirm cleanup in the run manifest or final report. If cleanup fails, report the remaining resource identifiers and error.

## Approval-gated workflow
1. Plan the route/action, focus selector, framing, duration, annotation, and before/after sequence in the recipe.
2. Validate: `skills/demo/bin/demo validate --recipe FILE`.
3. Generate review: `skills/demo/bin/demo review --recipe FILE --run-id ID`.
4. Inspect the complete storyboard in `.tmp/demo/ID/review/demo.feature.review`.
5. Obtain explicit operator approval: `skills/demo/bin/demo approve --run-id ID --reviewer NAME`.
6. Only after approval, record and compose: `skills/demo/bin/demo run --recipe FILE --run-id ID`.
7. Report MP4, contact-sheet, and manifest paths, then ask whether the operator wants shot, pacing, zoom, annotation, or framing revisions.

No frozen recipe, target startup, browser, video, screenshot, or capture artifact is written before approval. Review metadata records the canonical recipe hash, and approval binds the run ID, exact feature hash, and full recipe hash. A changed target, viewport, scroll, composition setting, or command requires a new review.

## Before/after capture
Use `comparison.status: "before-after"` with explicit `targets.before` and `targets.after`; never infer commands or revisions. URL targets are supported. Command targets fail closed in the current runtime: start each target yourself and provide its URL. Existing `current-behavior` recipes remain supported; commands must be an argv string array, are shown verbatim in the review artifact, and are launched without a shell.

Each approved shot declares `requirementId`, `stepId`, `phase`, `route`, `action`, `focusSelector`, `framing`, `durationMs`, persistent `annotation`, fixed `scroll`, and `zoom`. Every requirement step must map to exactly two recorded shots (one `before`, one `after`), so each scenario compares the same interaction across states; review fails closed when IDs, phases, actions, routes, or click selectors diverge. The review storyboard exposes both comparison targets, including URL, health URL, and command argv when present. For an omitted URL, determine the URL from the Docker port mapping instead of asking the user. Recording uses a fresh browser context per shot so every WebM is finalized independently. Shot evidence carries its requirement ID, and a run cannot report success unless every requirement has passing evidence. Framing is a padded 16:9 crop calculated from the union of preflight before/after Playwright bounding boxes; viewport, scroll, and crop stay fixed across the hard cut despite text-size or layout differences.

Composition defaults to hard cuts. An animated `push-in` uses `zoompan` only when explicitly requested. ffmpeg is invoked as an argument array after numeric/path validation and uses broadly available `crop`, `scale`, `overlay`, `tpad`, `concat`, and optional `zoompan` filters—never `drawtext`, subtitles, or libfreetype. Labels are rendered in browser/CSS or supplied as PNG. Enabled composition produces H.264 MP4 plus a contact sheet.

## Real-time pacing and watchability

`durationMs` is a wall-clock hold for the rendered shot. It is not virtual application time. Do not use `page.clock.fastForward()` as the only pause during video capture: virtual clock advancement does not make the recorded media longer. After the page settles, use a real wall-clock wait such as `page.waitForTimeout(durationMs)`.

After every navigation or click, wait for the expected URL and visible destination content before starting the hold. A click shot must not be considered captured while the source page is still visible. Require at least 3 seconds per shot unless the operator explicitly approves a shorter duration.

Before reporting success:

- Run `ffprobe` against every WebM, MP4, or GIF output. Fail if any shot is shorter than its configured hold by more than a small tolerance, or if the composed output is shorter than the sum of its holds.
- Extract representative frames from each shot and the composed output. Fail on blank frames, missing focus content, or an unchanged source page after a navigation/click requirement.
- Inspect the contact sheet for readable labels, visible focus content, and distinct before/after states.
- For GIF output, create frames with explicit per-frame delays, use a real hold for each state, and validate the final GIF duration before reporting success.

Do not report a successful demo when only the manifest or browser action status passes. Media duration, frame content, and watchability are required evidence.

## Environment and reference
Run `skills/demo/bin/demo doctor` before capture. It reports Playwright, ffmpeg filters, and H.264 encoder availability. Playwright is not guaranteed in Prime Agent's persistent IPython kernel: check the kernel and install project-local prerequisites only when approved. For the default Docker target, inspect the existing container configuration and documentation, use the current branch, select a free custom host port, and track every run-created Docker resource under the unique run prefix for reliable teardown. Do not guess a startup command when repository evidence is available. Use the synchronous reference in `references/prime-playwright.py`; it demonstrates `record_video_dir`, `record_video_size`, `page.video.save_as` after `context.close`, `page.clock`, stepped mouse movement, bounding boxes, and array-based `subprocess.run`. Avoid async nested-loop workarounds and fictional `page.screencast` APIs.

Navigation and URL assertions accept only HTTP(S) or relative paths; active-content schemes are rejected. Outputs are realpath-contained beneath ignored `.tmp/demo/`, and ffmpeg paths reject protocol-like colon inputs. Failures use stable exit codes. Captions and highlights are presentation aids, not proof.
