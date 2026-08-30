# Q1 Trial 001 — Results

**Status:** Scored; technical completion criterion met  
**Date:** 2026-08-30  
**Benchmark:** Cairn Q1 cross-model continuity  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## What was tested

Two materially different cognition-engine families received the same frozen Q1 prompt package in fresh manual web-interface sessions. Neither engine was shown the benchmark ground truth, scorer, reference responses, expected scores, the other engine's response, or post-hoc corrections before its first response was captured.

The frozen prompt package remained the preregistered package:

- dataset hash: `91d91590b53a976811870c1761523bf8c22fa9dd8c23ecedef4507009a19b4f5`
- frozen prompt-package SHA-256: `982e0fed8cf6e73762211587a81757d88308f6a1e292182b8dd6e362b5fa4932`

## Engine arms

### Arm A — Google Gemini

- engine id returned: `gemini/gemini-2.5-flash`
- provider returned: `google`
- version returned: `2.5`
- raw response: `evidence/q1-trial-001/raw/gemini-2.5-flash.json`
- raw response SHA-256: `03a7c87b1f5c02f1ceca07619360a738e8b04a8d2dc1568877b5c58d7a7461da`

### Arm B — Anthropic Claude

- engine id returned: `anthropic/claude-sonnet-5`
- provider returned: `anthropic`
- version returned: `claude-sonnet-5`
- raw response: `evidence/q1-trial-001/raw/claude-sonnet-5.json`
- raw response SHA-256: `e0a892c9389565dfb9b816fd535de4847eea99e56f5c735f210a7fcf428c369d`

The identifiers above are the identifiers returned inside the captured engine outputs. The trial used manual web interfaces rather than provider APIs, so provider-side request IDs and exact provider-side execution timestamps were not available. This is retained as a metadata-quality limitation rather than reconstructed after the fact.

## Reproducible scoring

The checked-in raw responses were scored by the already-committed Q1 scorer in GitHub Actions. No prompt, ground truth, metric, threshold or scorer rule was changed after either response was observed.

GitHub Actions run: `33303609010`  
Report artifact: `q1-trial-001-report`  
Artifact ID: `9729729537`  
Artifact ZIP digest: `sha256:74f96f7b5a71c4b1d8f6f19edd07104f9fbbecf0ca655d9bd9a75bf23a02c45f`  
Generated report SHA-256: `f2cf5d5262c654f3de0e3e76572a8c219afa76bb70da0b4615badc77068f768e`

The CI suite-integrity check passed for all three sealed synthetic histories.

## Aggregate results

| Metric | Gemini 2.5 Flash | Claude Sonnet 5 |
| --- | ---: | ---: |
| State precision | 1.0000 | 1.0000 |
| State recall | 1.0000 | 1.0000 |
| State F1 | 1.0000 | 1.0000 |
| Commitment precision | 1.0000 | 1.0000 |
| Commitment recall | 1.0000 | 1.0000 |
| Commitment F1 | 1.0000 | 1.0000 |
| Provenance fidelity | 0.8796 | 0.8796 |
| Revision fidelity F1 | 1.0000 | 1.0000 |
| Resumption consistency | 1.0000 | 1.0000 |
| Unsupported state claims | 0 | 0 |

Pairwise interpretation divergence across recovered state values, unresolved commitments and revision relationships was `0.0000` for every case and `0.0000` aggregate.

## Case-level result

### Correction plus unresolved commitment

Both engines recovered the correct current state, unresolved commitment and explicit correction relationship. Provenance fidelity was `0.8889` because both cited only correction event `e004` for the recovered `deployment.region=us-west` assertion, while the benchmark ground truth preserves both the original `e001` and correction `e004` as provenance for the revised state.

### Conflicting evidence plus authoritative adjudication

Both engines recovered `cluster.capacity=96` and unresolved commitment `C-101`. Provenance fidelity was `0.7500` because both cited only adjudication event `e103` for the capacity assertion. The benchmark ground truth preserves the full adjudication evidence path: `e101`, `e102` and `e103`.

### Host transition plus misleading derived summary

Both engines recovered the correct state and retained unresolved commitment `C-201` despite the later non-authoritative derived summary claiming no unresolved commitments remained. Provenance fidelity was `1.0000` for this case.

## Pre-registered target assessment

The candidate engineering targets were at least `0.95` authoritative-state recovery and at least `0.95` unresolved-commitment recovery in controlled benchmark cases.

Both tested engines achieved `1.0000` state F1 and `1.0000` commitment F1 across Trial 001. Both also achieved exact resumption baselines for all three cases, zero unsupported state claims and zero pairwise interpretation divergence on the dimensions measured by the benchmark.

Trial 001 therefore provides positive evidence that, in these controlled synthetic cases, materially different cognition-engine families can reconstruct the same predefined operational baseline from the same preserved history.

It does **not** establish perfect continuity or perfect provenance portability. Both engines independently compressed multi-event provenance into the final authoritative/correction event in the same two cases. Aggregate provenance fidelity was `0.8796`, making provenance preservation the clearest observed weakness in Trial 001.

## Interpretation

This is a useful result precisely because it is not uniformly perfect.

The operational state, unresolved commitments, revision relationship and resistance to a misleading derived summary transferred consistently across the two model families. The shared provenance omission suggests that model-independent continuity may require the reconstruction contract to make full evidence-path preservation more explicit rather than assuming a cognition engine will infer that requirement from the event semantics alone.

That observation should inform a future benchmark iteration, but Trial 001 itself must remain unchanged. Any revised prompt/schema or provenance-specific experiment should be a separately versioned and preregistered trial.

## Initialization boundary

Trial 001 did not initialize Cairn. All histories, outputs and reports are synthetic benchmark evidence and remain disposable without changing anything Cairn knows, remembers or could reconstruct.
