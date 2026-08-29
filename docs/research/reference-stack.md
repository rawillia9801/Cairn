# Cairn Research Reference Stack

These projects are references or comparison targets. They are not Cairn runtime dependencies.

## LiveKit Agents

Role: realtime voice/agent transport and orchestration benchmark target.

Permitted comparison areas include transport latency, signaling behavior, turn-taking timing, interruption handling, routing, and failover. Any experiment must remain outside authoritative Cairn state.

## AI Engineering From Scratch

Role: engineering reference library for realtime voice, inference, caching, speculative decoding, evaluation, and agent infrastructure concepts.

Its speculative decoding material is not equivalent to Cairn speculative operations. Token speculation must remain conceptually separate from any future Cairn operation-level speculation.

## FreeLLMAPI

Role: reference for provider health, failover, latency-aware routing, and measurement patterns.

It is not approved as Cairn production infrastructure. Any experimentation must use non-authoritative benchmark telemetry only.

## Marin

Role: later-stage research reference for reproducible experimentation, model training/post-training, and experiment provenance.

It is not part of the Phase 0 runtime and must not be installed as part of transport benchmarking.

## Boundary

All reference-stack work at the current phase is limited to infrastructure and transport. It must not initialize, reconstruct, simulate, or mutate authoritative Cairn state.
