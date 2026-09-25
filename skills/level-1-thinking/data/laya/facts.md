# Laya facts and sources

Checked against the documented source/model pairing. Do not substitute another repository or model that happens to use the Laya name. Re-check before relying on mutable `main` or an unpinned model hub revision.

- Runtime source: https://github.com/NandhaKishorM/laya
- Model repository: https://huggingface.co/convaiinnovations/laya
- Package: https://pypi.org/project/laya/
- Docker guide: https://github.com/NandhaKishorM/laya/blob/main/docs/docker.md
- HTTP server source/configuration: `laya/serve.py` and the repository README.

## Checkpoints

- English: 421.3M parameters; about 842.6 MB FP16 weights; 512-token default context.
- Multilingual: 321.9M parameters; about 643.8 MB FP16 weights; 100+ languages; 1,024-token default context, with documented long-context support.
- Typed decisions: 421.3M parameters; about 842.6 MB weights; use only when its trained workflow fits the task.

The three weight files total about 2.33 GB. These are download sizes, not process memory. The loader's model parameters are generally FP32, so resident memory is higher; measure it on the target device.

A local CPU smoke test at the recorded revision emitted a warning that an exported temperature was invalid/out of range and was clamped; treat affected confidence values as uncalibrated until verified on the exact model revision.

## Supported local paths

- SDK: `laya.load(...)` or `Router(...)`.
- CLI: `laya TEXT --predict`.
- Server: `laya-serve`, `GET /health`, `POST /v1/systemone`.
- Public model downloads require network access on first use and then use the local cache.

## HTTP operational limits

The Python server implementation documents bounded requests and concurrency, including caps on question count, state size, request body size, option counts, and active inference. It can return `401` for authentication failure, `413` for oversized requests, `422` for malformed questions, and `503` when admission is full. Verify exact caps at the pinned source revision before hard-coding them.
