# Laya/Jev boundary matrix

Use this as a minimum compatibility probe. Record expected status/result, observed result, model/revision, and decision.

| Area | Cases |
|---|---|
| Target | `in_process`, `local_http`, `hosted`; no silent fallback |
| Model | missing, `english`, `multilingual`, `typed-decisions`, published local ID, hosted/versioned ID, unknown ID |
| Auth | no key, valid bearer, wrong bearer, malformed bearer, non-ASCII header; health visibility |
| Body | malformed JSON, non-object JSON, missing `questions`, null/invalid state, invalid questions object, empty questions |
| Question types | valid `choice`, `score`, `noul`; unknown type; missing criteria/instructions; single option |
| Size | exact and over caps for body, state, question count, choice options, score levels, total options |
| Routing | short Latin, explicit language, non-Latin, mixed language, explicit checkpoint, typed workflow |
| Context | short, boundary, and over-limit state for the selected checkpoint; truncation must be rejected or recorded |
| Recovery | unavailable model/download, bad revision/digest, load failure, inference failure, concurrent admission/full `503` |
| Correctness | fixed held-out corpus; confidence/calibration; deterministic checks before side effects |

The Python server's exact caps and status mapping can change. Read the pinned `serve.py` revision before hard-coding limits.
