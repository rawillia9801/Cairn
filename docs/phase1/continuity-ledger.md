# Continuity Ledger v1

## Purpose

The continuity ledger is the first authoritative history primitive in Cairn. It records continuity-significant events in an append-only chain whose integrity can be checked independently of any inference model.

This is not yet a production persistence layer. Phase I begins with a pure deterministic event contract and verifier so the research claims can be tested before storage, replication, checkpointing, or recovery orchestration are introduced.

## Event envelope

Each event contains:

- `schemaVersion` — fixed schema identifier (`cairn.event.v1`)
- `id` — caller-supplied unique event identifier
- `sequence` — monotonically increasing ledger position beginning at 1
- `recordedAt` — ISO-8601 timestamp supplied by the recording system
- `eventType` — continuity-significant event classification
- `actor` — human, model, service, or system actor responsible for the event
- `source` — system of origin plus optional instance/model/provider metadata
- `predecessorHash` — SHA-256 hash of the previous event, or `null` for the first event
- `artifacts` — zero or more content-addressed artifact references
- `payload` — JSON-compatible event-specific data
- `hashAlgorithm` — fixed to `sha256`
- `eventHash` — SHA-256 over the canonical event material excluding only `eventHash`

## Canonicalization

Hashing must not depend on JavaScript object insertion order or incidental formatting.

Cairn v1 canonicalization therefore:

1. preserves array order;
2. sorts object keys lexicographically;
3. serializes strings using JSON escaping;
4. serializes finite numbers using JSON number representation;
5. preserves booleans and `null`;
6. rejects non-finite numbers and non-JSON values;
7. omits no fields from the defined hash material except optional fields that are genuinely absent.

This canonical representation is an engineering contract for Phase I. A later schema migration must never silently change how an existing schema version is hashed.

## Chain invariants

For a valid v1 ledger:

- the first event has `sequence = 1` and `predecessorHash = null`;
- every later event has a sequence exactly one greater than its predecessor;
- every later event's `predecessorHash` exactly equals the preceding event's `eventHash`;
- every `eventHash` matches a fresh SHA-256 calculation over its canonical material;
- every event ID is unique within the ledger;
- all declared artifact hashes are lowercase 64-character hexadecimal SHA-256 values.

## Append rule

Cairn must not append to history it has not first verified. The Phase I append function verifies the existing ledger before constructing the next event. If any prior integrity violation is present, append fails rather than extending a corrupted chain.

## Corrections and reinterpretations

Events are immutable. A correction, supersession, reinterpretation, or revised conclusion is a new event that refers to prior evidence through its payload or later provenance structures. The original event remains intact.

## What this does not yet prove

A valid hash chain can demonstrate tampering or corruption relative to the preserved chain, but by itself it does not establish that an event was truthful, externally witnessed, durably replicated, or written at the claimed wall-clock time. Those properties require additional evidence, signatures/attestation where appropriate, content-addressed artifacts, checkpoint anchoring, and independent recovery tests.

Phase I must keep those claims separate.