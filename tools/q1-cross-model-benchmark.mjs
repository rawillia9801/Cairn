#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  buildPromptPackage,
  datasetHash,
  pairwiseDivergence,
  scoreEngine,
  sealHistory,
  verifySealedHistory,
} from '../lib/research/q1-cross-model-core.mjs';

const argv = process.argv.slice(2);

function values(name) {
  const found = [];
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === name && index + 1 < argv.length) found.push(argv[index + 1]);
    else if (value.startsWith(`${name}=`)) found.push(value.slice(name.length + 1));
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
  console.log(`Cairn Q1 cross-model continuity benchmark\n\nBoundary:\n  Synthetic, disposable, non-authoritative benchmark data only.\n  This tool does not initialize Cairn and does not create Cairn identity, memory,\n  history, commitments, checkpoints, provenance state, genesis data, or Commit Gate state.\n\nUsage:\n  npm run benchmark:q1 -- --self-test\n  npm run benchmark:q1 -- --emit-prompts ./out/q1-prompts.json\n  npm run benchmark:q1 -- --response model-a=./model-a.json --response model-b=./model-b.json\n\nOptions:\n  --suite <path>          Synthetic suite (default: fixtures/q1-cross-model/suite.v1.json)\n  --emit-prompts <path>   Write sealed histories and response schema without ground truth\n  --response <label=path> Score a cognition-engine response; repeat for multiple engines\n  --out <path>            Write benchmark report JSON instead of stdout only\n  --self-test             Validate scoring and tamper detection using reference responses\n  --help                  Show this help\n`);
}

function suiteIntegrity(suite) {
  const cases = suite.cases.map((benchmarkCase) => {
    const sealed = sealHistory(benchmarkCase.history);
    const verification = verifySealedHistory(sealed);
    return { case_id: benchmarkCase.case_id, event_count: sealed.length, ...verification };
  });
  return {
    ok: cases.every((item) => item.ok),
    cases,
  };
}

function tamperSelfTest(suite) {
  const benchmarkCase = suite.cases[0];
  const sealed = sealHistory(benchmarkCase.history);
  const tampered = structuredClone(sealed);
  if (tampered[0]?.payload && typeof tampered[0].payload === 'object') {
    tampered[0].payload.__synthetic_tamper_probe = true;
  } else {
    tampered[0].source = 'synthetic-tampered-source';
  }
  const verification = verifySealedHistory(tampered);
  return {
    case_id: benchmarkCase.case_id,
    deliberate_mutation_detected: !verification.ok,
    failures: verification.failures,
  };
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
  const integrity = suiteIntegrity(suite);
  const engineResults = labeledOutputs.map((item) => ({
    label: item.label,
    source_file: item.filePath,
    ...scoreEngine(suite, item.output),
  }));

  return {
    schema: 'cairn.q1-benchmark-report.v1',
    generated_at: new Date().toISOString(),
    benchmark_namespace: suite.benchmark_namespace,
    authoritative_cairn_state: false,
    initialization_boundary_crossed: false,
    dataset_hash: datasetHash(suite),
    suite_integrity: integrity,
    engine_results: engineResults,
    pairwise_interpretation_divergence: pairwiseDivergence(suite, labeledOutputs),
  };
}

async function runSelfTest(suite) {
  const perfectPath = path.resolve('fixtures/q1-cross-model/responses/reference-perfect.json');
  const driftedPath = path.resolve('fixtures/q1-cross-model/responses/reference-drifted.json');
  const labeledOutputs = await loadResponses([
    `reference-perfect=${perfectPath}`,
    `reference-drifted=${driftedPath}`,
  ]);
  const report = buildReport(suite, labeledOutputs);
  const perfect = report.engine_results.find((item) => item.label === 'reference-perfect');
  const drifted = report.engine_results.find((item) => item.label === 'reference-drifted');
  const tamper = tamperSelfTest(suite);

  const checks = {
    sealed_histories_verify: report.suite_integrity.ok,
    perfect_state_f1_is_one: perfect?.aggregate.state_f1 === 1,
    perfect_commitment_f1_is_one: perfect?.aggregate.commitment_f1 === 1,
    perfect_provenance_is_one: perfect?.aggregate.provenance_fidelity === 1,
    perfect_resumption_is_one: perfect?.aggregate.resumption_consistency === 1,
    drifted_scores_lower: Boolean(
      drifted && perfect &&
      drifted.aggregate.state_f1 < perfect.aggregate.state_f1 &&
      drifted.aggregate.resumption_consistency < perfect.aggregate.resumption_consistency
    ),
    deliberate_mutation_detected: tamper.deliberate_mutation_detected,
  };
  const ok = Object.values(checks).every(Boolean);

  return {
    schema: 'cairn.q1-self-test.v1',
    ok,
    boundary: 'synthetic-disposable-non-authoritative',
    checks,
    tamper_probe: tamper,
    reference_report: report,
  };
}

if (hasFlag('--help')) {
  usage();
  process.exit(0);
}

const suitePath = path.resolve(value('--suite', 'fixtures/q1-cross-model/suite.v1.json'));
const suite = await readJson(suitePath);

if (suite.authoritative_cairn_state !== false || suite.benchmark_namespace !== 'synthetic-q1-non-authoritative') {
  throw new Error('Q1 benchmark refused to run: suite is not explicitly marked synthetic and non-authoritative.');
}

const promptPath = value('--emit-prompts');
if (promptPath) {
  const promptPackage = buildPromptPackage(suite);
  await writeJson(path.resolve(promptPath), promptPackage);
  console.error(`Wrote synthetic Q1 prompt package: ${path.resolve(promptPath)}`);
}

if (hasFlag('--self-test')) {
  const result = await runSelfTest(suite);
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
      console.error(`Wrote Q1 benchmark report: ${path.resolve(outPath)}`);
    }
    console.log(JSON.stringify(report, null, 2));
  } else if (!promptPath) {
    usage();
    process.exitCode = 2;
  }
}
