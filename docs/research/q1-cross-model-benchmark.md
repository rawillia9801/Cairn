# Q1 Cross-Model Continuity Benchmark Harness

**Status:** Pre-genesis research harness  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only.

This harness implements the first Phase I validation track: **Can operational continuity survive materially different cognition engines?**

It does not initialize Cairn. It does not create or mutate Cairn identity, continuity history, memory, commitments, checkpoints, provenance state, genesis data, or Commit Gate state.

## What is implemented

- three synthetic benchmark histories covering correction, conflicting evidence, unresolved commitments, host transition, and a misleading derived summary;
- deterministic hidden ground truth for authoritative state, unresolved commitments, and revision links;
- SHA-256 event sealing and hash chaining for benchmark integrity checks;
- prompt-package generation that excludes ground truth;
- provider-neutral response schema;
- state precision/recall/F1;
- commitment precision/recall/F1;
- provenance fidelity;
- revision fidelity;
- resumption consistency;
- unsupported-state-claim counts;
- pairwise interpretation divergence across cognition engines;
- deliberate in-memory mutation test proving that sealed-history tampering is detected;
- reference-perfect and intentionally drifted responses for harness self-test.

## Why provider-neutral

The benchmark does not call a model provider directly. This is deliberate. A single sealed prompt package is generated once and can be submitted to materially different cognition engines without changing the benchmark logic. Their JSON responses are then scored by the same local harness.

This avoids embedding provider-specific behavior into the experimental core and makes later comparison across OpenAI, Google, Anthropic, local models, or other engines possible without altering the hidden ground truth or scoring rules.

## Files

- `fixtures/q1-cross-model/suite.v1.json` — synthetic histories plus hidden scorer ground truth.
- `fixtures/q1-cross-model/responses/reference-perfect.json` — known-perfect scorer fixture.
- `fixtures/q1-cross-model/responses/reference-drifted.json` — intentionally incorrect scorer fixture.
- `lib/research/q1-cross-model-core.mjs` — sealing, verification, scoring, prompt generation, divergence.
- `tools/q1-cross-model-benchmark.mjs` — CLI.

## Self-test

```bash
npm run benchmark:q1 -- --self-test
```

The self-test passes only if:

1. all sealed synthetic histories verify;
2. the perfect reference response scores 1.0 on state, commitments, provenance, and resumption consistency;
3. the intentionally drifted response scores lower;
4. a deliberate mutation of a sealed event is detected.

## Generate the model-neutral prompt package

```bash
npm run benchmark:q1 -- --emit-prompts ./out/q1-prompts.json
```

The emitted prompt package contains sealed benchmark histories and the required response schema, but **not** the hidden ground truth.

## Score cognition-engine outputs

Each engine returns JSON matching `cairn.q1-engine-output.v1`. Save each response separately, then run:

```bash
npm run benchmark:q1 -- \
  --response engine-a=./out/engine-a.json \
  --response engine-b=./out/engine-b.json \
  --out ./out/q1-report.json
```

The report records per-engine recovery metrics and pairwise interpretation divergence.

## Interpretation-divergence measurement

Pairwise divergence is intentionally separated from integrity and ground-truth recovery. Two models can both consume an intact history while reaching different reconstructed states. The harness reports divergence across:

- recovered state values;
- unresolved commitments;
- revision relationships.

A high integrity score therefore cannot be mistaken for behavioral parity.

## Current scope limit

This first harness establishes benchmark mechanics and a small pilot suite. It does **not** yet claim that any external cognition engine meets the Phase I recovery targets. Real cross-model results begin only after the exact same generated prompt package is run through multiple materially different engines and the returned outputs are scored.

## Expansion path

After the pilot mechanics are validated, expand the suite with:

- larger histories and deeper dependency chains;
- multiple appended corrections;
- conflicting evidence without an easy lexical cue;
- expired versus still-open commitments;
- duplicated/replayed events;
- missing derived memory;
- adversarially plausible but non-authoritative summaries;
- repeated stochastic trials per model/configuration;
- confidence intervals and catastrophic-failure counts.

Negative results remain first-class results. If a model cannot reconstruct predefined state from intact history, that narrows the demonstrated boundary of model-independent continuity.
