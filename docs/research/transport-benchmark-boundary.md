# Cairn Transport Benchmark Boundary

## Purpose

This benchmark layer exists to exercise infrastructure and transport only.

Allowed scope:

- TCP reachability and connection latency
- HTTP(S) reachability and request latency
- signaling and media transport timing
- endpoint health and failover behavior
- route-selection scoring derived from transport observations
- benchmark instrumentation and export of benchmark results

Prohibited scope:

- creating or mutating Cairn identity
- creating or mutating continuity ledger/history
- creating or mutating memory or commitments
- creating or mutating checkpoints or genesis data
- reconstructing authoritative Cairn state
- creating provenance state
- creating or exercising Commit Gate state
- initializing an inference runtime as Cairn

The benchmark may generate ephemeral observations and benchmark output. Those observations are test telemetry only and must never be treated as authoritative Cairn state.

## Rule

**Exercise the pipes, not Cairn.**

Any future LiveKit, provider-routing, or realtime-agent comparison must remain inside this boundary unless a later phase explicitly authorizes Cairn runtime initialization.
