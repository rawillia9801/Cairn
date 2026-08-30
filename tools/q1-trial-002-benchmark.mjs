#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  buildPromptPackage,
  datasetHash,
  pairwiseDivergence,
  scoreEngine,
  suiteIntegrity,
} from '../lib/research/q1-trial-002-core.mjs';
import { sealHistory, verifySealedHistory } from '../lib/research/q1-cross-model-core.mjs';

const argv = process.argv.slice(2);

function values(name) {
  const found = [];
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === name && index + 1 < argv.length) found.push(argv[index + 1]);
    else if (current.startsWith(`${name}=`)) found.push(current.slice(name.length + 1));
  }
  return found;
}

function value(name, fallback = undefined) {
  return values(name)[0] ?? fallback;
}

function hasFlag(name) {
  return argv.includes(name);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function usage() {
  console.log(`Cairn Q1 Trial 002 provenance portability benchmark\n\nBoundary:\n  Synthetic, disposable, explicitly non-authoritative benchmark data only.\n  This tool does not initialize Cairn or create authoritative Cairn state.\n\nUsage:\n  npm run benchmark:q1:t2 -- --self-test\n  npm run benchmark:q1:t2 -- --emit-prompts ./out/q1t2-prompts.json\n  npm run benchmark:q1:t2 -- --response engine-a=./a.json --response engine-b=./b.json\n\nOptions:\n  --suite <path>          Trial 002 suite (default: fixtures/q1-trial-002/suite.v1.json)\n  --emit-prompts <path>   Write the sealed prompt package without ground truth\n  --response <label=path> Score a cognition-engine response; repeat for multiple engines\n  --out <path>            Write report JSON\n  --self-test             Validate scorer behavior and tamper detection\n  --help                  Show help\n`);
}

function parseResponseSpec(spec) {
  const separator = spec.indexOf('=');
  if (separator <= 0 || separator === spec.length - 1) {
    throw new Error(`--response must be label=path, received: ${spec}`);
  }
  return { label: spec.slice(0, separator), filePath: spec.slice(separator + 1) };
}

async function loadResponses(specs) {
  const loaded = [];
  for (const spec of specs) {
    const parsed = parseResponseSpec(spec);
    loaded.push({
      label: parsed.label,
      filePath: parsed.filePath,
      output: await readJson(parsed.filePath),
    });
  }
  return loaded;
}

function buildReport(suite, labeledOutputs) {
  return {
    schema: 'cairn.q1-trial-002-benchmark-report.v1',
    generated_at: new Date().toISOString(),
    benchmark_namespace: suite.benchmark_namespace,
    authoritative_cairn_state: false,
    initialization_boundary_crossed: false,
    dataset_hash: datasetHash(suite),
    suite_integrity: suiteIntegrity(suite),
    engine_results: labeledOutputs.map((item) => ({
      label: item.label,
      source_file: item.filePath,
      ...scoreEngine(suite, item.output),
    })),
    pairwise_interpretation_divergence: pairwiseDivergence(suite, labeledOutputs),
  };
}

function perfectOutput(suite) {
  return {
    schema: 'cairn.q1-trial-002-engine-output.v1',
    engine: { id: 'reference/perfect', provider: 'reference', version: '1' },
    cases: suite.cases.map((benchmarkCase) => ({
      case_id: benchmarkCase.case_id,
      state_assertions: benchmarkCase.ground_truth.state_assertions.map((item) => ({
        key: item.key,
        value: item.value,
        provenance: item.provenance,
      })),
      unresolved_commitments: benchmarkCase.ground_truth.unresolved_commitments.map((item) => ({
        commitment_id: item.commitment_id,
        provenance: item.provenance,
      })),
      revision_links: benchmarkCase.ground_truth.revision_links,
    })),
  };
}

function terminalOnlyOutput(suite) {
  return {
    schema: 'cairn.q1-trial-002-engine-output.v1',
    engine: { id: 'reference/terminal-only', provider: 'reference', version: '1' },
    cases: suite.cases.map((benchmarkCase) => ({
      case_id: benchmarkCase.case_id,
      state_assertions: benchmarkCase.ground_truth.state_assertions.map((item) => {
        const terminal = item.terminal_authority_event_id;
        const terminalEntry = item.provenance.find((entry) => entry.event_id === terminal) ?? item.provenance.at(-1);
        return { key: item.key, value: item.value, provenance: terminalEntry ? [terminalEntry] : [] };
      }),
      unresolved_commitments: benchmarkCase.ground_truth.unresolved_commitments.map((item) => {
        const terminal = item.terminal_authority_event_id;
        const terminalEntry = item.provenance.find((entry) => entry.event_id === terminal) ?? item.provenance.at(-1);
        return { commitment_id: item.commitment_id, provenance: terminalEntry ? [terminalEntry] : [] };
      }),
      revision_links: benchmarkCase.ground_truth.revision_links,
    })),
  };
}

function tamperProbe(suite) {
  const sealed = sealHistory(suite.cases[0].history);
  const tampered = structuredClone(sealed);
  tampered[0].payload.__synthetic_trial_002_tamper_probe = true;
  const verification = verifySealedHistory(tampered);
  return {
    deliberate_mutation_detected: !verification.ok,
    failures: verification.failures,
  };
}

function selfTest(suite) {
  const perfect = perfectOutput(suite);
  const terminalOnly = terminalOnlyOutput(suite);
  const perfectScore = scoreEngine(suite, perfect);
  const terminalScore = scoreEngine(suite, terminalOnly);
  const tamper = tamperProbe(suite);
  const integrity = suiteIntegrity(suite);

  const checks = {
    suite_integrity_passes: integrity.ok,
    perfect_state_f1_is_one: perfectScore.aggregate.state_f1 === 1,
    perfect_commitment_f1_is_one: perfectScore.aggregate.commitment_f1 === 1,
    perfect_revision_f1_is_one: perfectScore.aggregate.revision_fidelity_f1 === 1,
    perfect_provenance_f1_is_one: perfectScore.aggregate.provenance_event_f1 === 1,
    perfect_complete_path_rate_is_one: perfectScore.aggregate.complete_path_recovery_rate === 1,
    perfect_terminal_compression_is_zero: perfectScore.aggregate.terminal_only_compression_rate === 0,
    perfect_irrelevant_inclusion_is_zero: perfectScore.aggregate.irrelevant_evidence_inclusion_rate === 0,
    perfect_role_accuracy_is_one: perfectScore.aggregate.provenance_role_accuracy === 1,
    perfect_has_no_catastrophic_failures: perfectScore.aggregate.catastrophic_failure_count === 0,
    terminal_only_keeps_operational_state: terminalScore.aggregate.state_f1 === 1 && terminalScore.aggregate.commitment_f1 === 1,
    terminal_only_loses_provenance: terminalScore.aggregate.provenance_event_f1 < perfectScore.aggregate.provenance_event_f1,
    terminal_only_compression_detected: terminalScore.aggregate.terminal_only_compression_rate > 0,
    deliberate_mutation_detected: tamper.deliberate_mutation_detected,
  };

  return {
    schema: 'cairn.q1-trial-002-self-test.v1',
    ok: Object.values(checks).every(Boolean),
    boundary: 'synthetic-disposable-non-authoritative',
    checks,
    tamper_probe: tamper,
    perfect_reference: perfectScore,
    terminal_only_reference: terminalScore,
  };
}

if (hasFlag('--help')) {
  usage();
  process.exit(0);
}

const suitePath = path.resolve(value('--suite', 'fixtures/q1-trial-002/suite.v1.json'));
const suite = await readJson(suitePath);

if (suite.authoritative_cairn_state !== false || suite.benchmark_namespace !== 'synthetic-q1-trial-002-non-authoritative') {
  throw new Error('Trial 002 refused to run: suite is not explicitly synthetic and non-authoritative.');
}

const promptPath = value('--emit-prompts');
if (promptPath) {
  await writeJson(path.resolve(promptPath), buildPromptPackage(suite));
  console.error(`Wrote frozen-candidate Trial 002 prompt package: ${path.resolve(promptPath)}`);
}

if (hasFlag('--self-test')) {
  const result = selfTest(suite);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
} else {
  const responseSpecs = values('--response');
  if (responseSpecs.length) {
    const labeledOutputs = await loadResponses(responseSpecs);
    const report = buildReport(suite, labeledOutputs);
    const outPath = value('--out');
    if (outPath) {
      await writeJson(path.resolve(outPath), report);
      console.error(`Wrote Trial 002 benchmark report: ${path.resolve(outPath)}`);
    }
    console.log(JSON.stringify(report, null, 2));
  } else if (!promptPath) {
    usage();
    process.exitCode = 2;
  }
}
