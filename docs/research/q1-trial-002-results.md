# Q1 Trial 002 — Provenance Portability Results

**Status:** Technically complete with two blinded model-family arms; third arm strongly preferred and pending  
**Date:** 2026-08-30  
**Benchmark:** Cairn Q1 Trial 002 provenance portability  
**Boundary:** Synthetic, disposable, non-authoritative benchmark data only

## Frozen experiment

Trial 002 was preregistered before fixture construction. The six-case suite, scorer, reconstruction contract and engineering thresholds were then fixed before any eligible external model saw the frozen prompt package.

- dataset hash: `6b3eeac5842c09fe97f1e91356800b7bc8a738320ae36b83def57f3e1b853bb7`
- frozen prompt-package SHA-256: `d7e8f150952f742b8aeb9124f633f3469fa65a15941265647aeaddc3ffac766e`
- original validated freeze run: `33304330111`
- original frozen-package artifact ID: `9729958852`

The initial Trial 002 CI self-test failed before any prompt package was frozen because a scorer guardrail incorrectly treated an all-relevant transition history as indiscriminate full-history citation. The guardrail was corrected before external execution; no hypothesis, fixture ground truth, metric, threshold or model-facing reconstruction contract changed.

## Blinded engine arms

### Arm A — Google Gemini

- engine id returned: `gemini/gemini-2.5-flash`
- provider returned: `google`
- version returned: `2.5`
- raw response: `evidence/q1-trial-002/raw/gemini-2.5-flash.json`
- raw response SHA-256: `4629691455ac4f6e1731d2d4f9b27713b476586353b3556550e987524496f3d3`

### Arm B — Anthropic Claude

- engine id returned: `anthropic/claude-sonnet-5`
- provider returned: `anthropic`
- version returned: `claude-sonnet-5`
- raw response: `evidence/q1-trial-002/raw/claude-sonnet-5.json`
- raw response SHA-256: `165dcf85539a6a6ad7aeb68a21480bf40fbf324bf147d525cb6b54e7144e33ab`

Both arms were run manually in fresh web-interface sessions using only the same frozen prompt package and minimal transport instructions. Provider-side request IDs and exact provider-side execution timestamps were therefore unavailable and are not reconstructed after the fact.

## Reproducible scoring

The checked-in raw first responses were scored by the already-committed Trial 002 scorer in GitHub Actions. No prompt, fixture, hidden ground truth, metric, threshold or scoring rule was changed after either response was observed.

- scoring run: `33304767199`
- report artifact: `q1-trial-002-report`
- artifact ID: `9730097305`
- artifact ZIP digest: `sha256:2224d419d2cef408e3cb8d769564ab9c2a851c75f3930109584ffed1bfcb06ef`
- generated report SHA-256: `aaa4e2019f13855d1cac70beecc527cef869735d32ff7e6b66dc1efc29fd14f3`

All six sealed synthetic histories passed suite-integrity verification. The complete workflow and application build completed successfully.

## Aggregate results

| Metric | Gemini 2.5 Flash | Claude Sonnet 5 |
| --- | ---: | ---: |
| State F1 | 1.0000 | 1.0000 |
| Commitment F1 | 1.0000 | 1.0000 |
| Revision fidelity F1 | 1.0000 | 1.0000 |
| Resumption consistency | 1.0000 | 1.0000 |
| Unsupported state claims | 0 | 0 |
| Provenance event precision | 1.0000 | 1.0000 |
| Provenance event recall | 0.9583 | 1.0000 |
| Provenance event F1 | 0.9722 | 1.0000 |
| Complete-path recovery rate | 0.9000 | 1.0000 |
| Terminal-only compression rate | 0.1667 | 0.0000 |
| Irrelevant-evidence inclusion rate | 0.0000 | 0.0000 |
| Provenance role accuracy | 0.9091 | 0.9545 |
| Catastrophic failures | 0 | 0 |

Pairwise aggregate divergence:

- state-value divergence: `0.0000`
- commitment divergence: `0.0000`
- revision divergence: `0.0000`
- provenance-set divergence: `0.0278`
- provenance-role divergence: `0.0944`
- overall divergence: `0.0070`

## Pre-registered target assessment

The preregistered engine-level targets were:

- state F1 `>= 0.95`;
- unresolved-commitment F1 `>= 0.95`;
- provenance event F1 `>= 0.95`;
- complete-path recovery rate `>= 0.90`;
- terminal-only compression rate `<= 0.10`;
- irrelevant-evidence inclusion rate `<= 0.10`;
- zero unsupported state keys.

### Claude Sonnet 5

Claude met every preregistered engine-level target.

### Gemini 2.5 Flash

Gemini met the state, commitment, provenance-F1, complete-path, irrelevant-evidence and unsupported-state targets, but did **not** meet the terminal-only compression target. Its aggregate compression rate was `0.1667`, above the preregistered maximum of `0.10`.

The miss occurred in `q1t2-transition-spanning`. Gemini recovered unresolved commitment `C-401` correctly but cited only its origin event `p402`. The benchmark's minimum sufficient provenance path also requires continuity handoff event `p404`, because that event establishes that the unresolved commitment crossed the simulated host/model transition intact.

This was not classified as catastrophic under the preregistered case checks because the commitment itself was retained and the authoritative deployment adjudication was not omitted.

## Additional role observations

Both engines recovered the exact expected provenance event set for `q1t2-superseded-source`, but each assigned one evidence role differently from the ground truth. The event set was complete; the semantic role taxonomy was less stable than the event membership.

Role accuracy was a preregistered reported metric but not an engine-level pass/fail threshold.

## Cross-model portability assessment after two arms

The preregistered cross-model portability result requires at least two materially different eligible model families to each meet all engine-level targets and aggregate pairwise provenance-set divergence `<= 0.10`.

The pairwise provenance-set divergence target was met (`0.0278`). However, only Claude currently meets every engine-level target because Gemini exceeds the terminal-only compression limit.

Therefore **the two-arm Trial 002 result does not yet meet the preregistered cross-model portability engineering target**.

This is a partial positive result, not a failed experiment:

- both engines reconstructed the same operational state perfectly;
- both preserved substantially more provenance than in Trial 001;
- both excluded irrelevant neighbor events;
- neither followed the misleading derived summary;
- neither dropped an unresolved commitment;
- neither produced an unsupported state claim;
- neither triggered a catastrophic-failure condition;
- Claude demonstrated complete provenance-path recovery across all six controlled cases;
- Gemini exposed a narrower remaining weakness around carrying commitment provenance across a simulated continuity handoff.

## Third-arm rationale

The preregistration strongly preferred a third materially different model family. After the two-arm result, that arm is especially informative but must not be used to alter the frozen experiment.

The third engine must receive the same frozen prompt package and must remain blinded to Gemini's response, Claude's response, the scorer, hidden ground truth, expected scores and this results document until its raw first response is captured and hashed.

If a third materially different eligible model family meets every engine-level target, Trial 002 will then have at least two independently passing model families. The complete multi-arm pairwise divergence must still be reported without excluding Gemini's partial result.

## Interpretation

Trial 001 showed that materially different model families could agree on operational state while independently compressing multi-event provenance.

Trial 002 shows that an explicit model-independent provenance reconstruction contract can materially improve that behavior in controlled synthetic cases. One model achieved complete event-path recovery and the other achieved high event-level provenance fidelity but still compressed one transition-spanning commitment path.

That distinction is architecturally useful: provenance portability appears tractable, but transition semantics may need to be represented explicitly enough that a replacement cognition engine does not treat an unresolved commitment's origin event as sufficient evidence that the commitment survived a continuity handoff.

Trial 002 itself remains frozen. Any architectural change or revised contract belongs to a separately versioned future experiment.

## Initialization boundary

Trial 002 did not initialize Cairn. All histories, responses, hashes and reports are synthetic benchmark evidence and remain deletable without changing anything Cairn knows, remembers or could reconstruct.
