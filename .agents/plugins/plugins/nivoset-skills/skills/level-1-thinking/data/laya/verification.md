# Local verification evidence

This is evidence for the Python distribution, not a universal performance claim.

## Environment

- macOS arm64
- Python 3.14.7
- `laya==0.3.20`
- CPU device

## Passed commands

```text
.venv/bin/python -c "import laya; print(laya.__version__)"
# 0.3.20

.venv/bin/laya "I was charged twice" --model english --device cpu
# routing returned english

.venv/bin/python <direct-predict-script>
# CPU prediction returned answers and usage

LAYA_HOST=127.0.0.1 LAYA_PORT=8123 LAYA_DEVICE=cpu \
LAYA_PRELOAD=0 LAYA_MODELS=english .venv/bin/laya-serve

curl http://127.0.0.1:8123/health
# {"status":"ok","loaded":[],"device":"cpu"}

curl POST http://127.0.0.1:8123/v1/systemone
# returned answers, usage, and routing metadata
```

The first prediction downloaded the English checkpoint. The loader emitted an invalid/out-of-range temperature warning and clamped it; confidence from that run is uncalibrated.
