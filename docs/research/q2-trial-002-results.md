# Q2 Trial 002 — Fixed-Age Reconstruction Scaling Results

**Status:** Complete controlled synthetic benchmark  
**Date:** 2026-08-31  
**Benchmark family:** Cairn Q2 multi-year reconstruction efficiency  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Research question

**When checkpoint age is held constant at 10,000 events, does ordinary verified reconstruction remain approximately constant as lifetime append-only history grows by an order of magnitude?**

Q2 Trial 002 was preregistered before its benchmark implementation and before any Trial 002 measured result was produced.

Trial 001 had already shown that checkpoint recovery work could be bounded by a percentage-based checkpoint age. Trial 002 removes the main ambiguity in that result by holding the absolute recovery tail fixed at exactly **10,000 events** while lifetime history grows from **100,000** to **1,000,000** events.

## Primary evidence run

- GitHub Actions run: `33426131595`
- PR branch head used to trigger the run: `392d37ad804a780a93f912d2411055417d1e23d4`
- GitHub Actions checkout / `GITHUB_SHA`: `37630778c47b3d4eb98edd6873cb18c5c6751300`
- Evidence artifact: `q2-trial-002-fixed-age-report`
- Artifact ID: `9770832480`
- Artifact ZIP digest: `sha256:1c43ecac5bf2605873bb47ac9bbbdeee0fc4bfbc1c2828009be8d3bcf967e07f`
- Report JSON SHA-256: `b2cbe3c20ae24b5ff2561af3eb11975b7f4e0069386517e6fc651b6a3bd78734`
- Workload seed: `20260831`
- Workload version: `q2t1-v1`
- Fixed checkpoint age: `10,000` events
- Measured repetitions per strategy: `5` after warm-up

The Trial 002 fixed-age self-test, required 100K → 1M scale ladder, evidence upload, and application build all completed successfully.

## Reference CI hardware

These measurements came from a GitHub-hosted runner and are not production service-level claims.

- OS/kernel: Linux `6.17.0-1022-azure`
- architecture: `x64`
- CPU: AMD EPYC 7763 64-Core Processor
- logical CPUs exposed to job: `4`
- memory exposed to process: `16,766,414,848` bytes
- Node.js: `v22.23.2`

## Fixed-age design

The benchmark reused the frozen Q2 Trial 001 workload semantics rather than changing the event mix after seeing Trial 001 results.

At each required scale, the benchmark selected an existing checkpoint policy whose **latest valid checkpoint** landed exactly 10,000 events behind terminal:

| Lifetime events | Fixed checkpoint sequence | Tail events | Tail fraction | Source checkpoint policy |
| ---: | ---: | ---: | ---: | --- |
| 100,000 | 90,000 | 10,000 | 10.0% | `pct-10` |
| 1,000,000 | 990,000 | 10,000 | 1.0% | `pct-1` |

The absolute recovery work therefore remained fixed while lifetime history increased 10×.

## Correctness result

Every verified non-corrupted reconstruction strategy reproduced the deterministic expected authoritative baseline exactly at both required scales.

The reconstructed baseline included the same authoritative state, unresolved commitments, required revision/supersession state, continuity handoff state, and terminal protected-history anchor as full verified replay.

No accelerated verified reconstruction returned a divergent authoritative baseline.

## Primary fixed-age result

| Lifetime events | Full verified replay P50 | Fixed-age checkpoint P50 | Dependency-aware P50 | Strategy B tail applied | Strategy C events applied |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 100,000 | 679.994 ms | 73.733 ms | 16.010 ms | 10,000 | 229 |
| 1,000,000 | 6,811.583 ms | 73.741 ms | 19.762 ms | 10,000 | 232 |

The key result is not merely that checkpoint recovery was faster. The important scaling result is that **full verified replay increased by roughly 10× while fixed-age checkpoint recovery remained effectively unchanged**.

The preregistered required-scale latency ratio was:

`P50_B(1,000,000) / P50_B(100,000) = 1.0001`

The preregistered maximum ratio was `2.0`.

**Latency-stability target: supported.**

## Full verified replay contrast

Full verified replay remained the origin-to-terminal audit/reference path and scaled with lifetime history:

- 100K full verified replay P50: `679.994 ms`
- 1M full verified replay P50: `6,811.583 ms`

That is approximately a 10× latency increase for a 10× increase in lifetime event count, which is consistent with the intended distinction between full audit cost and ordinary resume cost.

## Fixed-age checkpoint recovery

Strategy B verified and applied exactly the same 10,000-event tail at both required scales:

- 100K lifetime: `10,000 / 100,000` events = `10%`
- 1M lifetime: `10,000 / 1,000,000` events = `1%`

P50 verified recovery latency was:

- 100K: `73.733 ms`
- 1M: `73.741 ms`

Speedup relative to full verified replay was:

- 100K: `9.2224×`
- 1M: `92.3717×`

The increasing speedup is expected because full replay grows with lifetime history while the ordinary recovery tail remains fixed.

## Dependency-aware recovery

Strategy C used the same fixed-age checkpoint and applied only tail events capable of changing the authoritative baseline or unresolved commitments.

- 100K lifetime: `229` events applied, P50 `16.010 ms`, `42.4731×` speedup vs full verified replay
- 1M lifetime: `232` events applied, P50 `19.762 ms`, `344.6809×` speedup vs full verified replay

Strategy C applied no more events than Strategy B at either required scale and reproduced the same authoritative baseline.

The small difference from 229 to 232 relevant events reflects the deterministic event composition within the two different 10,000-event terminal windows; the semantic work remained tiny relative to total lifetime history.

## Hidden-work accounting

Trial 002 explicitly checked that fixed event application was not hiding a full-history verification pass during ordinary resume.

For Strategy B:

- pre-checkpoint event-body reads by the reconstruction algorithm: `0` at both required scales;
- 100K event stream opened at byte offset `33,242,470`, skipping the pre-checkpoint 90% of the protected log;
- 1M event stream opened at byte offset `366,760,054`, skipping the pre-checkpoint 99% of the protected log.

Checkpoint and dataset-manifest metadata were still read and verified. The benchmark reports those metadata byte counts separately rather than pretending recovery has zero fixed overhead.

This accounting is algorithm/file-level evidence, not kernel block-I/O or cache telemetry.

## Corruption / fallback result

The controlled corruption probes were executed on the 100K required profile.

### Latest checkpoint corruption

- corruption detected: **yes**
- corrupted checkpoint rejected: **yes**
- fallback: previous valid checkpoint
- expected authoritative baseline recovered: **yes**

### Dependency-index corruption

- corruption detected: **yes**
- dependency-aware path rejected corrupted segment: **yes**
- fallback: checkpoint + ordinary incremental recovery
- expected authoritative baseline recovered: **yes**

### Protected-history mutation

- mutation detected: **yes**
- detection point: event `seq 1` hash mismatch
- falsely verified state returned: **no**

**Silent false-verification count: `0`.**

## Storage overhead

The acceleration metadata remains non-zero and is retained in the evidence rather than hidden:

| Lifetime events | Protected event log | Added checkpoint/index/manifest overhead |
| ---: | ---: | ---: |
| 100,000 | 36,937,739 bytes | 5.0496% |
| 1,000,000 | 370,466,155 bytes | 1.9571% |

The percentage falls as lifetime history grows in this synthetic workload.

## Pre-registered target evaluation

The report evaluator returned:

- `fixed_work_supported: true`
- fixed-work failures: `[]`
- `integrity_supported: true`
- integrity failures: `[]`
- required-scale checkpoint P50 latency ratio: `1.0001`
- latency-stability maximum ratio: `2.0`
- `latency_stability_supported: true`
- `overall_supported: true`

**Q2 Trial 002 fixed-age hypothesis: supported for the controlled synthetic workload.**

## What Trial 002 adds beyond Trial 001

Trial 001 established that a recent verified checkpoint could bound ordinary recovery work by checkpoint age rather than requiring replay from origin. Its checkpoint policies were percentage-based, so the absolute tail still grew as lifetime history grew.

Trial 002 holds the absolute tail constant.

The required-scale result therefore supports a stronger and cleaner systems interpretation for this workload:

- full audit cost continues to grow with lifetime protected history;
- ordinary checkpoint resume work can remain fixed when checkpoint age is fixed;
- ordinary checkpoint latency remained essentially flat from 100K to 1M lifetime events on this CI run;
- dependency-aware semantic application remained limited to a few hundred relevant tail events;
- integrity failures were detected with safe fallback and zero silent false verification.

## Important limitations

1. **Controlled synthetic workload.** The workload is deterministic and deliberately constructed for reproducible systems testing. It does not represent every production event distribution.
2. **CI hardware is not a stable benchmark machine.** The latency values are evidence from this GitHub-hosted runner, not service-level objectives.
3. **10M is not claimed.** The preregistration retains 10M as an optional extended target, but the frozen Trial 001 percentage-policy fixture does not provide an exact 10,000-event-old latest checkpoint at 10M without adding a new fixed-age checkpoint-generation path.
4. **Selective recovery is not a full historical audit.** It verifies acceleration metadata and selected event content under the frozen Q2 rules; origin-to-terminal audit remains a separate operation.
5. **Metadata accounting is not kernel I/O telemetry.** The benchmark records algorithm/file-level reads and offsets, not physical disk/cache behavior.
6. **Dependency density is workload-specific.** A workload with a much larger fraction of state-affecting events would reduce Strategy C's semantic-work advantage.

## Claim supported by Q2 Trial 002

The preregistered narrow claim is supported for this controlled synthetic benchmark:

> **In the controlled synthetic Q2 workload, when verified checkpoint age is held fixed at 10,000 events, ordinary recovery work remains bounded by that fixed tail rather than lifetime history, and required-scale recovery latency remains approximately stable while full-audit cost continues to grow with total protected history.**

This does not establish arbitrary production-scale performance, universal workload independence, or eliminate the need for full historical audit.

## Initialization boundary

Q2 Trial 002 did not initialize Cairn or create authoritative Cairn identity, memory, history, commitments, production checkpoints, provenance state, genesis data, Commit Gate state, or inference-runtime state.

All generated histories and benchmark artifacts remain synthetic and disposable.
