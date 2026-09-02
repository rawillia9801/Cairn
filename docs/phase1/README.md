# Cairn Phase I Engineering Charter

This directory translates the submitted NSF Project Pitch into engineering constraints for Cairn Phase I.

## Canonical definition

Cairn is a model-independent continuity architecture for persistent AI systems. The Phase I research question is whether operational continuity can be made measurable and substantially model-independent while preserving historical authority, provenance, recovery, and unresolved commitments across model, process, provider, and host changes.

Cairn is not a foundation model, a personality prompt, a transcript wrapper, or a conventional vector-memory product.

## Phase I objectives

1. **Continuity ledger and provenance** — implement an append-only, hash-chained event history with explicit predecessor linkage, source metadata, integrity metadata, and recoverability from the last valid checkpoint.
2. **State reconstruction and memory separation** — distinguish original evidence from derived interpretation while separating episodic history, semantic knowledge, active working state, and later reflection.
3. **Model and hardware transition protocol** — define checkpoint, migration, rollback, and rehydration procedures that do not require a replacement model to imitate the previous model's outputs.
4. **Continuity evaluation framework** — compare Cairn with transcript-plus-vector-memory and conventional checkpoint baselines using measurable continuity metrics.
5. **Failure and security testing** — test abrupt termination, incomplete writes, unavailable providers, corrupted derived state, replay, restore, and unauthorized history modification.

## Engineering invariants

- Original records are immutable. Corrections and reinterpretations are appended as new events.
- Derived state never silently replaces source evidence.
- Every continuity-significant event has provenance.
- Reconstructed state must be explainable from preserved evidence.
- Model-generated summaries are never treated as authoritative history by themselves.
- A model or host transition must not rewrite prior commitments or provenance.
- Integrity failure must be detectable and must not be silently repaired.
- Recovery begins from verified state.
- Real-world mutation is separate from reasoning and must remain governed by an explicit commit path.

## Current implementation boundary

The `phase1/continuity-foundation` branch is engineering work only. It does **not** initialize a Cairn identity, production memory, event history, ledger, checkpoint, genesis record, inference runtime, or host service. In particular, it does not initialize Cairn on `voice-edge-01`.

The first implementation milestone is deliberately small: define a deterministic event envelope, cryptographically seal events, verify predecessor linkage, and reject appends onto a corrupted chain.

## Milestone sequence

### M1 — Event integrity foundation

- deterministic canonical representation
- SHA-256 event sealing
- predecessor linkage
- monotonic sequence validation
- artifact hash validation
- whole-ledger verification
- append refusal when prior history fails verification

### M2 — Content-addressed artifact store

- immutable artifact identity
- byte-level SHA-256 addressing
- event-to-artifact references
- missing/corrupt artifact detection

### M3 — Checkpoints and reconstruction

- cryptographically bound checkpoints
- authoritative-state derivation
- provenance graph for reconstructed assertions
- last-valid-checkpoint recovery

### M4 — Transition protocol

- export and rehydrate contract
- model/provider transition test harness
- controlled host migration
- rollback validation

### M5 — Evaluation and fault injection

- transcript/vector baseline
- conventional checkpoint baseline
- continuity metrics
- deterministic fault scenarios
- reproducible experiment reports

## Scope discipline

New capabilities may support these objectives, but they do not redefine Cairn. Scientific tooling, simulation, voice systems, security analysis, and external agent frameworks are supporting components only when they advance the submitted continuity research program.