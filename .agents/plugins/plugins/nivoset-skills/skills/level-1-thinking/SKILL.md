---
name: level-1-thinking
description: Use when making or reviewing decisions about local AI decision systems, typed-decision runtimes, hosted/local boundaries, model routing, confidence, or operational risk.
---

# Level 1 thinking for AI decision systems

Use this level-1 guide when a decision system must be selected, run, integrated, or reviewed safely. The current implementation reference is:

- runtime: `NandhaKishorM/laya`;
- model: `convaiinnovations/laya`;
- package: `laya`;
- optional HTTP adapter: `laya-serve`.

Do not substitute another project that uses the Laya name. Treat wire compatibility as schema compatibility, not semantic equivalence.

## Choose an explicit target

Use one target and data boundary:

- `in_process`: Python SDK; no network inference hop.
- `local_http`: `laya-serve` on a private loopback or protected network.
- `hosted`: an explicitly configured hosted Jev endpoint.

Never silently switch targets or send state to a hosted endpoint as a fallback.

## Install and run in process

Pin the package for repeatable work:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install 'laya==0.3.20'
.venv/bin/laya --help
```

Direct checkpoint:

```python
import laya
agent = laya.load(
    "convaiinnovations/laya",
    device="cpu",
    revision="<pinned-hub-commit>",
    # expected_sha256={...},  # fail closed on digest mismatch
)
result = agent.predict(state, questions)
```

Automatic routing:

```python
from laya import Router
router = Router(device="cpu", max_loaded=1)
result = router.predict(state, questions)
```

Use `max_loaded=2` for repeated English/multilingual traffic without reloads. Preload only when the memory budget is known. Use multilingual for non-English traffic. Enable typed-decisions only for a matching workflow.

## Run the local HTTP adapter

```bash
.venv/bin/python -m pip install 'laya[serve]==0.3.20'
LAYA_HOST=127.0.0.1 LAYA_PORT=8000 LAYA_DEVICE=cpu \
LAYA_PRELOAD=0 LAYA_MODELS=english .venv/bin/laya-serve
```

Call `GET /health` and `POST /v1/systemone`. The request contains `state` and named `questions`; questions use `choice`, `score`, or `noul` types.

The server defaults are unsafe for public exposure: it binds broadly when not configured and has no bearer key when `LAYA_API_KEY` is unset. Use loopback for local-only use. For network use, require an API key, TLS or a trusted proxy, an allowlist, and a deliberate health endpoint policy. Do not assume `/health` has the same auth boundary as inference.

## Required compatibility checks

Before replacing a hosted client base URL, run a fixed corpus covering `choice`, `score`, and `noul`. Compare response keys, probability meaning/ranges, confidence, routing metadata, option order, error statuses, and truncation behavior.

For model selection, test missing, known local aliases, hosted/versioned IDs, and unknown IDs. Require an explicit policy for unknown IDs: reject, or approve and record auto-routing. Always record the effective checkpoint and routing reason.

For request handling, test malformed JSON, missing or invalid fields, empty questions, invalid question types, exact size/option caps, oversized bodies, model-load failure, inference failure, and admission-full `503`. Do not retry `400`, `401`, `413`, or `422`. Use bounded attempts and a deadline with jitter for `503`, then return an operator-visible fallback.

## Capacity, security, and correctness

- Weight download size is not runtime RSS/VRAM. Measure process and device memory on the target host.
- Bound concurrency and batch size. Measure cold start, warm p50/p95, and model reloads separately.
- Pin package version, Hub commit, artifact digests, device, and environment lockfile. Fail closed on digest mismatch.
- Treat loader warnings about invalid/clamped temperatures as a reason to withhold calibrated-confidence claims until investigated and recalibrated.
- Test short, boundary, and over-limit states. Reject or record truncation; do not silently treat truncated state as complete.
- Keep arithmetic, date comparison, counting, authorization, and side effects in deterministic code.
- Questions in one call are independent. Build dependent follow-ups in a second coded call.
- Redact state, bearer tokens, model-hub tokens, and raw request/response bodies from logs. Protect cache permissions and choose retention deliberately.

See `data/laya/`, `data/jev/`, and `data/laya/verification.md` for source-backed facts, boundary matrices, and local evidence.
