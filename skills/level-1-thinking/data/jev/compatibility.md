# Jev compatibility notes

Sources:

- Hosted API concepts: https://typesafe.ai/blog/introducing-system-one-models-and-jev
- Python Laya README/server: https://github.com/NandhaKishorM/laya
- HTTP implementation: `laya/serve.py` (`create_app`, `_check_auth`, `_check_request_limits`, `_resolve_model`, `health`, `systemone`)

## Shared contract

The local adapter and hosted API use a decision request composed of:

- `state`: text, JSON object, or list describing the situation;
- `questions`: named typed questions;
- typed answers such as choices, ordinal scores, and yes/no probabilities.

The Python runtime documents `POST /v1/systemone`.

## Compatibility rules

- A matching request/response shape is protocol compatibility, not behavioral equivalence.
- Run a fixed-corpus probe for `choice`, `score`, and `noul`; compare field names, ranges, rounding, confidence, errors, and truncation.
- Check exact response keys and probability semantics.
- Check authentication, timeout, retry, and health-check behavior.
- Check option-cardinality and token-budget limits.
- Check model selection and language routing; do not assume hosted routing or accuracy.
- Check calibration on the target domain. A high confidence value can still be wrong.
- Keep arithmetic, date comparisons, counting, authorization, and side effects in deterministic application code.
- Independent questions can share one call; dependent questions require a second coded call.

## Model fallback policy

The local HTTP adapter may resolve recognized local aliases and can fall back to routing for unsupported model identifiers. A hosted versioned model ID must not silently become a different local checkpoint. Test known aliases, unknown IDs, and missing model fields. Choose and document either fail-closed rejection or explicitly approved auto-routing, and record the effective model/reason.

## Error and recovery policy

Preserve and test `401` authentication failures, `413` request-limit failures, `422` malformed questions, and `503` admission-full responses. Do not retry client errors. Retry `503` only with bounded attempts, a deadline, and jitter; use an operator-visible fallback after exhaustion. Do not assume a local `Retry-After` header exists.
