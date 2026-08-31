# Q2 Trial 001 — Multi-Year Reconstruction Scaling Results

**Status:** Complete controlled synthetic benchmark  
**Date:** 2026-08-31  
**Benchmark family:** Cairn Q2 multi-year reconstruction efficiency  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Research question

**Can authoritative operational state be reconstructed efficiently at multi-year scale while retaining verifiable linkage to immutable history?**

Q2 Trial 001 was preregistered before the generator, benchmark harness, synthetic scale histories, and measured CI results were created.

## Primary evidence run

- GitHub Actions run: `33422081064`
- Source commit: `162ceae1eceede6aacebcac3249d56119362ad21`
- Report artifact: `q2-trial-001-report`
- Artifact ID: `9769336059`
- Artifact ZIP digest: `sha256:aa0890bc6547378fbc94ee6b2affe0f40f22b83b87689bcdadb6c6167a98cf42`
- Report JSON SHA-256: `24f850a1a631ae60ac209829d4ca127eb780be999815ea065188239d855cd9f1`
- Workload seed: `20260831`
- Workload version: `q2t1-v1`
- Measured repetitions per strategy/policy: `5` after warm-up

The Q2 workflow self-test, complete 10K → 100K → 1M benchmark ladder, evidence upload, and application build all completed successfully.

## Reference CI hardware

These are GitHub-hosted runner measurements, not fixed production-hardware claims.

- OS/kernel: Linux `6.17.0-1022-azure`
- architecture: `x64`
- CPU: AMD EPYC 9V74 80-Core Processor
- logical CPUs exposed to job: `4`
- memory exposed to process: `16,766,414,848` bytes
- Node.js: `v22.23.2`

## Dataset scale

Each generated history spans eight synthetic years and uses the same deterministic workload semantics.

| Lifetime events | Protected event-log bytes | Generation time |
| ---: | ---: | ---: |
| 10,000 | 3,682,484 | 173.7508 ms |
| 100,000 | 36,937,739 | 893.3088 ms |
| 1,000,000 | 370,466,155 | 8,051.4294 ms |

The 1M profile therefore exercised a roughly **370 MB protected append-only event log** rather than an in-memory toy fixture.

## Correctness result

All verified non-corrupted reconstruction strategies at all required scales reproduced the deterministic expected authoritative baseline exactly.

That baseline includes:

- authoritative state values;
- unresolved commitments;
- terminal revision/supersession heads;
- latest continuity-handoff state;
- terminal protected-history anchor/hash.

No verified accelerated reconstruction returned a divergent authoritative baseline.

## Full verified replay baseline

| Lifetime events | P50 | P95 | Unverified P50 | Verification overhead ratio |
| ---: | ---: | ---: | ---: | ---: |
| 10,000 | 73.896 ms | 81.602 ms | 22.034 ms | 3.3537× |
| 100,000 | 648.522 ms | 658.193 ms | 191.378 ms | 3.3887× |
| 1,000,000 | 6,428.724 ms | 6,486.086 ms | 1,821.778 ms | 3.5288× |

Full verified replay scales approximately with total history size, as expected. This is the full-audit/reference baseline rather than the desired ordinary resume path.

The verification cost is material and is not hidden: protected hash-chain verification made full replay roughly 3.35×–3.53× slower than the unverified performance control on this runner.

## Verified checkpoint + incremental replay

### 1% checkpoint-age policy

| Lifetime events | Tail events replayed | Replay fraction | P50 | P95 | Speedup vs full verified replay |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10,000 | 100 | 1.00% | 3.258 ms | 5.404 ms | 22.6814× |
| 100,000 | 1,000 | 1.00% | 9.431 ms | 14.147 ms | 68.7649× |
| 1,000,000 | 10,000 | 1.00% | 69.204 ms | 75.383 ms | 92.8953× |

At 1M events, ordinary checkpoint recovery did **not** replay 1M events. It loaded the verified checkpoint directly and verified/replayed the 10,000-event tail.

### 5% checkpoint-age policy

| Lifetime events | Tail events replayed | Replay fraction | P50 | Speedup vs full |
| ---: | ---: | ---: | ---: | ---: |
| 10,000 | 500 | 5.00% | 5.789 ms | 12.7649× |
| 100,000 | 5,000 | 5.00% | 34.788 ms | 18.6421× |
| 1,000,000 | 50,000 | 5.00% | 328.229 ms | 19.5861× |

### 10% checkpoint-age policy

| Lifetime events | Tail events replayed | Replay fraction | P50 | Speedup vs full |
| ---: | ---: | ---: | ---: | ---: |
| 10,000 | 1,000 | 10.00% | 9.621 ms | 7.6807× |
| 100,000 | 10,000 | 10.00% | 66.993 ms | 9.6804× |
| 1,000,000 | 100,000 | 10.00% | 644.809 ms | 9.9700× |

The event-work results are the central Q2 finding: checkpoint reconstruction work tracks the age of the selected valid checkpoint rather than forcing replay from origin.

## Verified dependency-aware reconstruction

Strategy C uses integrity-protected dependency-segment metadata to skip post-checkpoint telemetry and non-authoritative derived summaries that cannot change the authoritative baseline. Selected event bodies are individually hash-checked before application.

This is an ordinary selective-recovery path, not a claim that skipped event bodies received a full historical audit during that resume.

### 1% checkpoint-age policy

| Lifetime events | Relevant events applied | Fraction of lifetime | P50 | P95 | Speedup vs full verified replay |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10,000 | 3 | 0.0300% | 3.759 ms | 3.890 ms | 19.6584× |
| 100,000 | 23 | 0.0230% | 5.075 ms | 5.606 ms | 127.7876× |
| 1,000,000 | 232 | 0.0232% | 17.638 ms | 18.025 ms | 364.4815× |

At 1M events, dependency-aware reconstruction applied **232 relevant tail events** rather than 10,000 tail events or 1,000,000 lifetime events while still reproducing the complete expected authoritative baseline.

### 5% and 10% policies at 1M

| Policy | Relevant events applied | P50 | P95 | Speedup vs full |
| --- | ---: | ---: | ---: | ---: |
| 5% | 1,146 | 61.872 ms | 65.191 ms | 103.9036× |
| 10% | 2,293 | 108.232 ms | 109.633 ms | 59.3976× |

Strategy C never applied more events than Strategy B for the same checkpoint policy.

## Integrity / corruption probes

The preregistered corruption probes were executed on the 10K required profile after the same self-test logic had already validated them on a smaller disposable dataset.

### Latest checkpoint corruption

The newest persisted checkpoint was mutated without updating its recorded integrity digest.

Result:

- corruption detected: **yes**;
- corrupted checkpoint rejected: **yes**;
- fallback: previous valid checkpoint;
- recovered expected authoritative baseline: **yes**.

### Dependency-index corruption

A dependency segment was altered without updating its integrity digest.

Result:

- corruption detected: **yes**;
- dependency-aware path refused corrupted segment: **yes**;
- fallback: verified checkpoint + ordinary incremental replay;
- recovered expected authoritative baseline: **yes**.

### Protected-history mutation

A protected event-log copy was deliberately mutated.

Result:

- mutation detected: **yes**;
- detection point: event `seq 1` hash mismatch;
- falsely verified state returned: **no**.

**Silent false-verification count: `0`.**

## Storage overhead

| Lifetime events | Checkpoint bytes | Dependency bytes | Manifest bytes | Added metadata/storage overhead vs event log |
| ---: | ---: | ---: | ---: | ---: |
| 10,000 | 899,905 | 41,190 | 43,437 | 26.7355% |
| 100,000 | 1,402,942 | 414,705 | 47,561 | 5.0496% |
| 1,000,000 | 2,975,387 | 4,189,348 | 85,734 | 1.9571% |

The small 10K fixture has high percentage overhead because checkpoint snapshots and fixed metadata are large relative to a short history. The overhead percentage falls materially as protected lifetime history grows in this workload.

The 1M result still represents about 7.25 MB of checkpoint/index/manifest material on top of the 370.47 MB protected event log; the overhead is not zero.

## Pre-registered target evaluation

The CI evaluator returned:

- `bounded_work_target_supported: true`
- target-evaluation failures: `[]`

Specifically:

- every verified non-corrupted strategy matched the expected authoritative baseline;
- the 1M / 1% checkpoint strategy replayed exactly `1%` of lifetime events, satisfying the preregistered `<=1%` bound;
- dependency-aware reconstruction never applied more events than checkpoint+incremental replay;
- no corruption probe silently produced a falsely verified baseline.

**Q2 Trial 001 bounded-work hypothesis: supported for the controlled synthetic workload.**

## What this result does and does not show

### Demonstrated in this controlled benchmark

- Full verified replay cost grows with total protected history.
- A recent verified checkpoint allows ordinary reconstruction without replay from genesis.
- Checkpoint replay work is bounded by checkpoint age in events.
- Integrity-protected dependency metadata can reduce semantic event application further while preserving the same terminal authoritative baseline in this workload.
- Corrupted checkpoint and dependency metadata can be rejected with safe fallback.
- Full protected-history mutation is detected by verified replay.

### Important limitations

1. **Percentage checkpoint policies are not constant-age policies.** A 1% checkpoint age is 100 events at 10K but 10,000 events at 1M. Absolute recovery latency therefore still rises as that tail becomes larger. A future fixed-absolute checkpoint study can test constant-age scaling directly.
2. **CI hardware is not a stable benchmark machine.** The latency numbers are evidence from this runner, not production service-level objectives.
3. **Selective recovery is not a full audit.** It relies on verified checkpoint/dependency metadata for skipped non-dependent events and verifies selected event content. Full origin audit remains a separate operation.
4. **The synthetic dependency density is fixed.** Workloads with a much higher fraction of state-affecting events would reduce Strategy C's advantage.
5. **`maxRSS` is a process high-water mark.** It is not an isolated per-strategy memory benchmark.
6. **No 10M run is claimed.** The preregistration defined 10M as an extended target only.

## Architectural implication

The result supports the distinction Cairn needs to make between **audit cost** and **resume cost**.

Immutable append-only history does not require ordinary recovery to replay the entire immutable history. A verified checkpoint can carry an authoritative materialized baseline plus a protected history anchor; ordinary recovery can then verify/replay the tail. An integrity-protected dependency layer can further reduce semantic replay to events capable of affecting the baseline.

That acceleration does not eliminate the original history. The full event log remains available for origin-to-terminal audit and verification.

## Claim supported by Q2 Trial 001

The preregistered narrow claim is supported for this controlled synthetic benchmark:

> **In controlled synthetic multi-year histories, ordinary verified recovery can reconstruct the same authoritative operational baseline as full replay while bounding replay work by checkpoint age and dependency scope rather than total lifetime history.**

This result does not establish arbitrary production-scale performance or eliminate the need for full historical audits.

## Initialization boundary

Q2 Trial 001 did not initialize Cairn or create authoritative Cairn identity, memory, history, commitments, checkpoints, provenance state, genesis data, Commit Gate state, or inference-runtime state.

All generated histories and benchmark artifacts are synthetic and disposable.
