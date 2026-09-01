# Q3 Trial 001 Preregistration — Structured Continuity vs. Long Context

**Trial ID:** Q3-T001  
**Status:** Preregistered before implementation and before any eligible model sees the benchmark package  
**Research phase:** Pre-genesis, synthetic, disposable, explicitly non-authoritative  
**Parent plan:** `docs/research/phase-i-validation-plan.md`  

> **Hard boundary:** This trial must not initialize Cairn or create authoritative Cairn identity, memory, history, commitments, provenance, checkpoints, genesis data, Commit Gate state, or inference-runtime state. It must not modify `/srv/cairn`, the Cairn VPS, FreeSWITCH, or production infrastructure. Every event, checkpoint, assertion, commitment, corruption, and recovery target used here is synthetic benchmark material that can be deleted without changing anything Cairn knows or could reconstruct.

## 1. Research question

**Does structured, source-linked continuity provide measurable reliability, provenance, recovery, auditability, and scaling advantages over a brute-force long-context approach when both conditions receive the same underlying source material and are evaluated under model migration, contradictory evidence, corruption, and recovery pressure?**

The trial is intended to test a real competing explanation rather than assume Cairn-style infrastructure is necessary. A large-context model may be able to reconstruct operational state directly from raw history. If it can match structured continuity on the properties Cairn is designed to provide while remaining materially simpler or cheaper, that is a meaningful negative result and must be preserved.

## 2. What this trial is not testing

Q3-T001 does **not** test:

- consciousness, subjective identity, personhood, or moral status;
- whether a replacement model behaves identically to a prior model;
- production durability over real years;
- production security certification;
- a claim that hashes or append-only storage make source material true;
- a claim that structured continuity must beat long context on every latency or cost measure;
- an initialized Cairn runtime.

The target is narrower: model-independent reconstruction of predefined operational state and its evidentiary path under controlled conditions.

## 3. Conditions

Each eligible cognition engine receives the same synthetic case content and the same task/output contract in a fresh session.

### Condition A — Brute-force long-context baseline

The engine receives the synthetic historical record as raw or lightly formatted chronological history.

Allowed:

- stable event identifiers;
- timestamps and actor labels that are intrinsic to the synthetic source record;
- ordinary headings or separators needed to make the input readable;
- the same task instructions and output schema used in Condition B.

Not allowed:

- precomputed authoritative-state tables;
- Cairn-style provenance graphs;
- checkpoint manifests;
- dependency indexes;
- precomputed unresolved-commitment sets;
- cryptographic verification results;
- selective evidence bundles chosen using the hidden ground truth.

The baseline must not be deliberately handicapped by confusing formatting, missing source material, a weaker model, a smaller output budget, or weaker task instructions.

### Condition B — Structured continuity

The engine receives a structured reconstruction package derived from the same synthetic source record. The package may include:

- authoritative events separated from derived interpretation;
- explicit source/provenance links;
- content-addressed original identifiers;
- verified checkpoint material;
- explicit current-state assertions and unresolved commitments;
- revision/supersession relationships;
- dependency-aware relevant-evidence bundles;
- integrity-verification status produced by deterministic benchmark code.

Condition B may reduce model input by selecting evidence through deterministic structured dependencies. That reduction is a property being measured, not hidden work. All selection and verification work must be counted and reported separately.

## 4. Fair-baseline rules

The following rules are fixed before implementation:

1. **Same underlying facts.** Neither condition may receive a fact that is absent from the common synthetic source history.
2. **Same target engine per paired comparison.** A paired A/B trial uses the same provider, model/version, temperature or equivalent stochastic setting, output budget, and task/output schema.
3. **Fresh sessions.** No eligible engine may carry benchmark-specific memory or prior trial answers into a measured arm.
4. **Same questions.** State, commitment, provenance, revision, and recovery questions are identical across paired conditions except where an integrity-specific field is not representable in Condition A.
5. **No answer-bearing formatting advantage.** Structured representation may encode relationships, but it may not contain hidden ground-truth labels such as `correct_answer`, scorer labels, expected F1 values, or outcome classifications.
6. **No post-result prompt tuning.** Prompts are frozen before the first eligible model arm is run. Any later prompt change creates a new trial/version and cannot replace this result.
7. **No cherry-picking engines.** Engine eligibility and the selected engine list are frozen before measured model runs. Partial or failed eligible arms remain in the evidence record.
8. **No dropping difficult cases.** The benchmark case list is frozen before measured model runs. Invalid cases caused by benchmark defects may be excluded only with a documented defect record; exclusions may not depend on model performance.
9. **Comparable retrieval opportunity.** For the primary within-context comparison, Condition A receives the complete raw history that fits the frozen context envelope. Condition B may use structured selection. For histories that exceed the raw context envelope, an additional generic-retrieval baseline may be reported separately, but it must not be silently substituted for the registered brute-force baseline.
10. **Infrastructure and cognition metrics remain separate.** Deterministic hash/checkpoint verification is not scored as model reasoning. Model inference about contradictory or suspicious records is reported separately from deterministic integrity detection.

## 5. Benchmark construction

A new Q3 synthetic benchmark package will be generated only after this preregistration commit exists.

The generator must create histories containing at minimum:

- authoritative facts and state transitions;
- unresolved commitments and deadlines;
- completed commitments;
- superseded commitments;
- corrections that append rather than erase prior history;
- source evidence with explicit actors and times;
- derived summaries, including some incomplete summaries;
- contradictory but resolvable evidence;
- ambiguous evidence where the correct result is explicitly `uncertain` rather than forced;
- model/provider transition markers;
- host/infrastructure transition markers;
- duplicates/replays;
- irrelevant historical material;
- dependencies spanning short and long historical distances.

The hidden scorer record must define, for every measured case:

- authoritative state assertions;
- unresolved commitments;
- required minimum provenance paths;
- superseded evidence that must not remain authoritative;
- acceptable uncertainty cases;
- corruption/recovery expectations;
- relevant evidence/event identifiers.

### Dataset freeze

Before the first eligible model receives any Q3 case, a freeze record must preserve:

- generator commit SHA;
- random seed(s);
- serialized benchmark package SHA-256;
- hidden ground-truth SHA-256;
- prompt package SHA-256;
- scorer commit SHA;
- exact case count;
- selected engine list and eligibility rationale;
- context-load profiles used for the primary and stress comparisons.

Raw first model responses must be preserved before scoring.

## 6. Context-load profiles

Q3 must test both ordinary within-context operation and context pressure.

Exact event counts are not registered here because event serialization density and selected model context limits can vary. Instead, the freeze record must choose deterministic profiles against the smallest usable context window among the selected engines.

Required primary profiles:

- **LOW:** raw Condition A history occupies approximately 20–30% of the smallest selected engine context envelope before output reservation;
- **MEDIUM:** approximately 45–55%;
- **HIGH:** approximately 75–85%.

Required stress profile:

- **OVERFLOW:** raw history exceeds the smallest selected engine's practical input envelope after preserving the registered output budget.

The generator must grow history deterministically until the registered serialized/tokenized envelope is reached. Exact token counts by engine must be reported.

The primary A/B scientific comparison is LOW/MEDIUM/HIGH, where both conditions can be supplied without truncating the registered raw history.

OVERFLOW is a scaling/stress result. If raw Condition A cannot be supplied in full, that fact is itself reported; a separate generic-retrieval baseline may be measured but must be labeled separately.

## 7. Required scenario families

Each context profile must include a frozen distribution of cases covering the following scenario families where applicable:

1. clean recovery;
2. model replacement;
3. provider replacement;
4. late correction of an earlier fact;
5. unresolved commitment carried across transition;
6. contradictory evidence with a defined authoritative resolution;
7. intentionally incomplete or stale derived summary;
8. duplicate/replayed event;
9. deletion of a protected event in a corrupted copy;
10. mutation of protected event content in a corrupted copy;
11. event reorder/insertion in a corrupted copy;
12. corrupted checkpoint or derived state;
13. missing derived memory with intact originals;
14. abrupt-termination recovery from the latest valid reconstruction point;
15. long-distance provenance where required evidence is far from the terminal event;
16. uncertainty case where the evidence does not justify a single authoritative answer.

Not every corruption scenario is expected to be detectable by model inference in Condition A. That difference must be measured rather than hidden.

## 8. Engine eligibility

At least two materially different cognition-engine families are required for the primary cross-engine conclusion.

An eligible engine must:

- be available through a reproducible API or controlled invocation path;
- support the registered task and output format;
- expose or document a context envelope sufficient for the required primary profiles;
- be run in a fresh benchmark session;
- have model/provider/version recorded.

A third engine may be included. If included before the freeze, its result remains part of the evidence package even if it performs poorly or incompletely.

## 9. Outputs required from each cognition engine

For every measured case the engine must return a machine-scoreable structure containing:

- current authoritative state assertions;
- unresolved commitments;
- superseded or revised assertions that must not be treated as current;
- provenance/source event identifiers supporting each current assertion and commitment;
- explicit `uncertain` findings where evidence is insufficient;
- detected contradictions or integrity concerns visible from the supplied material;
- recovery/resumption decision required by the case.

The output schema will be frozen before measured runs.

## 10. Primary metrics

### Cognition/reconstruction metrics

| Metric | Definition |
| --- | --- |
| State F1 | Precision/recall/F1 against predefined authoritative state |
| Commitment F1 | Precision/recall/F1 for unresolved commitments |
| Provenance event F1 | Recovery of required supporting evidence identifiers |
| Complete-path recovery | Fraction of assertions/commitments with the complete minimum evidentiary path |
| Revision fidelity | Correct treatment of superseded evidence and appended corrections |
| Unsupported-claim rate | Assertions not supported by supplied authoritative evidence |
| Uncertainty accuracy | Correct abstention when the ground truth is intentionally unresolved |
| Resumption consistency | Correct recovery/resume decision from the predefined baseline |

### Integrity/system metrics

| Metric | Definition |
| --- | --- |
| Mutation detection | Deterministic detection of protected event mutation |
| Deletion/reorder/insertion detection | Deterministic integrity failure detection |
| Replay/duplicate handling | Correct detection or idempotent treatment of duplicates |
| Corrupt-checkpoint rejection | Rejection/fallback from invalid structured checkpoint material |
| Silent false verification | Corrupted material accepted as verified; catastrophic if nonzero |

### Efficiency metrics

| Metric | Definition |
| --- | --- |
| Input tokens | Total model input tokens per task/recovery |
| Output tokens | Total model output tokens |
| End-to-end latency | Wall-clock request/recovery latency |
| Model/API cost | Recorded provider cost where available |
| Pre-model reconstruction time | Structured selection/verification time before model call |
| Events/evidence supplied | Count and fraction of lifetime history given to model |
| Peak host memory | Where benchmark harness measurement is available |

Infrastructure preprocessing cost for Condition B must not be omitted. The trial must report model-input savings and the cost required to produce them.

## 11. Primary hypotheses and decision rules

Q3-T001 does not use a single winner-take-all metric.

### H1 — Operational-state non-inferiority

At LOW/MEDIUM/HIGH context profiles, structured continuity should not materially degrade authoritative-state or unresolved-commitment recovery relative to the paired long-context baseline.

Registered non-inferiority margin:

- paired aggregate State F1 difference `B - A >= -0.02`;
- paired aggregate Commitment F1 difference `B - A >= -0.02`.

### H2 — Provenance advantage

Structured continuity is expected to improve complete evidentiary-path recovery.

Registered engineering target:

- at least two materially different engine families achieve complete-path recovery `>= 0.95` in Condition B across the primary profiles; and
- for those engines, Condition B exceeds paired Condition A complete-path recovery by at least `0.10` absolute **or** Condition A already achieves `>= 0.95`, in which case the result is reported as baseline parity rather than forced superiority.

This parity clause is deliberate: if brute-force context already preserves provenance extremely well, the trial must say so.

### H3 — Integrity advantage

For corruption classes covered by deterministic structured verification:

- Condition B silent false-verification count must be `0`;
- protected mutation/deletion/reorder/insertion probes must be detected by the deterministic verification path;
- corrupted checkpoints must be rejected or fall back to a valid reconstruction path without producing a falsely verified authoritative result.

Condition A model inference about tampering is measured separately and is not expected to provide cryptographic guarantees.

### H4 — Context-efficiency advantage

At the HIGH profile, Condition B should reduce median model input tokens by at least `50%` relative to the complete-history Condition A baseline while meeting H1.

If it does not, the structured-selection efficiency claim is not supported for this workload even if provenance/integrity benefits remain.

### H5 — Context-pressure resilience

At OVERFLOW, the trial must report whether complete raw history can be supplied to each engine without violating the frozen output reserve.

Condition B is considered to support bounded context-pressure recovery for the synthetic workload if:

- it reconstructs State F1 `>= 0.95`;
- Commitment F1 `>= 0.95`;
- complete-path recovery `>= 0.90`;
- and uses a model input that remains within the frozen context envelope.

Any generic-retrieval baseline used for OVERFLOW is reported separately and receives the same source corpus and task contract.

## 12. Catastrophic failures

The following are never averaged away:

- a corrupted structured package is reported as verified when its protected integrity checks should fail;
- a superseded commitment is treated as current and would cause the benchmark's defined consequential action;
- a required unresolved commitment disappears entirely after migration/recovery;
- source/provenance identifiers are fabricated rather than present in supplied material;
- hidden ground truth or scorer labels leak into an engine prompt;
- measured model responses are modified before preservation/scoring.

Each catastrophic failure must be reported individually.

## 13. Repetitions and statistical treatment

For deterministic infrastructure checks, each frozen corruption probe is executed at least once per applicable case/package, with pass/fail counts preserved.

For stochastic cognition-engine behavior:

- at least 5 measured repetitions per engine/condition/profile after any explicitly documented warm-up where provider behavior makes repetition meaningful;
- paired A/B trials use the same frozen case set;
- medians and distributions are reported, not only best runs;
- 95% bootstrap confidence intervals are reported for aggregate paired differences where sample size supports them;
- worst-case and catastrophic outcomes are listed separately;
- no run is discarded solely because the model output is malformed. Malformed output is scored according to the frozen scorer policy.

If provider cost makes five repetitions infeasible for a frozen engine, the shortfall must be documented before interpreting the result and the engine cannot silently be treated as satisfying the full registered design.

## 14. Corruption protocol

Corrupted benchmark copies must be derived mechanically from the frozen clean package after the clean package hash is recorded.

Required corruption operators:

- mutate protected event payload;
- delete protected event;
- reorder protected events;
- insert unauthorized event;
- duplicate/replay event;
- alter derived summary while originals remain intact;
- alter checkpoint/manifest material;
- remove derived memory while preserving originals.

The corruption generator seed and output hashes must be preserved.

The original clean package must never be overwritten by corruption generation.

## 15. Hidden-work accounting

Condition B may perform verification, checkpoint loading, dependency traversal, and evidence selection before the cognition-engine call. This work must be measured explicitly.

At minimum report:

- number of historical records inspected by each preprocessing stage;
- number of records supplied to the model;
- bytes/tokens read where measurable;
- preprocessing wall-clock time;
- verification wall-clock time;
- index/checkpoint storage overhead;
- fallback work after corruption.

A result may not claim bounded recovery merely because model input is small if preprocessing secretly scans/replays the complete history on every task. Any full-history scan must be visible in the report.

## 16. Implementation ordering

The required ordering is:

1. this preregistration commit;
2. benchmark generator and hidden ground truth;
3. prompt/output schema and scorer;
4. self-tests;
5. benchmark/package freeze record with hashes and engine list;
6. raw baseline dry-run used only to validate mechanics, if needed, with cases kept separate from measured evidence or explicitly designated before exposure;
7. first eligible measured model arm;
8. preservation of raw first responses;
9. scoring and comparison;
10. results document containing positive, partial, negative, and failed arms.

No measured Q3 result may predate the freeze record.

## 17. Required evidence package

A completed Q3-T001 evidence package must include:

- this preregistration;
- benchmark generator/version;
- frozen synthetic history package and hash;
- hidden ground truth hash;
- corruption package hashes;
- frozen prompts/output schema and hash;
- scorer and scorer self-tests;
- engine eligibility/freeze record;
- raw first responses for every eligible arm;
- scored per-case outputs;
- paired A/B aggregate report;
- efficiency/hidden-work report;
- integrity/corruption report;
- environment/provider/model/version record;
- complete results narrative with limitations;
- claim matrix separating demonstrated, partially demonstrated, not demonstrated, and out-of-scope properties.

## 18. Negative-result policy

Negative or inconvenient findings remain part of the record.

Examples:

- long context matches structured provenance;
- structured continuity adds too much preprocessing or storage cost;
- selective reconstruction omits evidence needed by the model;
- a model family performs worse with structured packaging;
- the generic retrieval baseline performs as well as structured continuity;
- corruption detection works at the systems layer but cognition reconstruction still fails;
- context-pressure benefit appears only at impractically large histories.

No such result may be removed because it weakens a commercial narrative.

## 19. Claim boundary if successful

Even a fully successful Q3-T001 would support only a controlled synthetic result, approximately:

> In the preregistered Q3 synthetic benchmark, structured, source-linked continuity preserved operational state while improving specified provenance, integrity, recovery, or context-efficiency measures relative to the registered brute-force long-context baseline, with the reported model, workload, and scaling limits.

It would **not** establish production reliability, real multi-year continuity, consciousness, identity persistence, universal model portability, or immunity to false-but-authentic source records.

## 20. Immediate next step after this preregistration

Do not run Q3 yet.

The next allowed research work is to implement the synthetic benchmark generator, hidden ground truth, paired prompt/output schema, deterministic integrity checks, scorer self-tests, and package-freeze mechanism on this research branch. The benchmark package and eligible engine list must then be frozen and hashed before the first measured model arm is exposed to it.
