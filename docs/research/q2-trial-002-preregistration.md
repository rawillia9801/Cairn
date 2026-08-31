# Q2 Trial 002 — Fixed-Age Reconstruction Scaling Protocol

**Status:** Pre-registered design; Trial 002 implementation and measured results do not yet exist  
**Date:** 2026-08-31  
**Benchmark family:** Cairn Q2 multi-year reconstruction efficiency  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Why Trial 002 exists

Q2 Trial 001 showed that ordinary verified recovery can avoid replay from genesis when a recent verified checkpoint exists. At 1,000,000 lifetime events, the 1% checkpoint policy replayed 10,000 events and reconstructed the same deterministic authoritative baseline as full verified replay. The result supported the bounded-work hypothesis for the controlled synthetic workload.

Trial 001 intentionally used percentage-based checkpoint policies. That creates one remaining ambiguity: as lifetime history grows, the absolute age of a percentage-based checkpoint also grows. A 1% checkpoint age is 1,000 events at 100,000 lifetime events but 10,000 events at 1,000,000 lifetime events.

Q2 Trial 002 isolates that variable.

Instead of keeping checkpoint age as a percentage of lifetime history, Trial 002 keeps the recovery tail fixed at **10,000 events** while lifetime history grows. The purpose is to test whether ordinary verified resume work and latency remain governed primarily by checkpoint age rather than lifetime history size.

## Research question

**When checkpoint age is held constant at 10,000 events, does ordinary verified reconstruction remain approximately constant as lifetime append-only history grows by orders of magnitude?**

## Primary hypothesis

For the deterministic synthetic Q2 workload, a valid checkpoint exactly 10,000 events behind the terminal event will allow ordinary verified reconstruction to:

- reproduce the same authoritative terminal baseline as full verified replay;
- verify and apply a fixed 10,000-event tail regardless of lifetime history size;
- avoid hidden full-history replay or verification during ordinary resume;
- exhibit approximately stable checkpoint-recovery latency as lifetime history grows from 100,000 to 1,000,000 events on the same CI runner class;
- retain safe rejection/fallback behavior for corrupted acceleration metadata.

## Alternative / failure hypothesis

One or more of the following may occur:

- checkpoint recovery work grows with total lifetime history despite fixed checkpoint age;
- checkpoint verification performs hidden work proportional to lifetime history;
- checkpoint loading or integrity metadata grows enough to make ordinary recovery latency materially increase with lifetime history;
- accelerated recovery diverges from the deterministic authoritative baseline;
- corrupted checkpoint or dependency metadata is silently accepted;
- dependency-aware recovery omits required state-affecting tail events;
- fixed-age recovery is only superficially bounded because another unreported component remains lifetime-linear.

Any such outcome must be preserved and reported rather than tuned away.

## Initialization boundary

Everything in Q2 Trial 002 must remain explicitly synthetic, disposable, and non-authoritative.

The trial may create generated event histories, checkpoints, dependency indexes, manifests, corruption fixtures, reports, and temporary derived state only under benchmark/output paths.

It must not create or mutate Cairn identity, authoritative Cairn history, memory, commitments, production checkpoints, provenance state, genesis data, Commit Gate state, inference-runtime state, or `/srv/cairn` contents.

A valid Trial 002 workspace must be deletable without changing anything Cairn knows, remembers, or could reconstruct.

## Relationship to Trial 001

Trial 002 is a separately versioned follow-up. Trial 001 results are immutable evidence and must not be rewritten.

Unless a change is explicitly required to implement fixed-age checkpoint placement, Trial 002 must retain Trial 001's:

- deterministic workload semantics;
- event format and hash-chain protection;
- authoritative-baseline definition;
- checkpoint integrity model;
- dependency-index integrity model;
- reconstruction semantics;
- corruption/fallback expectations;
- hardware/software provenance reporting;
- measurement discipline.

The workload must not be altered after Trial 002 results are observed for the purpose of improving scaling behavior.

## Fixed-age scale ladder

The fixed checkpoint age is:

`10,000 events`

The required lifetime scale ladder is:

1. `100,000` events;
2. `1,000,000` events.

The extended scale target is:

3. `10,000,000` events.

The 10M profile is not required for technical completion if GitHub-hosted runner time, storage, or memory limits make it impractical. If executed, it must use the same frozen Trial 002 rules. A failed or resource-exhausted 10M attempt must remain in the evidence record rather than disappearing.

## Fixed checkpoint placement

For each lifetime event count `N`, Trial 002 must create or select a valid checkpoint whose terminal protected event is exactly:

`N - 10,000`

The measured ordinary recovery tail must therefore contain exactly `10,000` protected events.

The checkpoint used for the primary fixed-age comparison must not move closer to the terminal event at larger scales.

If implementation also creates other checkpoints for integrity/fallback testing, those must not replace the fixed-age primary checkpoint in measured comparison results.

## Protected history and authoritative baseline

The generated history must use the same protected event model as Q2 Trial 001, including deterministic event identifiers, synthetic timestamps, event types, payloads, predecessor linkage, and event hashes.

The expected terminal baseline must remain independently derived and include at least:

- authoritative state keys and terminal values;
- unresolved commitments and terminal status;
- revision/supersession relationships required by the baseline;
- latest continuity-handoff state where represented;
- terminal protected-history anchor/hash;
- workload seed and version.

Every non-corrupted verified strategy must reproduce this baseline exactly.

## Reconstruction strategies

### Strategy A — Full verified replay

Read and verify protected history from origin through terminal event and reconstruct the complete authoritative baseline.

This remains the full-audit/reference path and is expected to grow with lifetime history.

### Strategy B — Fixed-age verified checkpoint recovery

Load the valid checkpoint exactly 10,000 events behind terminal, validate the checkpoint artifact and integrity metadata, and verify/replay only the 10,000-event protected tail anchored to the checkpoint's terminal event/hash.

The ordinary resume path must not read or hash the pre-checkpoint event bodies merely to prove that the checkpoint is valid. Full origin audit remains a separate operation.

### Strategy C — Fixed-age verified dependency-aware recovery

Start from the same fixed-age valid checkpoint and use integrity-protected dependency metadata to identify tail events capable of changing authoritative state or unresolved commitments.

Irrelevant telemetry and non-authoritative derived summaries may be skipped from semantic application. Selected event content must still be integrity-checked according to the frozen Q2 reconstruction rules.

If dependency metadata fails verification, Strategy C must reject it and fall back to a valid non-selective recovery path rather than silently returning state.

## Benchmark repetitions

Each required scale and strategy must use:

- one untimed warm-up where applicable;
- at least `5` measured repetitions.

Raw repetitions must be retained in the report together with P50 and P95 latency.

A single best run is not sufficient evidence.

## Pre-registered primary metrics

### Correctness and integrity

- authoritative-state exact match;
- unresolved-commitment exact match;
- required revision/supersession exact match;
- terminal protected-history anchor match;
- corruption detection/fallback outcome;
- silent false-verification count.

### Recovery work

- total lifetime events;
- fixed checkpoint age in events;
- events physically read during ordinary recovery;
- events semantically applied during ordinary recovery;
- fraction of lifetime history read;
- fraction of lifetime history applied;
- dependency-selected event count.

### Performance

- full verified replay P50/P95;
- fixed-age checkpoint verified P50/P95;
- fixed-age dependency-aware verified P50/P95;
- equivalent unverified measurement controls;
- verification-overhead ratios;
- speedup relative to full verified replay;
- CPU user/system time where available;
- process `maxRSS` where available.

### Storage

- protected event-log bytes;
- checkpoint bytes;
- dependency-index bytes;
- manifest/integrity bytes;
- total acceleration-metadata overhead as a fraction of event-log bytes.

### Provenance

Each measured report must preserve the runner/software profile, repository commit SHA, workload seed/version, event count, fixed checkpoint age, repetition count, and benchmark start/end timestamps.

## Pre-registered engineering targets

### 1. Non-negotiable correctness target

Every non-corrupted verified Strategy B and Strategy C result at every required scale must exactly match Strategy A's deterministic authoritative baseline.

Any wrong verified baseline is a failed case regardless of performance.

There must be:

- zero unsupported authoritative state;
- zero silent integrity failures.

### 2. Fixed-work target

At both `100,000` and `1,000,000` lifetime events, Strategy B must:

- recover from a checkpoint age of exactly `10,000` events;
- verify/replay no more than the fixed 10,000-event tail plus fixed checkpoint-loading/integrity work;
- not perform hidden pre-checkpoint event-body replay or hashing as part of ordinary resume.

The primary event-work quantity must therefore remain constant in absolute event count while its fraction of lifetime history falls from `10%` at 100K to `1%` at 1M.

If the optional 10M profile is executed, the same Strategy B event-work target applies, making the tail `0.1%` of lifetime history.

### 3. Dependency-aware target

At every executed scale, Strategy C must:

- exactly match the authoritative baseline;
- apply no more tail events than Strategy B;
- exclude irrelevant tail telemetry/derived-summary events from semantic application when such events exist;
- reject corrupted dependency metadata and fall back safely.

### 4. Latency-stability target

The latency target is evaluated within the same primary CI evidence run, using P50 verified Strategy B latency.

For the required scale ladder:

`P50_B(1,000,000) / P50_B(100,000) <= 2.0`

This deliberately permits substantial runner noise and checkpoint-size effects while rejecting behavior that looks meaningfully lifetime-linear despite a fixed tail.

If the optional 10M profile is executed, its fixed-age Strategy B P50 is reported and interpreted, but it is an extended-scale result rather than a required completion gate. No post-hoc threshold may be invented after seeing it.

The latency-stability target is secondary to correctness and fixed event-work. Passing latency cannot rescue a correctness or integrity failure.

### 5. Full-replay contrast target

Strategy A is expected to increase materially with lifetime history. Trial 002 must report the full verified replay scaling contrast so the evidence distinguishes:

- full audit cost, which may remain lifetime-linear;
- ordinary fixed-age resume cost, which should be bounded by checkpoint age.

No success threshold is imposed on Strategy A beyond correctness because it is the reference audit path.

### 6. Corruption target

Controlled checkpoint, dependency-index, and protected-history corruption probes must produce zero silent false-verification outcomes.

A corrupted acceleration artifact must be rejected and either recover through a valid fallback or fail closed.

## Hidden-work accounting rule

Trial 002 must not classify a recovery as bounded merely because `events_applied` is 10,000 while a hidden verifier reads or hashes the entire pre-checkpoint history.

The report must separately expose, where applicable:

- event bodies read;
- event bodies verified/hashed;
- events semantically applied;
- checkpoint bytes read;
- dependency/index bytes read.

If implementation cannot directly measure one of these byte-level quantities without disproportionate instrumentation, that limitation must be disclosed. Event-count accounting may not conceal known full-history work.

## Scaling interpretation

The primary Trial 002 claim is supported only if the required scales show all of the following:

1. exact verified baseline reconstruction;
2. fixed 10,000-event Strategy B tail work at 100K and 1M;
3. no hidden full-history ordinary-resume verification;
4. zero silent false-verification outcomes;
5. required-scale Strategy B P50 latency ratio no greater than 2.0.

If items 1-4 pass but the latency-stability threshold fails, Trial 002 must be reported as **fixed-work supported but latency stability not supported** rather than as a full pass.

If fixed event-work itself grows with lifetime history, the central fixed-age hypothesis is not supported.

## Failure conditions

Trial 002 must be reported as failing or narrowing the architecture if any of the following occur:

- verified Strategy B or C returns a different authoritative baseline from full verified replay;
- Strategy B reads/replays more than the fixed 10,000-event tail because lifetime history is larger, except explicitly disclosed fixed checkpoint/integrity artifact work;
- ordinary checkpoint validation requires full pre-checkpoint history replay or hashing;
- Strategy C silently omits required authoritative updates or commitments;
- checkpoint or dependency corruption is accepted as valid;
- a corruption probe silently returns a falsely verified authoritative baseline;
- results are selectively discarded or workload semantics are changed after observation to improve the outcome.

## Result handling

- Preserve raw benchmark JSON before interpretation.
- Preserve negative, anomalous, failed, and resource-exhausted runs.
- Report raw repetitions plus P50/P95.
- Keep integrity failures separate from timing averages.
- Label GitHub-hosted runner latency as runner-specific evidence, not production SLOs.
- Any material protocol change after the first measured Trial 002 result requires a separately versioned follow-up rather than editing this preregistration.

## Trial completion criterion

Q2 Trial 002 is technically complete when:

1. this preregistration predates Trial 002 implementation and measured results;
2. the fixed-age checkpoint implementation is reproducible from committed code;
3. `100K` and `1M` lifetime profiles have been executed with checkpoint age exactly `10,000` events;
4. full replay, fixed-age checkpoint recovery, and fixed-age dependency-aware recovery have been measured with repeated runs;
5. correctness, hidden-work accounting, corruption behavior, storage cost, and hardware/software provenance are reported;
6. the result explicitly states whether fixed-work and latency-stability targets were supported;
7. reproducible evidence artifacts and hashes are retained.

The 10M profile remains an extended target and is not required for technical completion.

## Claim discipline

A successful Q2 Trial 002 would support only the following narrow systems claim:

> **In the controlled synthetic Q2 workload, when verified checkpoint age is held fixed at 10,000 events, ordinary recovery work remains bounded by that fixed tail rather than lifetime history, and required-scale recovery latency remains approximately stable while full-audit cost continues to grow with total protected history.**

It would not establish production service-level performance, universal workload independence, or eliminate the need for full historical audit.
