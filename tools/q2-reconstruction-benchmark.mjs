#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  Q2_NAMESPACE,
  Q2_WORKLOAD_VERSION,
  assertMatchesExpected,
  corruptDependencySegment,
  corruptHistoryCopy,
  corruptLatestCheckpoint,
  generateDataset,
  hardwareProfile,
  loadDatasetManifest,
  measureRepeated,
  reconstructCheckpoint,
  reconstructFull,
  reconstructSelective,
  sha256,
  stableStringify,
  storageProfile,
} from '../lib/research/q2-reconstruction-core.mjs';

const argv = process.argv.slice(2);

function value(name, fallback = undefined) {
  const direct = argv.indexOf(name);
  if (direct >= 0 && direct + 1 < argv.length) return argv[direct + 1];
  const prefixed = argv.find((item) => item.startsWith(`${name}=`));
  return prefixed ? prefixed.slice(name.length + 1) : fallback;
}

function flag(name) {
  return argv.includes(name);
}

function parseSizes(text) {
  return String(text).split(',').map((part) => Number(part.trim())).filter((item) => Number.isInteger(item) && item > 0);
}

function round4(value) {
  return Number(Number(value).toFixed(4));
}

function ratio(a, b) {
  return b ? round4(a / b) : null;
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function usage() {
  console.log(`Cairn Q2 multi-year reconstruction benchmark\n\nBoundary:\n  Synthetic, disposable, explicitly non-authoritative benchmark data only.\n  This tool does not initialize Cairn or write authoritative Cairn state.\n\nUsage:\n  npm run benchmark:q2 -- --self-test\n  npm run benchmark:q2 -- --sizes 10000,100000,1000000 --repetitions 5 --out out/q2/report.json\n\nOptions:\n  --sizes <csv>          Event-count scale ladder (default 10000,100000,1000000)\n  --repetitions <n>      Measured repetitions after warm-up (default 5)\n  --seed <n>             Deterministic workload seed (default 20260831)\n  --workdir <path>       Disposable workspace root (default out/q2-trial-001)\n  --out <path>           Write report JSON\n  --self-test            Run correctness/corruption validation\n  --help                 Show help\n`);
}

async function runCorruptionProbes(workdir, policyId) {
  const corruptionDir = path.join(workdir, 'corruption');
  await mkdir(corruptionDir, { recursive: true });
  const manifest = await loadDatasetManifest(workdir);

  const corruptCheckpointPath = path.join(corruptionDir, `${policyId}-checkpoint-corrupt.ndjson`);
  await corruptLatestCheckpoint(workdir, policyId, corruptCheckpointPath);
  const checkpointFallback = await reconstructCheckpoint(workdir, policyId, {
    verify: true,
    checkpointFileOverride: corruptCheckpointPath,
  });
  assertMatchesExpected(manifest, checkpointFallback);

  const corruptDependencyPath = path.join(corruptionDir, `${policyId}-dependency-corrupt.json`);
  const dependencyCorruption = await corruptDependencySegment(workdir, policyId, corruptDependencyPath);
  const selectiveFallback = await reconstructSelective(workdir, policyId, {
    verify: true,
    dependencyFileOverrides: { [dependencyCorruption.filename]: dependencyCorruption.path },
  });
  assertMatchesExpected(manifest, selectiveFallback);

  const corruptHistoryPath = path.join(corruptionDir, 'events-corrupt.ndjson');
  await corruptHistoryCopy(workdir, corruptHistoryPath);
  let historyMutationDetected = false;
  let historyError = null;
  try {
    await reconstructFull(workdir, { verify: true, eventLogOverride: corruptHistoryPath });
  } catch (error) {
    historyMutationDetected = true;
    historyError = String(error.message ?? error);
  }

  return {
    latest_checkpoint_corruption: {
      detected: checkpointFallback.rejected_checkpoint_count > 0,
      fallback: checkpointFallback.fallback,
      recovered_expected_baseline: true,
    },
    dependency_index_corruption: {
      detected: selectiveFallback.fallback === 'checkpoint-incremental-after-dependency-rejection',
      fallback: selectiveFallback.fallback,
      dependency_error: selectiveFallback.dependency_error ?? null,
      recovered_expected_baseline: true,
    },
    protected_history_mutation: {
      detected: historyMutationDetected,
      error: historyError,
    },
    silent_false_verification_count:
      (checkpointFallback.rejected_checkpoint_count > 0 ? 0 : 1) +
      (selectiveFallback.fallback === 'checkpoint-incremental-after-dependency-rejection' ? 0 : 1) +
      (historyMutationDetected ? 0 : 1),
  };
}

async function selfTest(root, seed) {
  const workdir = path.join(root, 'self-test');
  const generated = await generateDataset({ workdir, eventCount: 5000, seed, segmentSize: 500 });
  const manifest = await loadDatasetManifest(workdir);
  const checks = {};

  const full = await reconstructFull(workdir, { verify: true });
  checks.full_matches_expected = assertMatchesExpected(manifest, full);

  for (const policy of ['pct-1', 'pct-5', 'pct-10']) {
    const checkpoint = await reconstructCheckpoint(workdir, policy, { verify: true });
    checks[`checkpoint_${policy}_matches_expected`] = assertMatchesExpected(manifest, checkpoint);
    const selective = await reconstructSelective(workdir, policy, { verify: true });
    checks[`selective_${policy}_matches_expected`] = assertMatchesExpected(manifest, selective);
    checks[`selective_${policy}_applies_no_more_than_checkpoint`] = selective.events_applied <= checkpoint.events_applied;
  }

  const corruption = await runCorruptionProbes(workdir, 'pct-10');
  checks.checkpoint_corruption_detected = corruption.latest_checkpoint_corruption.detected;
  checks.dependency_corruption_detected = corruption.dependency_index_corruption.detected;
  checks.history_mutation_detected = corruption.protected_history_mutation.detected;
  checks.zero_silent_false_verification = corruption.silent_false_verification_count === 0;

  return {
    schema: 'cairn.q2-trial-001-self-test.v1',
    benchmark_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    workload_version: Q2_WORKLOAD_VERSION,
    ok: Object.values(checks).every(Boolean),
    checks,
    corruption,
    dataset: {
      event_count: manifest.content.event_count,
      seed: manifest.content.seed,
      final_event_hash: manifest.content.final_event_hash,
      generation_ms: round4(generated.generation_ms),
    },
  };
}

async function benchmarkScale(root, eventCount, seed, repetitions, runCorruption) {
  const workdir = path.join(root, String(eventCount));
  const generated = await generateDataset({ workdir, eventCount, seed });
  const manifest = await loadDatasetManifest(workdir);
  const expected = manifest.content.expected_baseline;

  const fullVerified = await measureRepeated(async () => {
    const result = await reconstructFull(workdir, { verify: true });
    assertMatchesExpected(manifest, result);
    return result;
  }, repetitions);

  const fullUnverified = await measureRepeated(async () => {
    const result = await reconstructFull(workdir, { verify: false });
    assertMatchesExpected(manifest, result);
    return result;
  }, repetitions);

  const policies = {};
  for (const policy of manifest.content.checkpoint_policies) {
    const checkpointVerified = await measureRepeated(async () => {
      const result = await reconstructCheckpoint(workdir, policy.policy, { verify: true });
      assertMatchesExpected(manifest, result);
      return result;
    }, repetitions);

    const checkpointUnverified = await measureRepeated(async () => {
      const result = await reconstructCheckpoint(workdir, policy.policy, { verify: false });
      assertMatchesExpected(manifest, result);
      return result;
    }, repetitions);

    const selectiveVerified = await measureRepeated(async () => {
      const result = await reconstructSelective(workdir, policy.policy, { verify: true });
      assertMatchesExpected(manifest, result);
      return result;
    }, repetitions);

    const selectiveUnverified = await measureRepeated(async () => {
      const result = await reconstructSelective(workdir, policy.policy, { verify: false });
      assertMatchesExpected(manifest, result);
      return result;
    }, repetitions);

    policies[policy.policy] = {
      interval_events: policy.interval_events,
      checkpoint_age_events: checkpointVerified.checkpoint_age_events,
      checkpoint_age_fraction: ratio(checkpointVerified.checkpoint_age_events, eventCount),
      checkpoint_verified: checkpointVerified,
      checkpoint_unverified: checkpointUnverified,
      selective_verified: selectiveVerified,
      selective_unverified: selectiveUnverified,
      checkpoint_speedup_vs_full_p50: ratio(fullVerified.p50_latency_ms, checkpointVerified.p50_latency_ms),
      selective_speedup_vs_full_p50: ratio(fullVerified.p50_latency_ms, selectiveVerified.p50_latency_ms),
      checkpoint_verification_overhead_ratio_p50: ratio(checkpointVerified.p50_latency_ms, checkpointUnverified.p50_latency_ms),
      selective_verification_overhead_ratio_p50: ratio(selectiveVerified.p50_latency_ms, selectiveUnverified.p50_latency_ms),
      checkpoint_read_fraction: ratio(checkpointVerified.events_read, eventCount),
      checkpoint_apply_fraction: ratio(checkpointVerified.events_applied, eventCount),
      selective_read_fraction: ratio(selectiveVerified.events_read, eventCount),
      selective_apply_fraction: ratio(selectiveVerified.events_applied, eventCount),
      selective_applies_no_more_than_checkpoint: selectiveVerified.events_applied <= checkpointVerified.events_applied,
    };
  }

  return {
    event_count: eventCount,
    synthetic_years: manifest.content.synthetic_years,
    seed,
    workload_version: manifest.content.workload_version,
    dataset_final_event_hash: manifest.content.final_event_hash,
    expected_baseline_sha256: sha256(stableStringify(expected)),
    generation_ms: round4(generated.generation_ms),
    storage: await storageProfile(workdir),
    full_verified: fullVerified,
    full_unverified: fullUnverified,
    full_verification_overhead_ratio_p50: ratio(fullVerified.p50_latency_ms, fullUnverified.p50_latency_ms),
    checkpoint_policies: policies,
    corruption: runCorruption ? await runCorruptionProbes(workdir, 'pct-1') : null,
  };
}

function evaluateTargets(scales) {
  const failures = [];
  for (const scale of scales) {
    for (const [policyId, policy] of Object.entries(scale.checkpoint_policies)) {
      if (policy.checkpoint_verified.events_read > scale.event_count) failures.push(`${scale.event_count}/${policyId}: checkpoint read count exceeds lifetime`);
      if (policy.selective_verified.events_applied > policy.checkpoint_verified.events_applied) failures.push(`${scale.event_count}/${policyId}: selective applied more events than checkpoint strategy`);
    }
    if (scale.corruption && scale.corruption.silent_false_verification_count !== 0) failures.push(`${scale.event_count}: silent false verification in corruption probe`);
  }

  const million = scales.find((item) => item.event_count === 1000000);
  if (million) {
    const onePct = million.checkpoint_policies['pct-1'];
    if (onePct.checkpoint_apply_fraction > 0.010001) failures.push(`1M/pct-1: replay fraction ${onePct.checkpoint_apply_fraction} exceeds 1%`);
  }

  return {
    bounded_work_target_supported: failures.length === 0,
    failures,
  };
}

if (flag('--help')) {
  usage();
  process.exit(0);
}

const root = path.resolve(value('--workdir', 'out/q2-trial-001'));
const seed = Number(value('--seed', '20260831'));
const repetitions = Number(value('--repetitions', '5'));
if (!Number.isInteger(seed) || !Number.isInteger(repetitions) || repetitions < 1) throw new Error('Invalid seed or repetitions.');

if (flag('--self-test')) {
  const result = await selfTest(root, seed);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
} else {
  const sizes = parseSizes(value('--sizes', '10000,100000,1000000'));
  if (!sizes.length) throw new Error('No valid sizes supplied.');
  const startedAt = new Date().toISOString();
  const scales = [];
  for (const size of sizes) {
    scales.push(await benchmarkScale(root, size, seed, repetitions, size === Math.min(...sizes)));
  }

  const report = {
    schema: 'cairn.q2-trial-001-benchmark-report.v1',
    benchmark_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    initialization_boundary_crossed: false,
    workload_version: Q2_WORKLOAD_VERSION,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    hardware: hardwareProfile(),
    configuration: { sizes, repetitions, seed },
    scales,
    target_evaluation: evaluateTargets(scales),
    limitations: [
      'CI timings are runner-specific and are not stable production-hardware latency claims.',
      'Selective reconstruction verifies checkpoint/index metadata and selected event content; it is not a substitute for full historical audit.',
      'The generated workload has a fixed synthetic dependency density and does not represent every production workload.',
      'maxRSS is process high-water memory rather than isolated per-strategy peak RSS.',
    ],
  };

  const outPath = value('--out');
  if (outPath) await writeJson(path.resolve(outPath), report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.target_evaluation.bounded_work_target_supported) process.exitCode = 1;
}
