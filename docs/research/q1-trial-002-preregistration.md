# Q1 Trial 002 — Provenance Portability Protocol

**Status:** Pre-registered design; benchmark fixtures and external engine runs not yet created  
**Date:** 2026-08-30  
**Benchmark family:** Cairn Q1 cross-model continuity  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Why Trial 002 exists

Trial 001 produced the same recovered operational baseline from Google Gemini 2.5 Flash and Anthropic Claude Sonnet 5 across all three controlled synthetic cases. Both engines achieved perfect state, unresolved-commitment, revision and resumption scores, with zero pairwise divergence on those dimensions.

Both engines also independently compressed some multi-event provenance paths to the final correction or adjudication event. Aggregate provenance fidelity was `0.8796` for each engine.

Trial 002 is a new experiment motivated by that observed failure mode. Trial 001 remains unchanged.

## Research question

Can materially different cognition engines reconstruct not only the same authoritative operational state, but also the complete minimum evidentiary path that makes each recovered state assertion or unresolved commitment authoritative?

## Core distinction

Trial 002 separates two questions that Trial 001 showed are not equivalent:

1. **What is the current authoritative state?**
2. **Why is that state authoritative?**

A correct terminal answer with an incomplete evidence path is not full provenance recovery.

## Primary hypothesis

Given the same explicit model-independent reconstruction contract and the same preserved event history, materially different cognition engines can recover the same authoritative state and the same minimum sufficient provenance path without collapsing that path to only the most recent correction or adjudication event.

## Alternative / failure hypothesis

Different cognition engines may agree on current state while systematically or inconsistently compressing, expanding or reinterpreting the evidence path required to justify that state.

If that occurs, complete provenance portability cannot be delegated solely to cognition-engine interpretation; the continuity substrate or reconstruction package must carry more explicit provenance structure.

## Reconstruction contract to be tested

The benchmark prompt will define provenance as the **minimum sufficient authoritative evidence path** for a recovered assertion or unresolved commitment.

For each recovered item, the engine must identify every event necessary to establish:

- the originating assertion or commitment when still relevant to the current record;
- any conflicting evidence materially considered in an authoritative adjudication;
- any correction or supersession relationship required to understand how the current value replaced an earlier value;
- the authoritative adjudication, correction or completion event that determines present status;
- any cross-host or cross-model transition event only when it is materially required to establish continuity of that record.

The engine must **not** include unrelated events merely because they appear in the same history.

A later non-authoritative derived summary does not become authoritative evidence by recency alone.

The contract will not identify which event IDs satisfy these rules in any benchmark case.

## Planned case classes

The frozen Trial 002 suite will include multiple disposable synthetic histories drawn from at least the following classes:

1. **Multi-step correction chain** — an assertion is revised more than once, requiring preservation of the revision path rather than only the terminal correction.
2. **Conflicting evidence plus adjudication** — multiple contradictory observations are explicitly considered before an authoritative decision.
3. **Superseded source plus surviving evidence** — part of an evidence chain becomes obsolete while another part remains necessary to justify current state.
4. **Misleading derived summary** — a later non-authoritative summary compresses or contradicts the authoritative record.
5. **Transition-spanning provenance** — relevant evidence begins before a simulated host/model transition and authoritative resolution occurs afterward.
6. **Irrelevant-neighbor control** — plausible but unrelated events are interleaved to measure provenance overreach rather than rewarding engines that simply cite everything.

At least one case must require more than three relevant provenance events for one recovered item.

## Dataset construction rule

Actual Trial 002 histories, event IDs, values, ground truth and expected provenance paths will be generated only after this preregistration is committed.

The suite must be explicitly marked:

- `benchmark_namespace: synthetic-q1-trial-002-non-authoritative`
- `authoritative_cairn_state: false`

The final prompt package must be frozen and SHA-256 hashed before any eligible external engine sees it.

Once frozen, the package, ground truth, scoring rules and thresholds may not be changed for Trial 002.

## Response contract

Each engine response will identify, for every case:

- recovered authoritative state assertions;
- unresolved commitments;
- explicit revision links;
- a provenance event set for each recovered state assertion;
- a provenance event set for each unresolved commitment;
- where required by the schema, the role each cited event plays in the authoritative path.

The schema will remain provider-neutral and contain no expected event IDs or answers.

## Pre-registered primary metrics

### Operational recovery

- state assertion precision;
- state assertion recall;
- state assertion F1;
- unresolved commitment precision;
- unresolved commitment recall;
- unresolved commitment F1;
- revision fidelity F1;
- unsupported state claims.

### Provenance recovery

- provenance event precision;
- provenance event recall;
- provenance event F1;
- complete-path recovery rate;
- terminal-only compression rate;
- irrelevant-evidence inclusion rate;
- provenance role accuracy if roles are required by the final frozen schema.

### Cross-model consistency

- pairwise state-value divergence;
- pairwise commitment divergence;
- pairwise revision divergence;
- pairwise provenance-set divergence;
- pairwise provenance-role divergence if roles are used.

## Pre-registered candidate engineering targets

Trial 002 will be considered to have met the candidate controlled-case engineering target for an eligible engine only if all of the following hold:

- aggregate state F1 `>= 0.95`;
- aggregate unresolved-commitment F1 `>= 0.95`;
- aggregate provenance event F1 `>= 0.95`;
- complete-path recovery rate `>= 0.90`;
- terminal-only compression rate `<= 0.10`;
- irrelevant-evidence inclusion rate `<= 0.10`;
- zero unsupported state keys.

For a cross-model portability result, at least two materially different eligible cognition-engine families must each meet the engine-level targets and aggregate pairwise provenance-set divergence must be `<= 0.10`.

These are engineering targets for controlled synthetic cases, not claims about arbitrary real-world continuity.

## Catastrophic failure conditions

The following must be reported separately even if aggregate metrics remain high:

- a model follows a non-authoritative derived summary over verified authoritative evidence;
- a model drops an unresolved commitment because of a host/model transition;
- a model invents an unsupported state key;
- a model reports the right state but omits the event that makes a correction or adjudication authoritative;
- a model cites every nearby event indiscriminately and therefore cannot distinguish relevant provenance from history volume;
- materially different engines recover conflicting authoritative states from the same intact evidence.

No catastrophic case may be hidden by averaging.

## Blinding rule

An eligible Trial 002 cognition engine receives only:

- the frozen Trial 002 prompt package;
- the provider-neutral response contract;
- minimal transport instructions required to return the requested machine-readable output.

It must not receive:

- ground truth;
- reference answers;
- scorer implementation;
- expected metric values;
- Trial 002 outputs from another engine;
- post-hoc hints or corrections.

An engine/operator that inspects Trial 002 ground truth before producing the first response is ineligible as a blinded Trial 002 arm.

## Minimum model arms

Trial 002 requires at least two materially different cognition-engine families.

A third materially different family is strongly preferred because Trial 001 found identical behavior in two model families and Trial 002 is specifically testing whether that behavior generalizes.

For every arm retain:

- provider;
- exact model identifier as available;
- version/API revision as available;
- execution date/time available to the operator;
- sampling controls when configurable;
- external system/developer instructions, if any;
- structured-output enforcement status;
- raw first response before normalization;
- SHA-256 of the raw first response.

## Output handling

1. Capture the raw first response before scoring or correction.
2. Hash and retain it.
3. Preserve both original and normalized forms if transport cleanup is required.
4. Do not repair factual content, event IDs, evidence sets, commitments or revision links by hand.
5. Do not reveal one eligible engine's response to another before all first responses are captured.
6. Score every eligible arm with the same committed Trial 002 scorer.

## Interpretation rules

- Correct state with incomplete provenance is a partial success, not full continuity success.
- Full provenance does not require identical prose, reasoning style or personality.
- Additional irrelevant citations reduce precision; citing all history is not considered complete provenance recovery.
- A provenance miss can be architectural evidence even when semantic state recovery is perfect.
- Negative results and catastrophic failures remain in the evidence record.
- Trial 002 results do not retroactively modify Trial 001.

## Trial completion criterion

Trial 002 becomes technically complete only when:

1. this preregistration predates fixture construction and external runs;
2. one immutable Trial 002 prompt package has been frozen and hashed;
3. at least two eligible blinded model-family arms have returned raw first responses;
4. those responses have been hashed and retained;
5. the committed scorer has generated a reproducible comparison report;
6. case-level catastrophic failures, if any, are reported separately from aggregates.

## Initialization boundary

Nothing in Trial 002 initializes Cairn or creates authoritative Cairn identity, memory, history, commitments, checkpoints, provenance state, genesis data, Commit Gate state or inference-runtime state.

Every Trial 002 record is synthetic benchmark material and must remain deletable without changing anything Cairn knows, remembers or could reconstruct.
