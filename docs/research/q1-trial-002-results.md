# Q1 Trial 002 — Provenance Portability Results

**Status:** Complete  
**Date:** 2026-08-30  
**Benchmark family:** Cairn Q1 cross-model continuity  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Research question

Can materially different cognition engines reconstruct not only the same authoritative operational state, but also the complete minimum evidentiary path that makes each recovered state assertion or unresolved commitment authoritative?

Trial 002 was preregistered before fixture construction. The validated prompt package was frozen before any eligible model arm received it.

## Frozen package

- Prompt SHA-256: `d7e8f150952f742b8aeb9124f633f3469fa65a15941265647aeaddc3ffac766e`
- Dataset hash: `6b3eeac5842c09fe97f1e91356800b7bc8a738320ae36b83def57f3e1b853bb7`
- Freeze artifact: `q1-trial-002-frozen-prompt-package`
- Original freeze artifact ID: `9729958852`
- Original freeze artifact ZIP digest: `sha256:1a6ff6dc17129c27de34aea8feb152d7fdde37297dd522c2b98255507ee009d1`

The first Trial 002 CI attempt stopped before freezing because the scorer self-test detected a false positive in the indiscriminate-full-history guardrail. That heuristic was corrected before any model saw a Trial 002 package. The preregistered research question, thresholds, case classes and ground truth were not changed.

## Eligible blinded arms

### Arm A — Google Gemini 2.5 Flash

- Engine identifier: `gemini/gemini-2.5-flash`
- Provider: Google
- Version reported by response: `2.5`
- Raw first response retained at `evidence/q1-trial-002/raw/gemini-2.5-flash.json`
- Raw-response SHA-256: `4629691455ac4f6e1731d2d4f9b27713b476586353b3556550e987524496f3d3`

### Arm B — Anthropic Claude Sonnet 5

- Engine identifier: `anthropic/claude-sonnet-5`
- Provider: Anthropic
- Version reported by response: `claude-sonnet-5`
- Raw first response retained at `evidence/q1-trial-002/raw/claude-sonnet-5.json`
- Raw-response SHA-256: `165dcf85539a6a6ad7aeb68a21480bf40fbf324bf147d525cb6b54e7144e33ab`

### Arm C — xAI Grok 4.5

- Engine identifier: `xai/grok-4.5`
- Provider: xAI
- Version reported by response: `1.0`
- Raw first response retained at `evidence/q1-trial-002/raw/grok-4.5.json`
- Raw-response SHA-256: `b1fe148e5b21ae04ff38e56d5950501bc53d1c4d597019ab187fa515d5e9596b`

All three arms were run manually in fresh provider web sessions. Provider-side API execution timestamps and sampling controls were therefore not available beyond what was exposed to the operator. No arm saw another arm's output before its first response was captured.

## CI-scored aggregate results

| Metric | Gemini 2.5 Flash | Claude Sonnet 5 | Grok 4.5 |
| --- | ---: | ---: | ---: |
| State F1 | 1.0000 | 1.0000 | 1.0000 |
| Commitment F1 | 1.0000 | 1.0000 | 1.0000 |
| Revision fidelity F1 | 1.0000 | 1.0000 | 1.0000 |
| Resumption consistency | 1.0000 | 1.0000 | 1.0000 |
| Unsupported state claims | 0 | 0 | 0 |
| Provenance event precision | 1.0000 | 1.0000 | 1.0000 |
| Provenance event recall | 0.9583 | 1.0000 | 1.0000 |
| Provenance event F1 | 0.9722 | 1.0000 | 1.0000 |
| Complete-path recovery rate | 0.9000 | 1.0000 | 1.0000 |
| Terminal-only compression rate | 0.1667 | 0.0000 | 0.0000 |
| Irrelevant-evidence inclusion rate | 0.0000 | 0.0000 | 0.0000 |
| Provenance-role accuracy | 0.9091 | 0.9545 | 1.0000 |
| Catastrophic failures | 0 | 0 | 0 |

## Pre-registered target evaluation

The preregistered engine-level target required:

- state F1 `>= 0.95`;
- commitment F1 `>= 0.95`;
- provenance event F1 `>= 0.95`;
- complete-path recovery rate `>= 0.90`;
- terminal-only compression rate `<= 0.10`;
- irrelevant-evidence inclusion rate `<= 0.10`;
- zero unsupported state keys.

### Gemini 2.5 Flash

Gemini met every target except terminal-only compression. Its rate was `0.1667`, above the preregistered `0.10` maximum. The miss occurred in the transition-spanning case: Gemini correctly retained unresolved commitment `C-401` and cited its origin event `p402`, but omitted transition event `p404` from that commitment's provenance. It therefore recovered the correct operational state and commitment but did not preserve the complete transition-spanning evidentiary path.

Gemini also assigned event `p201` the role `conflicting_evidence` rather than the expected `supporting` role in the superseded-source case. This did not alter the recovered provenance set but reduced provenance-role accuracy.

**Engine-level target: not fully met.**

### Claude Sonnet 5

Claude met every preregistered engine-level target, including complete-path recovery `1.0000` and terminal-only compression `0.0000`.

Claude assigned `p201` the role `origin` rather than the expected `supporting` role in the superseded-source case. The complete provenance event set was nevertheless recovered. Provenance-role accuracy was `0.9545`. Role accuracy was a preregistered metric but did not have a numeric engine-level pass threshold.

**Engine-level target: met.**

### Grok 4.5

Grok matched the hidden ground truth on all scored operational and provenance dimensions, including provenance roles.

**Engine-level target: met.**

## Cross-model portability result

The preregistration required at least two materially different cognition-engine families to meet all engine-level targets and aggregate pairwise provenance-set divergence `<= 0.10`.

Claude Sonnet 5 and Grok 4.5 both met every engine-level target. Their aggregate pairwise provenance-set divergence was:

`0.0000`

Their aggregate state, commitment and revision divergence were also `0.0000`. Provenance-role divergence between Claude and Grok was `0.0667`, caused by the single `p201` role-label difference described above.

**Pre-registered cross-model provenance-portability target: met in the controlled synthetic Trial 002 suite.**

This is a controlled-case engineering result. It does not establish arbitrary real-world continuity, universal model equivalence, or perfect provenance portability at scale.

## Pairwise provenance-set divergence

- Gemini ↔ Claude: `0.0278`
- Gemini ↔ Grok: `0.0278`
- Claude ↔ Grok: `0.0000`

The Gemini divergence is localized to the omitted transition event on unresolved commitment `C-401`.

## Interpretation

Trial 001 showed that multiple cognition engines could reconstruct the same operational baseline while compressing multi-event provenance.

Trial 002 shows that, under an explicit provider-neutral reconstruction contract, complete minimum-sufficient provenance can be recovered across materially different cognition-engine families in controlled synthetic cases. Two independent families, Anthropic Claude Sonnet 5 and xAI Grok 4.5, met the full preregistered engine-level target and had zero provenance-set divergence.

The Gemini result remains important negative evidence. It indicates that even when state and commitment recovery are perfect, transition-spanning provenance can still be compressed by a cognition engine. This supports keeping transition provenance explicit in the continuity substrate or reconstruction package rather than assuming every replacement cognition engine will infer it reliably.

The role-label disagreement on `p201` also suggests that provenance-set portability can be stronger than provenance-role semantic portability. That distinction should remain visible in later experiments rather than being collapsed into a single score.

## Reproducibility

The three-arm comparison was generated in GitHub Actions using the already-committed Trial 002 scorer.

- GitHub Actions run: `33305670287`
- Report artifact: `q1-trial-002-report`
- Report artifact ID: `9730371000`
- Artifact ZIP digest: `sha256:3c6df719e9ac59962db6010afa3323f6ca3b57b19e7426369e9ccb1755ad6eec`
- Report JSON SHA-256: `f111f7f3ac9cf57a63921445e1414a27f8bd8927eb3d26c79d4bc6874c3f64bb`
- Workflow self-test: success
- Evidence scoring step: success
- Application build: success

## Completion

Trial 002 satisfies the preregistered technical completion criterion:

1. preregistration predates fixture construction and external runs;
2. the prompt package was frozen and hashed before eligible external runs;
3. three materially different blinded model-family arms returned raw first responses;
4. all responses were retained and hashed;
5. the committed scorer generated a reproducible CI report;
6. case-level misses and role disagreements are reported separately from aggregate scores.

Trial 002 is complete. Its frozen package, raw responses, scorer, ground truth, thresholds and results are retained as the permanent evidence record.

## Initialization boundary

Nothing in Trial 002 initializes Cairn or creates authoritative Cairn identity, memory, history, commitments, checkpoints, provenance state, genesis data, Commit Gate state or inference-runtime state.

All Trial 002 records remain synthetic benchmark material and deletable without changing anything Cairn knows, remembers or could reconstruct.
