# Cairn Phase I Validation Plan

**Status:** Pre-genesis research specification  
**Purpose:** Define measurable tests for Cairn's model-independent continuity hypothesis without initializing or simulating authoritative Cairn state.

> **Initialization boundary:** Every experiment described here must use synthetic, disposable, unmistakably non-authoritative benchmark data. Nothing in this plan may create Cairn identity, continuity history, memory, commitments, checkpoints, genesis state, provenance state, or Commit Gate state. The benchmark environment must be deletable without changing anything Cairn knows, remembers, or could reconstruct.

## Research premise

Cairn separates a replaceable cognition engine from an authoritative continuity substrate. Phase I is not intended to assume that operational continuity can be made model-independent. It is intended to determine which properties can be preserved deterministically at the systems layer, which degrade across model changes, and what performance cost is introduced by preserving verifiable history.

The three scaling questions below are treated as falsifiable research questions, not marketing claims.

---

## Q1 — Cross-model continuity

### Question

**Can operational continuity survive materially different cognition engines?**

A valid continuity layer must preserve more than raw transcripts. It must allow a replacement cognition engine to recover authoritative facts, unresolved commitments, provenance, and state assertions from the same verified historical baseline while making any interpretation drift measurable.

### Experimental design

Build synthetic benchmark histories containing:

- authoritative events;
- source evidence and provenance links;
- explicit state assertions;
- unresolved commitments and deadlines;
- completed and superseded commitments;
- corrections that append new understanding without deleting original history;
- derived summaries that may be incomplete or intentionally corrupted;
- conflicting or ambiguous evidence;
- model/provider metadata;
- controlled host-transition markers.

Run the same benchmark history through materially different cognition engines. Each replacement engine reconstructs state from the same verified evidence set.

### Primary metrics

| Metric | What it measures |
| --- | --- |
| State assertion recovery | Precision and recall for authoritative state after transition |
| Commitment recovery | Fraction of unresolved commitments correctly recovered |
| Provenance fidelity | Whether reconstructed claims remain linked to the correct evidence, actor, model/version, and time |
| Historical integrity | Whether original events remain unchanged and correctly ordered |
| Revision fidelity | Whether later corrections are represented as appended interpretation rather than historical replacement |
| Interpretation divergence | Degree to which cognition engines reach materially different conclusions from identical preserved history |
| Resumption consistency | Whether each engine resumes from the same authoritative operational baseline |

### Non-negotiable systems guarantees

These are infrastructure properties and should not depend on model behavior:

1. Original benchmark events are never silently mutated.
2. Content-addressed originals validate against their recorded identifiers.
3. Hash-chain/order verification detects deletion, reordering, insertion, or mutation.
4. Reconstructed state can identify the evidence from which it was derived.
5. A model transition cannot silently become a historical rewrite.

### Candidate Phase I targets

These are engineering targets to be calibrated after pilot runs, not claims of achieved performance:

- 100% detection of deliberate mutation of protected benchmark history;
- 100% preservation of content-addressed originals;
- >=95% recovery of predefined authoritative state assertions in controlled benchmark cases;
- >=95% recovery of predefined unresolved commitments in controlled benchmark cases;
- provenance accuracy reported separately from semantic/behavioral similarity;
- behavioral parity is **not** required and must not be presented as a systems guarantee.

### Failure condition

If materially different cognition engines cannot reliably reconstruct predefined authoritative state even when provenance and history are intact, the model-independent continuity boundary is narrower than proposed and must be reported as such.

---

## Q2 — Multi-year reconstruction efficiency

### Question

**Can authoritative state be reconstructed efficiently at multi-year scale?**

An append-only history is not operationally useful if normal recovery requires replaying every event from genesis. Cairn therefore needs to demonstrate that verified checkpoints, materialized state, dependency-aware replay, and selective reconstruction can bound recovery cost while preserving an auditable path back to original history.

### Experimental design

Generate synthetic histories at increasing scale, for example:

- 10,000 events;
- 100,000 events;
- 1,000,000 events;
- 10,000,000 events where hardware and time permit.

Benchmark at multiple checkpoint intervals and dependency depths. Include controlled corruption of derived state so that the system must fall back to verified evidence.

Compare at least three recovery strategies:

1. full replay from origin;
2. verified checkpoint plus incremental replay;
3. selective/dependency-aware reconstruction from the nearest valid checkpoint and required evidence.

### Primary metrics

| Metric | What it measures |
| --- | --- |
| Cold reconstruction latency | Wall-clock time from no materialized state to verified recovered state |
| Warm/incremental recovery latency | Resume time from the latest valid checkpoint |
| P50 / P95 recovery latency | Typical and tail performance across repeated trials |
| Events replayed | Fraction of total history required for recovery |
| Compute cost | CPU/GPU time or equivalent resource consumption |
| Peak memory | Maximum working set during reconstruction |
| Storage overhead | Additional bytes required for hashes, provenance, indexes, checkpoints, and derived state |
| Verification overhead | Cost of integrity checks relative to unverified reconstruction |
| Selective replay accuracy | Whether dependency-limited recovery produces the same authoritative result as full verified replay |

### Success criterion

The architecture should demonstrate that **immutable history does not imply replaying everything every time**. Recovery cost should become bounded by checkpoint age and relevant dependency scope rather than grow linearly with the complete lifetime of the system for every routine resume event.

Absolute latency targets should be set only after the reference hardware profile is fixed. Phase I should report both raw numbers and scaling curves.

### Failure condition

If verified reconstruction remains effectively linear with total historical lifetime under ordinary resume conditions, or if checkpoint acceleration materially weakens integrity guarantees, the architecture requires redesign before claiming practical multi-year continuity.

---

## Q3 — Structured provenance vs. brute-force long context

### Question

**Does structured provenance provide measurable reliability, recovery, and auditability advantages over simply placing large amounts of raw history into a very large context window?**

Growing context windows are a legitimate competing approach. Cairn should not assume that additional continuity infrastructure is superior; it should measure the difference.

### Controlled comparison

Use the same synthetic histories and tasks in two conditions:

**Condition A — Long-context baseline**

- raw or lightly formatted historical transcript/evidence supplied directly to the cognition engine;
- no Cairn-style authoritative provenance graph or checkpoint/reconstruction semantics beyond what is required to fit the context.

**Condition B — Structured continuity**

- authoritative events separated from derived interpretation;
- provenance links;
- content-addressed originals;
- verified checkpoints;
- explicit unresolved commitments/state assertions;
- selective reconstruction of relevant evidence.

Test both conditions under:

- model replacement;
- provider replacement;
- contradictory evidence;
- corrupted summaries;
- historical mutation attempts;
- missing derived memory;
- replay/duplication attempts;
- recovery after abrupt termination;
- histories approaching or exceeding available context capacity.

### Primary metrics

| Metric | Long-context vs. structured comparison |
| --- | --- |
| Authoritative-state accuracy | Correct recovery of predefined state |
| Commitment recovery | Correct identification of unresolved work |
| Provenance accuracy | Ability to identify the actual supporting evidence |
| Tamper detection | Detection of mutation, deletion, reorder, insertion, or replay |
| Original/derived separation | Ability to distinguish source evidence from later interpretation |
| Recovery reproducibility | Whether repeated recovery yields the same authoritative baseline |
| Token/context load | Input tokens or equivalent context volume required |
| Latency | End-to-end recovery and task latency |
| Cost | Model/API and compute cost per recovery/task |
| Failure under context pressure | Performance as history exceeds practical context limits |

### Success criterion

Cairn should demonstrate a measurable advantage in at least the properties it is explicitly designed to provide: provenance, tamper evidence, recovery reproducibility, authoritative/derived separation, and bounded reconstruction. It does **not** need to beat brute-force context on every latency or cost metric to be useful.

### Failure condition

If a simple long-context baseline matches structured continuity on integrity, provenance, recovery, and scaling while remaining materially cheaper and simpler, Cairn's added infrastructure would require a narrower justification.

---

## Cross-cutting benchmark rules

### Reproducibility

Every benchmark run should record:

- benchmark dataset version/hash;
- cognition engine/provider/version;
- system prompt/configuration hash where applicable;
- host/hardware profile;
- checkpoint policy;
- reconstruction strategy;
- random seed where supported;
- start/end timestamps;
- raw metrics;
- failure classification.

### Statistical treatment

For stochastic model behavior:

- run repeated trials rather than relying on single examples;
- report distributions and confidence intervals where meaningful;
- keep infrastructure-integrity metrics separate from cognition-quality metrics;
- do not average away catastrophic failures;
- report worst-case and tail behavior for recovery-critical operations.

### Negative results

Phase I must preserve negative findings. If a property proves model-dependent, the result should be appended to the research record rather than reframed as success. The objective is to measure the boundary of model-independent continuity.

---

## Phase I evidence package

A strong Phase I result should produce an evidence package containing:

1. benchmark specification and synthetic datasets;
2. reproducible test harnesses;
3. model-transition comparison results;
4. reconstruction scaling curves;
5. structured-provenance vs. long-context comparisons;
6. failure and corruption test results;
7. integrity-verification results;
8. documented model-dependent limitations;
9. reference hardware/software configuration;
10. a concise claim matrix separating **demonstrated**, **partially demonstrated**, **not demonstrated**, and **out of scope** properties.

## Claim discipline

Cairn should not claim that it preserves subjective identity, guarantees identical behavior across models, proves a neural model's true internal causal reason for an output, or guarantees alignment. A successful Phase I would support a narrower and more defensible proposition:

> **A long-lived AI system can preserve and reconstruct a verifiable operational history, provenance, authoritative state, and unresolved obligations across selected model and infrastructure transitions, with measured limits and quantified performance overhead.**

That proposition is what the benchmark program is designed to test.
