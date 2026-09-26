# Performance and scaling overlay

Use when latency, throughput, data volume, concurrency, cost, or growth limits matter. The central artifact is a performance budget and capacity model: workload, measurable targets, baseline, test method, production signal, and rollback threshold.

A performance claim is unverified unless it identifies the metric and percentile, load shape, data size, environment, version, run count, and variance.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `workload-modeler` | Prevents scale planning against invented or average-only traffic. | A scale goal has no numbers or authoritative source. | Traffic mix, peaks, growth, data volume, skew, and hot-resource evidence. | Target workload is unknown. |
| `performance-target-steward` | Converts user expectations into measurable, owned criteria. | A goal lacks metric, percentile, threshold, load, or environment. | Proposed evaluation criteria linking user perception, system metric, and cost ceiling. | No named authority accepts the target. |
| `baseline-profiler` | Prevents optimization claims that are irreproducible or smaller than measurement noise. | A bottleneck claim lacks reproducible measurement. | Baseline/profile with version, environment, data, warm-up, run count, and variance. | Measurement noise exceeds the claimed effect. |
| `bottleneck-analyst` | Uses evidence to separate competing causes rather than optimizing by intuition. | The baseline misses a target or competing causes remain live. | Profiles, query plans, saturation metrics, and challenged hypotheses. | Evidence cannot separate leading causes. |
| `capacity-planner` | Shows when growth, quotas, or cost exhaust available headroom. | Projected load approaches measured capacity, quota, or budget. | Headroom, scaling model, outside limits, and cost curve. | Capacity or an outside limit cannot be bounded. |
| `overload-behavior-reviewer` | Defines safe degradation beyond capacity and prevents retry amplification. | Beyond-capacity behavior is undefined or retries/queues are added. | Load-shedding, rate-limit, timeout, backpressure, and degraded-mode behaviors. | Overload can cause uncontrolled failure. |
| `load-test-designer` | Turns targets into representative tests that retain correctness assertions. | A target lacks a representative check or variance rule. | Load/stress/spike/soak rows, isolation, masked data, cost cap, abort threshold, and functional assertions. | Safe representative testing is unavailable or could affect an unauthorized system. |
| `perf-regression-guard` | Keeps a one-time improvement from silently regressing. | An accepted target lacks an ongoing check. | Pipeline budget, scheduled check, production signal, and proceed/hold/rollback threshold. | Regressions cannot be detected before harm. |
| `data-scaling-reviewer` | Finds data-size and cardinality boundaries hidden by current baselines. | Data size or cardinality grows beyond the measured baseline. | Query/index evidence and boundary datasets. | A critical data path has no scale evidence. |
| `contention-reviewer` | Finds shared locks, pools, queues, or tenant resources that cap throughput. | A shared resource appears on an accepted hot path. | Saturation, fairness, and concurrency findings. | Contention cannot be bounded or reproduced. |
| `cache-correctness-reviewer` | Prevents faster reads from violating freshness or invalidation rules. | A cache is added or its lifetime/invalidation changes. | Freshness, invalidation, stampede, and fallback checks. | Cache correctness lacks an accepted invariant. |

## Role relationships

`load-test-designer` specializes performance aspects of `validation-planner`; `perf-regression-guard` specializes `observability-reviewer` and reuses `pipeline-reviewer`; `contention-reviewer` leaves correctness ownership with `consistency-reviewer`; reuse the existing `client-performance-reviewer` for client rendering and delivery costs, plus `release-reviewer` for rollout mechanics.

## Validation additions

Record metric/percentile, workload, dataset, environment, duration, threshold, variance rule, version, run count, baseline, run location, production signal, and rollback trigger. Functional assertions must hold under load. A component benchmark cannot alone prove an end-to-end target.

## Implication sweeps

Cover shared hot paths/resources, tenant size classes, steady/peak/burst/soak loads, current/projected/max data, topology, dependency states, and client classes across latency, throughput, errors, saturation, cost, correctness, and overload behavior.

## Tradeoffs

- Latency and headroom vs. cost.
- Freshness or consistency vs. throughput.
- Fairness and isolation vs. total utilization.
- Test realism vs. pipeline time, cost, privacy, and safety.
