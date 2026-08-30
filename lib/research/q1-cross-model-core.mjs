import { createHash } from 'node:crypto';

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : stableStringify(value)).digest('hex');
}

export function datasetHash(suite) {
  return sha256(suite);
}

export function sealHistory(history) {
  let previousChainHash = 'GENESIS-SYNTHETIC-BENCHMARK';
  return history.map((event) => {
    const eventHash = sha256(event);
    const chainHash = sha256(`${previousChainHash}:${eventHash}`);
    const sealed = {
      ...event,
      integrity: {
        event_hash: eventHash,
        previous_chain_hash: previousChainHash,
        chain_hash: chainHash,
      },
    };
    previousChainHash = chainHash;
    return sealed;
  });
}

export function verifySealedHistory(history) {
  let previousChainHash = 'GENESIS-SYNTHETIC-BENCHMARK';
  const failures = [];

  for (let index = 0; index < history.length; index += 1) {
    const sealed = history[index];
    const { integrity, ...event } = sealed;
    if (!integrity) {
      failures.push({ index, event_id: event.event_id ?? null, reason: 'missing_integrity' });
      continue;
    }

    const eventHash = sha256(event);
    const chainHash = sha256(`${previousChainHash}:${eventHash}`);

    if (integrity.event_hash !== eventHash) {
      failures.push({ index, event_id: event.event_id ?? null, reason: 'event_hash_mismatch' });
    }
    if (integrity.previous_chain_hash !== previousChainHash) {
      failures.push({ index, event_id: event.event_id ?? null, reason: 'previous_chain_hash_mismatch' });
    }
    if (integrity.chain_hash !== chainHash) {
      failures.push({ index, event_id: event.event_id ?? null, reason: 'chain_hash_mismatch' });
    }

    previousChainHash = integrity.chain_hash;
  }

  return { ok: failures.length === 0, failures };
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function setMetrics(expectedTokens, candidateTokens) {
  const expected = new Set(expectedTokens);
  const candidate = new Set(candidateTokens);
  let truePositive = 0;
  for (const token of candidate) if (expected.has(token)) truePositive += 1;
  const falsePositive = candidate.size - truePositive;
  const falseNegative = expected.size - truePositive;
  const precision = candidate.size ? truePositive / candidate.size : expected.size ? 0 : 1;
  const recall = expected.size ? truePositive / expected.size : candidate.size ? 0 : 1;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return {
    expected: expected.size,
    candidate: candidate.size,
    true_positive: truePositive,
    false_positive: falsePositive,
    false_negative: falseNegative,
    precision: round4(precision),
    recall: round4(recall),
    f1: round4(f1),
    exact: falsePositive === 0 && falseNegative === 0,
  };
}

function round4(value) {
  return Number(value.toFixed(4));
}

function stateToken(item) {
  return `${item?.key ?? ''}=${stableStringify(item?.value)}`;
}

function commitmentToken(item) {
  return String(item?.commitment_id ?? '');
}

function revisionToken(item) {
  return `${item?.original_event_id ?? ''}->${item?.correction_event_id ?? ''}`;
}

function evidenceF1(expectedIds, candidateIds) {
  return setMetrics(safeArray(expectedIds).map(String), safeArray(candidateIds).map(String)).f1;
}

function average(values) {
  return values.length ? round4(values.reduce((sum, value) => sum + value, 0) / values.length) : 1;
}

function provenanceScore(expected, candidate) {
  const candidateStates = new Map(safeArray(candidate.state_assertions).map((item) => [stateToken(item), item]));
  const candidateCommitments = new Map(safeArray(candidate.unresolved_commitments).map((item) => [commitmentToken(item), item]));
  const scores = [];

  for (const item of safeArray(expected.state_assertions)) {
    const recovered = candidateStates.get(stateToken(item));
    scores.push(recovered ? evidenceF1(item.evidence_event_ids, recovered.evidence_event_ids) : 0);
  }
  for (const item of safeArray(expected.unresolved_commitments)) {
    const recovered = candidateCommitments.get(commitmentToken(item));
    scores.push(recovered ? evidenceF1(item.evidence_event_ids, recovered.evidence_event_ids) : 0);
  }

  return average(scores);
}

export function scoreCase(groundTruth, candidate = {}) {
  const state = setMetrics(
    safeArray(groundTruth.state_assertions).map(stateToken),
    safeArray(candidate.state_assertions).map(stateToken),
  );
  const commitments = setMetrics(
    safeArray(groundTruth.unresolved_commitments).map(commitmentToken),
    safeArray(candidate.unresolved_commitments).map(commitmentToken),
  );
  const revisions = setMetrics(
    safeArray(groundTruth.revision_links).map(revisionToken),
    safeArray(candidate.revision_links).map(revisionToken),
  );

  const expectedStateKeys = new Set(safeArray(groundTruth.state_assertions).map((item) => item.key));
  const unsupportedStateKeys = safeArray(candidate.state_assertions)
    .map((item) => item?.key)
    .filter((key) => key && !expectedStateKeys.has(key));

  const baselineExact = state.exact && commitments.exact && revisions.exact;

  return {
    state_assertion_recovery: state,
    commitment_recovery: commitments,
    revision_fidelity: revisions,
    provenance_fidelity: provenanceScore(groundTruth, candidate),
    resumption_baseline_exact: baselineExact,
    unsupported_state_keys: unsupportedStateKeys,
  };
}

export function scoreEngine(suite, engineOutput) {
  const outputByCase = new Map(safeArray(engineOutput?.cases).map((item) => [item.case_id, item]));
  const cases = suite.cases.map((benchmarkCase) => {
    const candidate = outputByCase.get(benchmarkCase.case_id) ?? {};
    return {
      case_id: benchmarkCase.case_id,
      ...scoreCase(benchmarkCase.ground_truth, candidate),
    };
  });

  return {
    engine: engineOutput?.engine ?? { id: 'unspecified' },
    case_count: cases.length,
    cases,
    aggregate: {
      state_precision: average(cases.map((item) => item.state_assertion_recovery.precision)),
      state_recall: average(cases.map((item) => item.state_assertion_recovery.recall)),
      state_f1: average(cases.map((item) => item.state_assertion_recovery.f1)),
      commitment_precision: average(cases.map((item) => item.commitment_recovery.precision)),
      commitment_recall: average(cases.map((item) => item.commitment_recovery.recall)),
      commitment_f1: average(cases.map((item) => item.commitment_recovery.f1)),
      provenance_fidelity: average(cases.map((item) => item.provenance_fidelity)),
      revision_fidelity_f1: average(cases.map((item) => item.revision_fidelity.f1)),
      resumption_consistency: average(cases.map((item) => item.resumption_baseline_exact ? 1 : 0)),
      unsupported_state_claims: cases.reduce((sum, item) => sum + item.unsupported_state_keys.length, 0),
    },
  };
}

function jaccardDistance(aValues, bValues) {
  const a = new Set(aValues);
  const b = new Set(bValues);
  const union = new Set([...a, ...b]);
  if (!union.size) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return round4(1 - intersection / union.size);
}

function stateValueDivergence(aItems, bItems) {
  const a = new Map(safeArray(aItems).map((item) => [item.key, stableStringify(item.value)]));
  const b = new Map(safeArray(bItems).map((item) => [item.key, stableStringify(item.value)]));
  const keys = new Set([...a.keys(), ...b.keys()]);
  if (!keys.size) return 0;
  let differences = 0;
  for (const key of keys) if (a.get(key) !== b.get(key)) differences += 1;
  return round4(differences / keys.size);
}

export function pairwiseDivergence(suite, labeledOutputs) {
  const pairs = [];
  for (let left = 0; left < labeledOutputs.length; left += 1) {
    for (let right = left + 1; right < labeledOutputs.length; right += 1) {
      const a = labeledOutputs[left];
      const b = labeledOutputs[right];
      const aCases = new Map(safeArray(a.output.cases).map((item) => [item.case_id, item]));
      const bCases = new Map(safeArray(b.output.cases).map((item) => [item.case_id, item]));
      const caseResults = suite.cases.map((benchmarkCase) => {
        const aCase = aCases.get(benchmarkCase.case_id) ?? {};
        const bCase = bCases.get(benchmarkCase.case_id) ?? {};
        const state = stateValueDivergence(aCase.state_assertions, bCase.state_assertions);
        const commitments = jaccardDistance(
          safeArray(aCase.unresolved_commitments).map(commitmentToken),
          safeArray(bCase.unresolved_commitments).map(commitmentToken),
        );
        const revisions = jaccardDistance(
          safeArray(aCase.revision_links).map(revisionToken),
          safeArray(bCase.revision_links).map(revisionToken),
        );
        return {
          case_id: benchmarkCase.case_id,
          state_value_divergence: state,
          commitment_divergence: commitments,
          revision_divergence: revisions,
          overall_divergence: round4((state + commitments + revisions) / 3),
        };
      });
      pairs.push({
        engines: [a.label, b.label],
        cases: caseResults,
        aggregate_divergence: average(caseResults.map((item) => item.overall_divergence)),
      });
    }
  }
  return pairs;
}

export function buildPromptPackage(suite) {
  return {
    schema: 'cairn.q1-prompt-package.v1',
    benchmark_namespace: suite.benchmark_namespace,
    authoritative_cairn_state: false,
    dataset_hash: datasetHash(suite),
    instructions: [
      'These are synthetic benchmark records. They are not Cairn history and must not be persisted as authoritative state.',
      'Recover the current authoritative state assertions, unresolved commitments, and explicit correction relationships from each sealed history.',
      'Do not silently replace an original event with a correction; report the correction relationship.',
      'Do not treat a derived summary as authoritative merely because it appears later in the history.',
      'Return only the response schema requested for each case. Do not invent keys, commitments, event ids, or evidence.',
    ],
    response_schema: {
      schema: 'cairn.q1-engine-output.v1',
      engine: { id: 'provider/model-id', provider: 'provider-name', version: 'optional-version' },
      cases: [
        {
          case_id: 'case id from prompt',
          state_assertions: [{ key: 'state.key', value: 'recovered value', evidence_event_ids: ['event-id'] }],
          unresolved_commitments: [{ commitment_id: 'C-000', evidence_event_ids: ['event-id'] }],
          revision_links: [{ original_event_id: 'event-id', correction_event_id: 'event-id' }],
        },
      ],
    },
    cases: suite.cases.map((benchmarkCase) => ({
      case_id: benchmarkCase.case_id,
      title: benchmarkCase.title,
      history: sealHistory(benchmarkCase.history),
    })),
  };
}
