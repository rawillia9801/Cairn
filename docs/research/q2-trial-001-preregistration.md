# Q2 Trial 001 — Multi-Year Reconstruction Scaling Protocol

**Status:** Pre-registered design; generator, benchmark harness, synthetic histories, and performance results not yet created  
**Date:** 2026-08-31  
**Benchmark family:** Cairn Q2 multi-year reconstruction efficiency  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Why Q2 exists

Q1 established controlled evidence that materially different cognition-engine families can reconstruct the same operational baseline, and that an explicit provider-neutral reconstruction contract can preserve minimum-sufficient provenance across selected model transitions.

Q2 tests a different architectural risk: whether an append-only continuity substrate remains operationally practical after years of accumulated history.

A history that can be reconstructed correctly but requires replaying every event from genesis for every ordinary resume is not sufficient for practical long-lived continuity.

## Research question

**Can authoritative operational state be reconstructed efficiently at multi-year scale while retaining verifiable linkage to immutable history?**

## Primary hypothesis

For deterministic synthetic multi-year histories, verified checkpoints and dependency-aware reconstruction can preserve the same authoritative state, unresolved commitments, and integrity outcome as full verified replay while making ordinary recovery cost depend primarily on checkpoint age and relevant dependency scope rather than total lifetime event count.

## Alternative / failure hypothesis

One or more of the following may occur:

- routine verified recovery remains effectively linear in total lifetime history;
- checkpoint acceleration causes state or commitment divergence;
- a corrupted checkpoint or dependency index is accepted silently;
- selective reconstruction omits evidence required for the authoritative baseline;
- checkpoint/index storage overhead grows enough to erase the operational benefit;
- integrity verification dominates reconstruction cost even when replay volume is bounded.

If these occur, the continuity architecture must be narrowed or redesigned rather than presenting multi-year reconstruction as solved.

## Initialization boundary

Everything in Q2 Trial 001 must be explicitly marked synthetic and non-authoritative.

The benchmark may create disposable generated event histories, checkpoint files, indexes, manifests, corruption fixtures, reports, and temporary derived state only under benchmark/output paths.

It must not create or mutate Cairn identity, authoritative Cairn history, memory, commitments, checkpoints, provenance state, genesis data, Commit Gate state, inference-runtime state, or `/srv/cairn` contents.

A valid Q2 benchmark workspace must be deletable without changing anything Cairn knows, remembers, or could reconstruct.

## Synthetic lifetime model

The generator will create deterministic append-only histories representing multiple logical years. Event timestamps must span at least **8 synthetic years** for the primary benchmark profiles regardless of event count.

The initial scale ladder is fixed at:

1. `10,000` events;
2. `100,000` events;
3. `1,000,000` events.

A `10,000,000` event profile is an **extended scale target**, not a required CI gate. It may be executed only where hardware/time permit and must use the same generator semantics and benchmark rules.

Large generated histories must not be committed to Git. The repository should contain the deterministic generator, workload specification, and hashes/metadata required to reproduce them.

## Workload composition

The synthetic history must include a stable mixture of:

- authoritative state assertions and updates;
- corrections/supersessions that append rather than rewrite;
- commitment creation and completion events, leaving a deterministic unresolved set at the end;
- provenance/supporting events that are relevant to selected authoritative state;
- host/model transition markers;
- non-authoritative derived summaries;
- high-volume telemetry/noise events unrelated to the final authoritative baseline.

The workload must be deterministic from a recorded seed.

The event mix must not be altered after benchmark results are observed for the purpose of improving scaling results.

## Protected history format

Each generated event must have:

- deterministic event identifier;
- synthetic timestamp;
- event type;
- payload;
- source/actor metadata where applicable;
- predecessor hash or equivalent ordered-chain anchor;
- event hash computed from canonical event content.

History verification must detect deliberate mutation of protected event content or ordering in corruption probes.

## Authoritative baseline

The generator must produce deterministic expected terminal state containing at least:

- all authoritative state keys and values;
- all unresolved commitment identifiers and their terminal status;
- revision/supersession relationships required to derive the terminal state;
- the final protected-history anchor/hash;
- the benchmark dataset seed and workload version.

The expected baseline must be produced independently from each reconstruction strategy so strategy output can be compared against the same fixed truth.

## Reconstruction strategies

### Strategy A — Full verified replay

Read protected history from origin to terminal event, verify event/hash ordering, and reconstruct the authoritative baseline by applying every event.

This is the correctness/reference baseline. Linear replay is expected and is not itself considered a failure for Strategy A.

### Strategy B — Verified checkpoint + incremental tail replay

Start from the newest checkpoint whose integrity record validates, reconstruct from its persisted authoritative state, and verify/replay only protected history after the checkpoint, anchored to the checkpoint's terminal event/hash.

A routine resume is allowed to trust a checkpoint only after the checkpoint artifact itself validates against its recorded digest/integrity metadata.

This strategy is **not** a substitute for a separate full historical audit. The purpose is to test bounded ordinary recovery, not to claim that full-origin audit has zero cost.

### Strategy C — Verified checkpoint + dependency-aware replay

Start from a valid checkpoint and use a verified dependency/index artifact to identify the post-checkpoint events capable of changing the authoritative baseline or unresolved commitments. Irrelevant telemetry and derived-summary events may be skipped.

The dependency artifact must itself be integrity-protected. If it fails verification, the strategy must refuse to trust it and fall back to a valid non-selective recovery path rather than silently producing state.

Strategy C must reconstruct the same full authoritative baseline as Strategies A and B; it is not merely a query-specific subset test.

## Checkpoint policies

At minimum, benchmark:

- checkpoints every `1%` of lifetime events;
- checkpoints every `5%` of lifetime events;
- checkpoints every `10%` of lifetime events.

Because event counts differ by scale, checkpoint interval must also be reported as an absolute event count.

For each profile, ordinary recovery is measured from a terminal position deliberately offset from the most recent checkpoint so the tail is non-zero.

## Corruption / fallback cases

At least the following controlled corruption probes are required:

1. **latest-checkpoint corruption** — mutate persisted checkpoint content without updating its integrity record;
2. **dependency-index corruption** — mutate/selectively delete dependency-index content without updating its integrity record;
3. **protected-history mutation** — mutate one protected event in a full-replay corruption copy.

Expected behavior:

- corrupted latest checkpoint is rejected and recovery falls back to the previous valid checkpoint or full replay;
- corrupted dependency index is rejected and selective recovery falls back to checkpoint+incremental or full replay;
- protected-history mutation is detected by verified full replay;
- no corruption probe may silently return a falsely verified authoritative baseline.

## Benchmark repetitions

Performance measurements must use repeated runs per scale/strategy/policy.

Initial CI/reference runs must use at least **5 measured repetitions** after one untimed warm-up where applicable.

Report raw run values as well as aggregate statistics. Do not report only a single best run.

## Pre-registered primary metrics

### Correctness / integrity

- authoritative-state exact match;
- unresolved-commitment exact match;
- revision/supersession exact match where represented in reconstructed state;
- terminal protected-history anchor match;
- corruption detection / fallback outcome;
- silent false-verification count.

### Recovery work

- total lifetime events;
- events physically read;
- events semantically applied/replayed;
- fraction of lifetime history read;
- fraction of lifetime history applied;
- checkpoint age in events;
- dependency-selected event count.

### Performance

- cold/full reconstruction latency;
- checkpoint/incremental latency;
- dependency-aware latency;
- P50 latency;
- P95 latency;
- CPU user/system time where available;
- peak process resident set / `maxRSS` where available.

### Storage

- protected event-log bytes;
- checkpoint bytes;
- dependency-index bytes;
- integrity/manifest bytes;
- checkpoint + index + metadata storage overhead as a fraction of protected event-log bytes.

### Verification

- verified reconstruction latency;
- equivalent unverified reconstruction latency for measurement only;
- verification overhead ratio/delta;
- corruption-detection result.

An unverified path is a performance control only and must never be presented as an acceptable Cairn recovery path.

## Pre-registered engineering targets

### Non-negotiable correctness targets

Every non-corrupted verified strategy at every required scale must achieve:

- exact authoritative state match;
- exact unresolved commitment match;
- exact required revision/supersession state;
- zero unsupported authoritative state;
- zero silent integrity failures.

Any wrong verified baseline is a failed case regardless of average performance.

### Bounded-work target

At `1,000,000` events under the `1%` checkpoint policy:

- Strategy B must replay/apply no more than `1%` of lifetime events plus fixed checkpoint-loading work;
- Strategy C must apply no more events than Strategy B and should apply fewer whenever irrelevant tail events exist.

Across `10,000` → `100,000` → `1,000,000` events with the same percentage checkpoint policy, Strategy B's replay fraction should remain bounded by checkpoint age rather than increase toward full-history replay.

### Dependency-aware target

For the fixed synthetic workload, Strategy C must:

- exactly match the authoritative baseline;
- exclude irrelevant tail telemetry/derived-summary events from semantic application;
- never apply more events than Strategy B for the same valid checkpoint;
- reject a corrupted dependency index and fall back safely.

### Corruption target

All deliberate corruption probes must be detected in every required scale profile in which they are executed. There must be **zero silent false-verification outcomes**.

### Latency interpretation

No absolute millisecond success threshold is preregistered because reference hardware has not been fixed.

Instead, Q2 will report:

- raw latency distributions;
- scaling curves;
- speedup ratios relative to full verified replay;
- hardware/software profile;
- event-work reduction.

A speedup claim is secondary to correctness and must not be made if the accelerated path weakens integrity guarantees.

## Scaling interpretation

The central Q2 claim is supported only if ordinary checkpoint-based recovery demonstrates bounded replay work as lifetime history grows.

The benchmark must distinguish:

- **full audit cost**, which may remain linear in total protected history;
- **ordinary verified resume cost**, which is expected to be bounded by checkpoint age and relevant dependency scope.

These must not be conflated in results or public claims.

## Failure conditions

Q2 Trial 001 must be reported as failing or narrowing the architecture if any of the following occur:

- a verified accelerated strategy returns a different authoritative baseline from full verified replay;
- checkpoint-based ordinary recovery requires replaying effectively the full lifetime history despite a valid recent checkpoint;
- dependency-aware recovery silently omits required authoritative updates or unresolved commitments;
- corruption of checkpoint/index/history is accepted as valid;
- integrity verification requires hidden full-history replay during every ordinary checkpoint resume, eliminating bounded-work behavior;
- storage/index/checkpoint overhead becomes materially disproportionate and is not disclosed.

## Hardware / software provenance

Every measured benchmark report must record, where available:

- operating system / kernel;
- CPU model and logical CPU count;
- total memory;
- Node.js version;
- repository commit SHA;
- benchmark seed;
- workload version;
- event count;
- checkpoint policy;
- repetition count;
- benchmark start/end time.

Cloud CI measurements must be labeled as CI-runner measurements rather than treated as stable hardware benchmarks.

## Result handling

- Preserve raw benchmark JSON/CSV output before interpretation.
- Preserve negative and anomalous runs; do not silently delete them because they worsen a chart.
- Report P50/P95 and raw repetitions.
- Keep integrity failures separate from latency averages.
- If a CI runner is noisy, reruns may be added but the original result remains in the record.
- Any material protocol change after first measured results requires a separately versioned Q2 trial rather than rewriting this preregistration.

## Trial completion criterion

Q2 Trial 001 is technically complete when:

1. this preregistration predates the generator/harness implementation and measured scale results;
2. deterministic synthetic histories can be reproduced from committed workload semantics and seed;
3. the required `10K`, `100K`, and `1M` profiles have been executed;
4. all three recovery strategies have been measured with repeated runs;
5. correctness and corruption probes have been evaluated;
6. hardware/software provenance and storage overhead are recorded;
7. a reproducible results artifact is retained;
8. the result explicitly states whether the bounded-work hypothesis was supported, partially supported, or not supported.

The `10M` profile is an extended target and is not required for technical completion.

## Claim discipline

A successful Q2 Trial 001 would support a narrow systems claim:

> **In controlled synthetic multi-year histories, ordinary verified recovery can reconstruct the same authoritative operational baseline as full replay while bounding replay work by checkpoint age and dependency scope rather than total lifetime history.**

It would not prove arbitrary production-scale performance, eliminate the need for full historical audits, or establish that every future workload has the same dependency density.
