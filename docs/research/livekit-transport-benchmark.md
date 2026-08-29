# LiveKit Agents Transport Benchmark Plan

Status: ACTIVE / TRACKED

Source reference: https://github.com/livekit/agents

Observed baseline: LiveKit Agents exposes server-side realtime AgentSession orchestration, telephony/WebRTC connectivity, semantic turn detection, preemptive generation, interruption handling, session usage accounting, and `metrics_collected` events. These capabilities make it a useful external realtime baseline for Cairn-adjacent infrastructure experiments.

## Purpose

Use LiveKit Agents as a mature realtime transport/agent baseline without making LiveKit a dependency of the Cairn continuity substrate.

The comparison is intended to answer infrastructure questions such as:

- How quickly can a realtime session be established?
- What is the end-of-turn to first-response timing?
- How often do interruptions or false interruptions occur?
- How does preemptive generation affect response latency and wasted work?
- How do transport failures and provider failures surface?
- How stable are latency and availability across repeated runs?

These are transport and realtime-agent questions. They are not Cairn continuity-state questions.

## Hard boundary

This work is allowed only insofar as it exercises infrastructure and transport.

It MUST NOT:

- create a Cairn identity or genesis state;
- create, append to, reconstruct, or mutate the Cairn continuity ledger/history;
- persist Cairn episodic, semantic, working, or reflective memory;
- create Cairn commitments, unresolved obligations, or decision history;
- create or restore Cairn checkpoints or provenance state;
- activate a Cairn Commit Gate;
- run a Cairn inference runtime;
- write benchmark output into an authoritative Cairn state path;
- represent synthetic LiveKit test-session state as authoritative Cairn state.

Benchmark fixtures must be clearly non-authoritative and disposable.

## LiveKit instrumentation points

The current LiveKit Agents example surface provides useful hooks for a baseline harness:

1. `AgentSession`
   - lifecycle/session container for realtime interactions;
   - useful for measuring session startup and shutdown behavior.

2. `metrics_collected`
   - session event that exposes LiveKit runtime metrics;
   - intended input to Cairn's normalized benchmark telemetry.

3. `session.usage`
   - session usage accounting available at shutdown;
   - useful for comparing resource/provider consumption alongside latency.

4. `TurnHandlingOptions`
   - interruption handling and false-interruption recovery;
   - preemptive generation can be enabled and compared against a non-preemptive control.

5. WebRTC / telephony transport
   - useful for measuring media-path setup, stability, and failure behavior after prerequisites are approved.

## Normalized benchmark families

The LiveKit baseline should ultimately emit or be normalized into the following non-authoritative benchmark families:

### Session establishment

- connect/start success rate;
- setup latency;
- room/session dispatch latency when applicable;
- teardown success/failure.

### Turn timing

- speech-end / end-of-turn detection time;
- first model-output time when exposed;
- first TTS/audio-output time when exposed;
- end-of-turn to first-audio latency;
- p50 / p95 / max across repeated runs.

### Interruption behavior

- true interruption count;
- false interruption count;
- false-interruption recovery latency;
- successful speech resume count;
- abandoned response count.

### Preemptive generation

- enabled vs. disabled latency comparison;
- successful preemptive-use count;
- discarded/wasted preemptive work when observable;
- retry count when observable.

### Transport reliability

- WebRTC/transport connection failure rate;
- disconnect/reconnect events;
- provider/API failure observations;
- route availability and p95 latency;
- failover behavior when separately configured.

### Usage / cost-adjacent telemetry

- session usage values exposed by LiveKit;
- provider/model identifiers used for the run;
- test duration;
- attempts and successful completions.

No benchmark output may be interpreted as continuity evidence.

## Comparison matrix

The first meaningful comparison should use identical synthetic prompts/audio and separate transport configurations:

| Variant | Purpose |
| --- | --- |
| LiveKit baseline, preemptive generation disabled | Conventional realtime control |
| LiveKit baseline, preemptive generation enabled | Measure latency benefit/cost of early generation |
| LiveKit interruption recovery enabled | Measure interruption/false-interruption behavior |
| Cairn generic TCP/HTTP benchmark | Independent network/endpoint baseline |
| Later RTVIE experiment | Separate anticipatory/speculative research comparison; not part of current Cairn-state work |

## Execution sequence

### A. Reference capture - DONE

- [x] Record LiveKit Agents as an external comparison target.
- [x] Confirm current framework exposes `metrics_collected` and `session.usage`.
- [x] Confirm current example exposes preemptive-generation and interruption controls.
- [x] Preserve the rule that LiveKit is not the Cairn continuity substrate.

### B. Repository benchmark contract - CURRENT

- [x] Create Cairn transport-only benchmark CLI.
- [x] Create route-summary/ranking primitives.
- [x] Document LiveKit-specific measurement plan.
- [ ] Add normalized LiveKit result schema/fixture format.
- [ ] Add ingestion/normalization utility for exported LiveKit metrics.
- [ ] Add synthetic benchmark scenario definitions.

### C. Controlled runtime baseline - REQUIRES RUNTIME PREREQUISITES

- [ ] Use an isolated non-authoritative LiveKit test environment.
- [ ] Use synthetic prompts/audio only.
- [ ] Keep logs/results outside authoritative Cairn state paths.
- [ ] Record LiveKit version/commit and provider/model versions for each run.
- [ ] Run repeated trials with preemptive generation disabled/enabled.
- [ ] Measure interruption and false-interruption recovery.
- [ ] Export normalized benchmark telemetry.

### D. Telephony/media-path baseline - LATER / SEPARATE APPROVAL

- [ ] Exercise SIP/telephony/media transport only after the specific host/service procedure is approved.
- [ ] Do not change the current FreeSWITCH safety state merely to run this benchmark.
- [ ] Measure transport/media behavior separately from any Cairn continuity experiment.

## Success condition for this workstream

The LiveKit workstream is complete when Cairn has a repeatable, versioned, non-authoritative benchmark dataset showing realtime transport/session behavior under controlled scenarios, with enough instrumentation to compare latency, availability, interruption behavior, and preemptive-generation tradeoffs without creating or touching Cairn authoritative state.

## Program relationship

LiveKit may carry and measure a realtime conversation. Cairn determines continuity.

Transport metrics answer whether the pipes are fast and reliable. Cairn continuity metrics answer whether authoritative operational continuity survived a model/host transition. These must remain separate measurement domains.
