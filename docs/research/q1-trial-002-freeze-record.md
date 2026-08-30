# Q1 Trial 002 — Frozen Package Record

**Status:** Frozen; no eligible external Trial 002 engine responses captured at time of this record  
**Date:** 2026-08-30  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Methodological ordering

Trial 002 was preregistered before fixture construction. The preregistration is:

`docs/research/q1-trial-002-preregistration.md`

The Trial 002 fixture, scorer, CLI and CI workflow were created only after that preregistration commit.

## Pre-freeze self-test failure

The first Trial 002 CI attempt stopped at the scorer self-test and did **not** freeze or upload a Trial 002 prompt package.

Cause: the initial catastrophic-failure heuristic marked a perfect transition-spanning reference response as `indiscriminate_full_history_citation` because the response cited every event in that case. In that case, however, every history event was legitimately part of at least one expected provenance path.

Correction: the heuristic was narrowed so full-history citation is catastrophic only when the history contains at least one event that is not part of any expected provenance path and the candidate nevertheless cites every history event.

This correction changed no preregistered research question, hypothesis, target threshold, benchmark ground truth, model-facing reconstruction contract or external model result. No eligible external model had received any Trial 002 package before the correction.

## Validated freeze

The corrected Trial 002 self-test passed in GitHub Actions and only then produced the frozen package.

- branch head SHA: `bbe60105454166c6b5fccb0abec789c71f850f4c`
- GitHub Actions run: `33304330111`
- workflow: `Q1 Trial 002 Provenance Benchmark`
- workflow conclusion: `success`
- frozen artifact name: `q1-trial-002-frozen-prompt-package`
- artifact ID: `9729958852`
- artifact ZIP digest: `sha256:1a6ff6dc17129c27de34aea8feb152d7fdde37297dd522c2b98255507ee009d1`
- frozen prompt-package SHA-256: `d7e8f150952f742b8aeb9124f633f3469fa65a15941265647aeaddc3ffac766e`
- artifact retention expiry: `2026-11-28`

The artifact manifest records the pull-request merge-ref checkout commit used by GitHub Actions:

`c9cc2059b2e8f042f8cdac57aa440280cd2bada4`

The artifact metadata independently ties the run to branch head:

`bbe60105454166c6b5fccb0abec789c71f850f4c`

## Frozen package rule

The JSON package identified by SHA-256

`d7e8f150952f742b8aeb9124f633f3469fa65a15941265647aeaddc3ffac766e`

is the only eligible Trial 002 package for the first Trial 002 model arms.

It must not be regenerated, edited, reformatted or replaced between eligible model arms.

Any future change to fixture data, reconstruction contract, response schema, ground truth, scorer behavior or thresholds requires a new separately versioned trial rather than alteration of this frozen Trial 002 package.

## Initialization boundary

Nothing in the freeze process initializes Cairn or creates authoritative Cairn identity, history, memory, commitments, checkpoints, provenance state, genesis data, Commit Gate state or inference-runtime state.

All Trial 002 material remains synthetic benchmark evidence and is deletable without changing anything Cairn knows, remembers or could reconstruct.
