import {
  datasetHash,
  sealHistory,
  stableStringify,
  verifySealedHistory,
} from './q1-cross-model-core.mjs';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function round4(value) {
  return Number(value.toFixed(4));
}

function average(values) {
  return values.length ? round4(values.reduce((sum, value) => sum + value, 0) / values.length) : 1;
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

function stateToken(item) {
  return `${item?.key ?? ''}=${stableStringify(item?.value)}`;
}

function commitmentToken(item) {
  return String(item?.commitment_id ?? '');
}

function revisionToken(item) {
  return `${item?.original_event_id ?? ''}->${item?.correction_event_id ?? ''}`;
}

function provenanceEntries(item) {
  return safeArray(item?.provenance)
    .filter((entry) => entry && entry.event_id)
    .map((entry) => ({ event_id: String(entry.event_id), role: String(entry.role ?? '') }));
}

function provenanceIds(item) {
  return provenanceEntries(item).map((entry) => entry.event_id);
}

function provenanceMetrics(expectedItem, candidateItem) {
  return setMetrics(provenanceIds(expectedItem), provenanceIds(candidateItem));
}

function roleCounts(expectedItem, candidateItem) {
  const candidateRoles = new Map(provenanceEntries(candidateItem).map((entry) => [entry.event_id, entry.role]));
  const expected = provenanceEntries(expectedItem);
  let correct = 0;
  for (const entry of expected) {
    if (candidateRoles.get(entry.event_id) === entry.role) correct += 1;
  }
  return { correct, expected: expected.length };
}

function itemPairs(groundTruth, candidate) {
  const expectedStates = safeArray(groundTruth.state_assertions);
  const expectedCommitments = safeArray(groundTruth.unresolved_commitments);
  const candidateStates = new Map(safeArray(candidate.state_assertions).map((item) => [stateToken(item), item]));
  const candidateCommitments = new Map(safeArray(candidate.unresolved_commitments).map((item) => [commitmentToken(item), item]));

  return [
    ...expectedStates.map((expected) => ({
      kind: 'state',
      identity: stateToken(expected),
      expected,
      candidate: candidateStates.get(stateToken(expected)),
    })),
    ...expectedCommitments.map((expected) => ({
      kind: 'commitment',
      identity: commitmentToken(expected),
      expected,
      candidate: candidateCommitments.get(commitmentToken(expected)),
    })),
  ];
}

function provenanceSummary(groundTruth, candidate) {
  const pairs = itemPairs(groundTruth, candidate);
  const itemScores = pairs.map((pair) => ({
    kind: pair.kind,
    identity: pair.identity,
    ...provenanceMetrics(pair.expected, pair.candidate),
  }));

  let completePaths = 0;
  let terminalOnly = 0;
  let terminalEligible = 0;
  let roleCorrect = 0;
  let roleExpected = 0;

  for (const pair of pairs) {
    const metrics = provenanceMetrics(pair.expected, pair.candidate);
    if (metrics.exact) completePaths += 1;

    const expectedIds = [...new Set(provenanceIds(pair.expected))];
    const candidateIds = [...new Set(provenanceIds(pair.candidate))];
    const terminal = pair.expected?.terminal_authority_event_id;
    if (expectedIds.length > 1 && terminal) {
      terminalEligible += 1;
      if (candidateIds.length === 1 && candidateIds[0] === String(terminal)) terminalOnly += 1;
    }

    const roles = roleCounts(pair.expected, pair.candidate);
    roleCorrect += roles.correct;
    roleExpected += roles.expected;
  }

  const expectedByState = new Map(safeArray(groundTruth.state_assertions).map((item) => [stateToken(item), new Set(provenanceIds(item))]));
  const expectedByCommitment = new Map(safeArray(groundTruth.unresolved_commitments).map((item) => [commitmentToken(item), new Set(provenanceIds(item))]));
  let candidateCitationCount = 0;
  let irrelevantCitationCount = 0;

  for (const item of safeArray(candidate.state_assertions)) {
    const expected = expectedByState.get(stateToken(item)) ?? new Set();
    for (const eventId of new Set(provenanceIds(item))) {
      candidateCitationCount += 1;
      if (!expected.has(eventId)) irrelevantCitationCount += 1;
    }
  }
  for (const item of safeArray(candidate.unresolved_commitments)) {
    const expected = expectedByCommitment.get(commitmentToken(item)) ?? new Set();
    for (const eventId of new Set(provenanceIds(item))) {
      candidateCitationCount += 1;
      if (!expected.has(eventId)) irrelevantCitationCount += 1;
    }
  }

  return {
    items: itemScores,
    event_precision: average(itemScores.map((item) => item.precision)),
    event_recall: average(itemScores.map((item) => item.recall)),
    event_f1: average(itemScores.map((item) => item.f1)),
    complete_path_count: completePaths,
    expected_item_count: pairs.length,
    complete_path_recovery_rate: pairs.length ? round4(completePaths / pairs.length) : 1,
    terminal_only_count: terminalOnly,
    terminal_eligible_count: terminalEligible,
    terminal_only_compression_rate: terminalEligible ? round4(terminalOnly / terminalEligible) : 0,
    irrelevant_citation_count: irrelevantCitationCount,
    candidate_citation_count: candidateCitationCount,
    irrelevant_evidence_inclusion_rate: candidateCitationCount ? round4(irrelevantCitationCount / candidateCitationCount) : 0,
    role_correct_count: roleCorrect,
    role_expected_count: roleExpected,
    provenance_role_accuracy: roleExpected ? round4(roleCorrect / roleExpected) : 1,
  };
}

function candidateProvenanceUnion(candidate) {
  return new Set([
    ...safeArray(candidate.state_assertions).flatMap(provenanceIds),
    ...safeArray(candidate.unresolved_commitments).flatMap(provenanceIds),
  ]);
}

function catastrophicFailures(benchmarkCase, candidate, unsupportedStateKeys) {
  const failures = [];
  const checks = benchmarkCase.catastrophic_checks ?? {};
  const stateTokens = new Set(safeArray(candidate.state_assertions).map(stateToken));
  const commitments = new Set(safeArray(candidate.unresolved_commitments).map(commitmentToken));
  const cited = candidateProvenanceUnion(candidate);

  for (const token of safeArray(checks.forbidden_state_tokens)) {
    if (stateTokens.has(String(token))) {
      failures.push({ type: 'forbidden_state_recovered', token: String(token) });
    }
  }

  for (const commitmentId of safeArray(checks.required_unresolved_commitment_ids)) {
    if (!commitments.has(String(commitmentId))) {
      failures.push({ type: 'required_commitment_dropped', commitment_id: String(commitmentId) });
    }
  }

  for (const eventId of safeArray(checks.required_authority_event_ids)) {
    if (!cited.has(String(eventId))) {
      failures.push({ type: 'authority_event_omitted', event_id: String(eventId) });
    }
  }

  for (const key of unsupportedStateKeys) {
    failures.push({ type: 'unsupported_state_key', key });
  }

  const historyIds = safeArray(benchmarkCase.history).map((event) => String(event.event_id));
  if (historyIds.length > 1 && historyIds.every((eventId) => cited.has(eventId))) {
    failures.push({ type: 'indiscriminate_full_history_citation', event_count: historyIds.length });
  }

  return failures;
}

export function scoreCase(benchmarkCase, candidate = {}) {
  const groundTruth = benchmarkCase.ground_truth;
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

  const provenance = provenanceSummary(groundTruth, candidate);
  const catastrophic = catastrophicFailures(benchmarkCase, candidate, unsupportedStateKeys);

  return {
    state_assertion_recovery: state,
    commitment_recovery: commitments,
    revision_fidelity: revisions,
    provenance_recovery: provenance,
    resumption_baseline_exact: state.exact && commitments.exact && revisions.exact,
    unsupported_state_keys: unsupportedStateKeys,
    catastrophic_failures: catastrophic,
  };
}

export function scoreEngine(suite, engineOutput) {
  const outputByCase = new Map(safeArray(engineOutput?.cases).map((item) => [item.case_id, item]));
  const cases = suite.cases.map((benchmarkCase) => ({
    case_id: benchmarkCase.case_id,
    ...scoreCase(benchmarkCase, outputByCase.get(benchmarkCase.case_id) ?? {}),
  }));

  const totalComplete = cases.reduce((sum, item) => sum + item.provenance_recovery.complete_path_count, 0);
  const totalExpectedItems = cases.reduce((sum, item) => sum + item.provenance_recovery.expected_item_count, 0);
  const totalTerminal = cases.reduce((sum, item) => sum + item.provenance_recovery.terminal_only_count, 0);
  const totalTerminalEligible = cases.reduce((sum, item) => sum + item.provenance_recovery.terminal_eligible_count, 0);
  const totalIrrelevant = cases.reduce((sum, item) => sum + item.provenance_recovery.irrelevant_citation_count, 0);
  const totalCitations = cases.reduce((sum, item) => sum + item.provenance_recovery.candidate_citation_count, 0);
  const totalRoleCorrect = cases.reduce((sum, item) => sum + item.provenance_recovery.role_correct_count, 0);
  const totalRoleExpected = cases.reduce((sum, item) => sum + item.provenance_recovery.role_expected_count, 0);
  const catastrophicFailures = cases.flatMap((item) => item.catastrophic_failures.map((failure) => ({ case_id: item.case_id, ...failure })));

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
      revision_fidelity_f1: average(cases.map((item) => item.revision_fidelity.f1)),
      resumption_consistency: average(cases.map((item) => item.resumption_baseline_exact ? 1 : 0)),
      unsupported_state_claims: cases.reduce((sum, item) => sum + item.unsupported_state_keys.length, 0),
      provenance_event_precision: average(cases.map((item) => item.provenance_recovery.event_precision)),
      provenance_event_recall: average(cases.map((item) => item.provenance_recovery.event_recall)),
      provenance_event_f1: average(cases.map((item) => item.provenance_recovery.event_f1)),
      complete_path_recovery_rate: totalExpectedItems ? round4(totalComplete / totalExpectedItems) : 1,
      terminal_only_compression_rate: totalTerminalEligible ? round4(totalTerminal / totalTerminalEligible) : 0,
      irrelevant_evidence_inclusion_rate: totalCitations ? round4(totalIrrelevant / totalCitations) : 0,
      provenance_role_accuracy: totalRoleExpected ? round4(totalRoleCorrect / totalRoleExpected) : 1,
      catastrophic_failure_count: catastrophicFailures.length,
    },
    catastrophic_failures: catastrophicFailures,
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

function provenanceTokens(candidate, includeRoles) {
  const tokens = [];
  for (const item of safeArray(candidate.state_assertions)) {
    const identity = stateToken(item);
    for (const entry of provenanceEntries(item)) {
      tokens.push(`state|${identity}|${entry.event_id}${includeRoles ? `|${entry.role}` : ''}`);
    }
  }
  for (const item of safeArray(candidate.unresolved_commitments)) {
    const identity = commitmentToken(item);
    for (const entry of provenanceEntries(item)) {
      tokens.push(`commitment|${identity}|${entry.event_id}${includeRoles ? `|${entry.role}` : ''}`);
    }
  }
  return tokens;
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
        return {
          case_id: benchmarkCase.case_id,
          state_value_divergence: stateValueDivergence(aCase.state_assertions, bCase.state_assertions),
          commitment_divergence: jaccardDistance(
            safeArray(aCase.unresolved_commitments).map(commitmentToken),
            safeArray(bCase.unresolved_commitments).map(commitmentToken),
          ),
          revision_divergence: jaccardDistance(
            safeArray(aCase.revision_links).map(revisionToken),
            safeArray(bCase.revision_links).map(revisionToken),
          ),
          provenance_set_divergence: jaccardDistance(provenanceTokens(aCase, false), provenanceTokens(bCase, false)),
          provenance_role_divergence: jaccardDistance(provenanceTokens(aCase, true), provenanceTokens(bCase, true)),
        };
      }).map((item) => ({
        ...item,
        overall_divergence: round4((
          item.state_value_divergence +
          item.commitment_divergence +
          item.revision_divergence +
          item.provenance_set_divergence
        ) / 4),
      }));

      pairs.push({
        engines: [a.label, b.label],
        cases: caseResults,
        aggregate_state_divergence: average(caseResults.map((item) => item.state_value_divergence)),
        aggregate_commitment_divergence: average(caseResults.map((item) => item.commitment_divergence)),
        aggregate_revision_divergence: average(caseResults.map((item) => item.revision_divergence)),
        aggregate_provenance_set_divergence: average(caseResults.map((item) => item.provenance_set_divergence)),
        aggregate_provenance_role_divergence: average(caseResults.map((item) => item.provenance_role_divergence)),
        aggregate_divergence: average(caseResults.map((item) => item.overall_divergence)),
      });
    }
  }
  return pairs;
}

export function suiteIntegrity(suite) {
  const cases = suite.cases.map((benchmarkCase) => {
    const sealed = sealHistory(benchmarkCase.history);
    const verification = verifySealedHistory(sealed);
    return { case_id: benchmarkCase.case_id, event_count: sealed.length, ...verification };
  });
  return { ok: cases.every((item) => item.ok), cases };
}

export function buildPromptPackage(suite) {
  return {
    schema: 'cairn.q1-trial-002-prompt-package.v1',
    benchmark_namespace: suite.benchmark_namespace,
    authoritative_cairn_state: false,
    dataset_hash: datasetHash(suite),
    provenance_roles: suite.provenance_roles,
    reconstruction_contract: [
      'Recover the current authoritative state assertions, unresolved commitments, explicit correction relationships, and the minimum sufficient authoritative provenance path for each recovered item.',
      'A provenance path must include every event necessary to establish why the recovered item is authoritative, including relevant origin, conflict, correction, adjudication, supersession, supporting, commitment-origin, or transition events.',
      'Do not collapse a multi-event correction or adjudication path to only its latest event when earlier events remain necessary to establish the authoritative history.',
      'Do not cite unrelated events merely because they are nearby in the history. Citing the entire history is not acceptable provenance recovery.',
      'A later derived summary marked non-authoritative does not become authoritative evidence by recency alone.',
      'Use only event ids present in the supplied sealed history. Do not invent state keys, commitments, event ids or evidence.',
      'These records are synthetic benchmark material and are not Cairn history or authoritative Cairn state.'
    ],
    response_schema: {
      schema: 'cairn.q1-trial-002-engine-output.v1',
      engine: { id: 'provider/model-id', provider: 'provider-name', version: 'optional-version' },
      cases: [
        {
          case_id: 'case id from prompt',
          state_assertions: [
            {
              key: 'state.key',
              value: 'recovered value',
              provenance: [{ event_id: 'event-id', role: 'one provenance role from provenance_roles' }]
            }
          ],
          unresolved_commitments: [
            {
              commitment_id: 'C-000',
              provenance: [{ event_id: 'event-id', role: 'one provenance role from provenance_roles' }]
            }
          ],
          revision_links: [{ original_event_id: 'event-id', correction_event_id: 'event-id' }]
        }
      ]
    },
    cases: suite.cases.map((benchmarkCase) => ({
      case_id: benchmarkCase.case_id,
      title: benchmarkCase.title,
      history: sealHistory(benchmarkCase.history),
    })),
  };
}

export { datasetHash };
