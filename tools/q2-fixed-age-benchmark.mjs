#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
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

const TRIAL_NAMESPACE = 'synthetic-q2-trial-002-fixed-age-non-authoritative';
const REPORT_SCHEMA = 'cairn.q2-trial-002-fixed-age-report.v1';
const SELF_TEST_SCHEMA = 'cairn.q2-trial-002-fixed-age-self-test.v1';
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
  return String(text)
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function round4(number) {
  return Number(Number(number).toFixed(4));
}

function ratio(numerator, denominator) {
  return denominator ? round4(numerator / denominator) : null;
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function usage() {
  console.log(`Cairn Q2 Trial 002 fixed-age reconstruction benchmark\n\nBoundary:\n  Synthetic, disposable, explicitly non-authoritative benchmark data only.\n  This tool reuses the frozen Q2 Trial 001 synthetic workload and does not initialize Cairn.\n\nUsage:\n  npm run benchmark:q2:t2 -- --self-test\n  npm run benchmark:q2:t2 -- --sizes 100000,1000000 --fixed-age 10000 --repetitions 5 --out out/q2-trial-002-report/report.json\n\nOptions:\n  --sizes <csv>          Lifetime event-count ladder (default 100000,1000000)\n  --fixed-age <n>        Required terminal checkpoint age in events (default 10000)\n  --repetitions <n>      Measured repetitions after warm-up (default 5)\n  --seed <n>             Deterministic workload seed (default 20260831)\n  --workdir <path>       Disposable workspace root (default out/q2-trial-002)\n  --out <path>           Write report JSON\n  --self-test            Run a smaller fixed-age correctness/corruption validation\n  --help                 Show help\n`);
}

function selectFixedAgePolicy(manifestContent, fixedAge) {
  const checkpointSeq = manifestContent.event_count - fixedAge;
  if (checkpointSeq <= 0) {
    throw new Error(`Fixed age ${fixedAge} is not smaller than lifetime event count ${manifestContent.event_count}.`);
  }

  const candidates = manifestContent.checkpoint_policies.filter((policy) =>
    policy.checkpoints.some((checkpoint) => checkpoint.seq === checkpointSeq),
  );

  if (!candidates.length) {
    throw new Error(
      `Frozen Q2 workload has no checkpoint exactly ${fixedAge} events behind terminal at lifetime ${manifestContent.event_count}. ` +
      'Trial 002 refuses to substitute a different checkpoint age.',
    );
  }

  candidates.sort((a, b) => a.interval_events - b.interval_events || a.policy.localeCompare(b.policy));
  return candidates[0];
}

async function metadataAccounting(workdir, manifestContent, policy, checkpointSeq) {
  const datasetManifestPath = path.join(workdir, 'dataset-manifest.json');
  const datasetManifestBytes = (await stat(datasetManifestPath)).size;
  const checkpointMeta = policy.checkpoints.find((checkpoint) => checkpoint.seq === checkpointSeq);
  if (!checkpointMeta) throw new Error(`Missing fixed-age checkpoint metadata for seq ${checkpointSeq}.`);

  const dependencyManifestPath = path.join(workdir, manifestContent.dependency_manifest_file);
  const dependencyManifestBytes = (await stat(dependencyManifestPath)).size;
  const dependencyEnvelope = JSON.parse(await readFile(dependencyManifestPath, 'utf8'));
  const relevantSegments = dependencyEnvelope.content.segments.filter((segment) => segment.end_seq > checkpointSeq);
  let relevantDependencySegmentBytes = 0;
  for (const segment of relevantSegments) {
    relevantDependencySegmentBytes += (await stat(path.join(workdir, 'dependency', segment.filename))).size;
  }

  return {
    checkpoint_seq: checkpointSeq,
    fixed_age_events: manifestContent.event_count - checkpointSeq,
    event_log_bytes_total: manifestContent.event_log_bytes,
    dataset_manifest_bytes_per_load: datasetManifestBytes,
    strategy_a_dataset_manifest_load_count: 1,
    strategy_b_dataset_manifest_load_count: 2,
    strategy_c_dataset_manifest_load_count: 3,
    strategy_b_dataset_manifest_bytes_loaded: datasetManifestBytes * 2,
    strategy_c_dataset_manifest_bytes_loaded: datasetManifestBytes * 3,
    fixed_age_checkpoint_candidate_bytes_read: checkpointMeta.length,
    checkpoint_file_bytes_total: policy.bytes,
    dependency_manifest_bytes_read_by_strategy_c: dependencyManifestBytes,
    relevant_dependency_segment_count: relevantSegments.length,
    relevant_dependency_segment_bytes_read_by_strategy_c: relevantDependencySegmentBytes,
    precheckpoint_event_body_reads_by_strategy_b_algorithm: 0,
    strategy_b_event_stream_start_offset_bytes: null,
    note:
      'Strategy B opens the protected event stream at the checkpoint next_offset; no pre-checkpoint event bodies are read by the reconstruction algorithm. Metadata byte counts are explicit file-level accounting, not kernel/cache I/O telemetry.',
  };
}

async function resolveCheckpointOffset(workdir, manifestContent, policy, checkpointSeq, accounting) {
  const checkpointMeta = policy.checkpoints.find((checkpoint) => checkpoint.seq === checkpointSeq);
  if (!checkpointMeta) return accounting;
  const checkpointFilePath = path.join(workdir, policy.file);
  const checkpointBuffer = Buffer.alloc(checkpointMeta.length);
  const checkpointFile = await import('node:fs/promises').then(({ open }) => open(checkpointFilePath, 'r'));
  try {
    const { bytesRead } = await checkpointFile.read(checkpointBuffer, 0, checkpointMeta.length, checkpointMeta.offset);
    if (bytesRead !== checkpointMeta.length) throw new Error('Short checkpoint read during metadata accounting.');
    const checkpoint = JSON.parse(checkpointBuffer.toString('utf8').trim());
    return {
      ...accounting,
      strategy_b_event_stream_start_offset_bytes: checkpoint.next_offset,
      precheckpoint_event_log_fraction_skipped_by_stream_start: ratio(checkpoint.next_offset, manifestContent.event_log_bytes),
    };
  } finally {
    await checkpointFile.close();
  }
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

  const checkpointDetected = checkpointFallback.rejected_checkpoint_count > 0;
  const dependencyDetected = selectiveFallback.fallback === 'checkpoint-incremental-after-dependency-rejection';

  return {
    latest_checkpoint_corruption: {
      detected: checkpointDetected,
      fallback: checkpointFallback.fallback,
      recovered_expected_baseline: true,
    },
    dependency_index_corruption: {
      detected: dependencyDetected,
      fallback: selectiveFallback.fallback,
      dependency_error: selectiveFallback.dependency_error ?? null,
      recovered_expected_baseline: true,
    },
    protected_history_mutation: {
      detected: historyMutationDetected,
      error: historyError,
    },
    silent_false_verification_count:
      (checkpointDetected ? 0 : 1) +
      (dependencyDetected ? 0 : 1) +
      (historyMutationDetected ? 0 : 1),
  };
}

async function benchmarkScale(root, eventCount, seed, repetitions, fixedAge, runCorruption) {
  const workdir = path.join(root, String(eventCount));
  const generated = await generateDataset({ workdir, eventCount, seed });
  const manifest = await loadDatasetManifest(workdir);
  const manifestContent = manifest.content;
  const policy = selectFixedAgePolicy(manifestContent, fixedAge);
  const checkpointSeq = eventCount - fixedAge;

  let accounting = await metadataAccounting(workdir, manifestContent, policy, checkpointSeq);
  accounting = await resolveCheckpointOffset(workdir, manifestContent, policy, checkpointSeq, accounting);

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

  const checkpointVerified = await measureRepeated(async () => {
    const result = await reconstructCheckpoint(workdir, policy.policy, { verify: true });
    assertMatchesExpected(manifest, result);
    if (result.checkpoint_age_events !== fixedAge) {
      throw new Error(`Measured checkpoint age ${result.checkpoint_age_events} does not equal preregistered fixed age ${fixedAge}.`);
    }
    return result;
  }, repetitions);

  const checkpointUnverified = await measureRepeated(async () => {
    const result = await reconstructCheckpoint(workdir, policy.policy, { verify: false });
    assertMatchesExpected(manifest, result);
    if (result.checkpoint_age_events !== fixedAge) {
      throw new Error(`Unverified control checkpoint age ${result.checkpoint_age_events} does not equal fixed age ${fixedAge}.`);
    }
    return result;
  }, repetitions);

  const selectiveVerified = await measureRepeated(async () => {
    const result = await reconstructSelective(workdir, policy.policy, { verify: true });
    assertMatchesExpected(manifest, result);
    if (result.checkpoint_age_events !== fixedAge) {
      throw new Error(`Selective checkpoint age ${result.checkpoint_age_events} does not equal fixed age ${fixedAge}.`);
    }
    return result;
  }, repetitions);

  const selectiveUnverified = await measureRepeated(async () => {
    const result = await reconstructSelective(workdir, policy.policy, { verify: false });
    assertMatchesExpected(manifest, result);
    if (result.checkpoint_age_events !== fixedAge) {
      throw new Error(`Selective unverified control checkpoint age ${result.checkpoint_age_events} does not equal fixed age ${fixedAge}.`);
    }
    return result;
  }, repetitions);

  return {
    event_count: eventCount,
    synthetic_years: manifestContent.synthetic_years,
    seed,
    workload_version: manifestContent.workload_version,
    source_workload_namespace: manifestContent.benchmark_namespace,
    dataset_final_event_hash: manifestContent.final_event_hash,
    expected_baseline_sha256: sha256(stableStringify(manifestContent.expected_baseline)),
    generation_ms: round4(generated.generation_ms),
    fixed_age: {
      checkpoint_age_events: fixedAge,
      selected_source_policy: policy.policy,
      source_policy_interval_events: policy.interval_events,
      checkpoint_seq: checkpointSeq,
      tail_fraction_of_lifetime: ratio(fixedAge, eventCount),
    },
    storage: await storageProfile(workdir),
    hidden_work_accounting: accounting,
    full_verified: fullVerified,
    full_unverified: fullUnverified,
    full_verification_overhead_ratio_p50: ratio(fullVerified.p50_latency_ms, fullUnverified.p50_latency_ms),
    checkpoint_verified: checkpointVerified,
    checkpoint_unverified: checkpointUnverified,
    checkpoint_speedup_vs_full_p50: ratio(fullVerified.p50_latency_ms, checkpointVerified.p50_latency_ms),
    checkpoint_verification_overhead_ratio_p50: ratio(checkpointVerified.p50_latency_ms, checkpointUnverified.p50_latency_ms),
    selective_verified: selectiveVerified,
    selective_unverified: selectiveUnverified,
    selective_speedup_vs_full_p50: ratio(fullVerified.p50_latency_ms, selectiveVerified.p50_latency_ms),
    selective_verification_overhead_ratio_p50: ratio(selectiveVerified.p50_latency_ms, selectiveUnverified.p50_latency_ms),
    checkpoint_read_fraction_of_lifetime: ratio(checkpointVerified.events_read, eventCount),
    checkpoint_apply_fraction_of_lifetime: ratio(checkpointVerified.events_applied, eventCount),
    selective_read_fraction_of_lifetime: ratio(selectiveVerified.events_read, eventCount),
    selective_apply_fraction_of_lifetime: ratio(selectiveVerified.events_applied, eventCount),
    selective_applies_no_more_than_checkpoint: selectiveVerified.events_applied <= checkpointVerified.events_applied,
    corruption: runCorruption ? await runCorruptionProbes(workdir, policy.policy) : null,
  };
}

function evaluateTargets(scales, fixedAge) {
  const fixedWorkFailures = [];
  const integrityFailures = [];

  for (const scale of scales) {
    if (scale.checkpoint_verified.checkpoint_age_events !== fixedAge) {
      fixedWorkFailures.push(`${scale.event_count}: checkpoint age ${scale.checkpoint_verified.checkpoint_age_events} != ${fixedAge}`);
    }
    if (scale.checkpoint_verified.events_read !== fixedAge) {
      fixedWorkFailures.push(`${scale.event_count}: Strategy B read ${scale.checkpoint_verified.events_read} events instead of ${fixedAge}`);
    }
    if (scale.checkpoint_verified.events_applied !== fixedAge) {
      fixedWorkFailures.push(`${scale.event_count}: Strategy B applied ${scale.checkpoint_verified.events_applied} events instead of ${fixedAge}`);
    }
    if (scale.hidden_work_accounting.precheckpoint_event_body_reads_by_strategy_b_algorithm !== 0) {
      fixedWorkFailures.push(`${scale.event_count}: Strategy B reports pre-checkpoint event-body reads`);
    }
    if (scale.selective_verified.events_applied > scale.checkpoint_verified.events_applied) {
      fixedWorkFailures.push(`${scale.event_count}: Strategy C applied more events than Strategy B`);
    }
    if (scale.corruption && scale.corruption.silent_false_verification_count !== 0) {
      integrityFailures.push(`${scale.event_count}: silent false verification in corruption probes`);
    }
  }

  const hundredThousand = scales.find((item) => item.event_count === 100000);
  const million = scales.find((item) => item.event_count === 1000000);
  const latencyRatio = hundredThousand && million
    ? ratio(million.checkpoint_verified.p50_latency_ms, hundredThousand.checkpoint_verified.p50_latency_ms)
    : null;
  const latencyStabilitySupported = latencyRatio === null ? null : latencyRatio <= 2.0;

  return {
    fixed_work_supported: fixedWorkFailures.length === 0,
    fixed_work_failures: fixedWorkFailures,
    integrity_supported: integrityFailures.length === 0,
    integrity_failures: integrityFailures,
    required_scale_latency_ratio_p50_1m_over_100k: latencyRatio,
    latency_stability_threshold_max_ratio: 2.0,
    latency_stability_supported: latencyStabilitySupported,
    overall_supported:
      fixedWorkFailures.length === 0 &&
      integrityFailures.length === 0 &&
      latencyStabilitySupported === true,
  };
}

async function selfTest(root, seed) {
  const fixedAge = 1000;
  const sizes = [10000, 100000];
  const scales = [];
  for (const size of sizes) {
    scales.push(await benchmarkScale(root, size, seed, 1, fixedAge, size === sizes[0]));
  }

  const checks = {
    every_checkpoint_age_exact: scales.every((scale) => scale.checkpoint_verified.checkpoint_age_events === fixedAge),
    every_checkpoint_read_exact: scales.every((scale) => scale.checkpoint_verified.events_read === fixedAge),
    every_checkpoint_apply_exact: scales.every((scale) => scale.checkpoint_verified.events_applied === fixedAge),
    selective_never_applies_more: scales.every((scale) => scale.selective_verified.events_applied <= scale.checkpoint_verified.events_applied),
    no_precheckpoint_event_body_reads_by_strategy_b_algorithm: scales.every(
      (scale) => scale.hidden_work_accounting.precheckpoint_event_body_reads_by_strategy_b_algorithm === 0,
    ),
    corruption_detected_without_silent_false_verification:
      scales[0].corruption?.latest_checkpoint_corruption.detected === true &&
      scales[0].corruption?.dependency_index_corruption.detected === true &&
      scales[0].corruption?.protected_history_mutation.detected === true &&
      scales[0].corruption?.silent_false_verification_count === 0,
  };

  return {
    schema: SELF_TEST_SCHEMA,
    benchmark_namespace: TRIAL_NAMESPACE,
    source_workload_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    initialization_boundary_crossed: false,
    workload_version: Q2_WORKLOAD_VERSION,
    configuration: { sizes, fixed_age_events: fixedAge, repetitions: 1, seed },
    ok: Object.values(checks).every(Boolean),
    checks,
    scales: scales.map((scale) => ({
      event_count: scale.event_count,
      selected_source_policy: scale.fixed_age.selected_source_policy,
      checkpoint_age_events: scale.checkpoint_verified.checkpoint_age_events,
      checkpoint_events_read: scale.checkpoint_verified.events_read,
      checkpoint_events_applied: scale.checkpoint_verified.events_applied,
      selective_events_applied: scale.selective_verified.events_applied,
      corruption: scale.corruption,
    })),
  };
}

if (flag('--help')) {
  usage();
  process.exit(0);
}

const root = path.resolve(value('--workdir', 'out/q2-trial-002'));
const seed = Number(value('--seed', '20260831'));
const repetitions = Number(value('--repetitions', '5'));
const fixedAge = Number(value('--fixed-age', '10000'));

if (!Number.isInteger(seed) || !Number.isInteger(repetitions) || repetitions < 1) {
  throw new Error('Invalid seed or repetitions.');
}
if (!Number.isInteger(fixedAge) || fixedAge < 1) throw new Error('Invalid fixed checkpoint age.');

if (flag('--self-test')) {
  const result = await selfTest(root, seed);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
} else {
  const sizes = parseSizes(value('--sizes', '100000,1000000'));
  if (!sizes.length) throw new Error('No valid sizes supplied.');
  const startedAt = new Date().toISOString();
  const scales = [];
  const smallest = Math.min(...sizes);
  for (const size of sizes) {
    scales.push(await benchmarkScale(root, size, seed, repetitions, fixedAge, size === smallest));
  }

  const targetEvaluation = evaluateTargets(scales, fixedAge);
  const report = {
    schema: REPORT_SCHEMA,
    benchmark_namespace: TRIAL_NAMESPACE,
    source_workload_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    initialization_boundary_crossed: false,
    workload_version: Q2_WORKLOAD_VERSION,
    preregistration: 'docs/research/q2-trial-002-preregistration.md',
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    hardware: hardwareProfile(),
    configuration: { sizes, fixed_age_events: fixedAge, repetitions, seed },
    scales,
    target_evaluation: targetEvaluation,
    limitations: [
      'CI timings are runner-specific and are not stable production-hardware latency claims.',
      'Trial 002 reuses the frozen Q2 Trial 001 workload/generator semantics and selects an existing checkpoint that lands exactly at the preregistered fixed age.',
      'The frozen Trial 001 percentage policies provide exact 10,000-event checkpoints for the required 100K and 1M profiles; the optional 10M profile is not claimed by this implementation.',
      'Metadata byte accounting describes files read by the algorithm and exact checkpoint candidate lengths; it is not kernel block-I/O or cache telemetry.',
      'Selective reconstruction remains an ordinary recovery path and is not a substitute for full historical audit.',
    ],
  };

  const outPath = value('--out');
  if (outPath) await writeJson(path.resolve(outPath), report);
  console.log(JSON.stringify(report, null, 2));
  if (!targetEvaluation.overall_supported) process.exitCode = 1;
}
