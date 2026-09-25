# Local evidence

## Tooling blocker

`blackboard_plan` is not installed in the agent environment (`importlib.util.find_spec("blackboard_plan")` returned `None`). The board used deterministic fallback and retained propose-only roles.

## SDK verification

Command:

```text
.tmp/laya-verify/bin/python -c 'import laya; print(laya.__version__)'
.tmp/laya-verify/bin/laya 'I was charged twice' --model english --device cpu
```

Result: passed. Version `0.3.20`; routing returned `english` with explicit model reason.

Full prediction command used a temporary script and returned a CPU answer after downloading the English checkpoint. It emitted a warning that an exported temperature was invalid/out of range and was clamped; affected confidence must be treated as uncalibrated.

## HTTP verification

Installed `laya[serve]`, started `laya-serve` on `127.0.0.1:8123` with CPU, lazy loading, and English model selection.

- `GET /health`: passed, `{"status":"ok","loaded":[],"device":"cpu"}`.
- `POST /v1/systemone`: passed; returned an answer, usage, and routing metadata.
- Server stopped after verification.
