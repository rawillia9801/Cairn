import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, open, readFile, stat, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import readline from 'node:readline';
import path from 'node:path';
import os from 'node:os';
import { performance } from 'node:perf_hooks';

export const Q2_NAMESPACE = 'synthetic-q2-trial-001-non-authoritative';
export const Q2_WORKLOAD_VERSION = 'q2t1-v1';
export const Q2_GENESIS_HASH = '0'.repeat(64);

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalEvent(event) {
  return {
    seq: event.seq,
    event_id: event.event_id,
    time: event.time,
    type: event.type,
    actor: event.actor,
    source: event.source,
    payload: event.payload,
    prev_hash: event.prev_hash,
  };
}

export function computeEventHash(event) {
  return sha256(stableStringify(canonicalEvent(event)));
}

function checkpointPayload(entry) {
  const { integrity_digest: _ignored, ...payload } = entry;
  return payload;
}

export function checkpointDigest(entry) {
  return sha256(stableStringify(checkpointPayload(entry)));
}

export function envelopeDigest(content) {
  return sha256(stableStringify(content));
}

export function makeEnvelope(content) {
  return { content, integrity_digest: envelopeDigest(content) };
}

export function verifyEnvelope(envelope) {
  return Boolean(envelope && envelope.content && envelope.integrity_digest === envelopeDigest(envelope.content));
}

function blankState() {
  return {
    state: {},
    unresolved_commitments: {},
    revision_heads: {},
    last_transition: null,
    last_event_hash: Q2_GENESIS_HASH,
    last_seq: 0,
  };
}

export function cloneState(state) {
  return structuredClone(state);
}

export function normalizeState(state) {
  const sortedObject = (input) => Object.fromEntries(Object.entries(input ?? {}).sort(([a], [b]) => a.localeCompare(b)));
  return {
    state: sortedObject(state.state),
    unresolved_commitments: sortedObject(state.unresolved_commitments),
    revision_heads: sortedObject(state.revision_heads),
    last_transition: state.last_transition,
    last_event_hash: state.last_event_hash,
    last_seq: state.last_seq,
  };
}

export function statesEqual(a, b) {
  return stableStringify(normalizeState(a)) === stableStringify(normalizeState(b));
}

export function applyEvent(state, event) {
  const { type, payload } = event;
  if (type === 'state_asserted' || type === 'state_corrected') {
    state.state[payload.key] = { value: payload.value, event_id: event.event_id };
    state.revision_heads[payload.key] = {
      current_event_id: event.event_id,
      previous_event_id: payload.supersedes_event_id ?? null,
    };
  } else if (type === 'commitment_created') {
    state.unresolved_commitments[payload.commitment_id] = {
      commitment_id: payload.commitment_id,
      created_event_id: event.event_id,
      due_tick: payload.due_tick,
    };
  } else if (type === 'commitment_completed') {
    delete state.unresolved_commitments[payload.commitment_id];
  } else if (type === 'continuity_handoff') {
    state.last_transition = { event_id: event.event_id, from: payload.from, to: payload.to };
  }
  state.last_event_hash = event.event_hash;
  state.last_seq = event.seq;
  return state;
}

function eventTime(seq, eventCount) {
  const base = Date.UTC(2026, 0, 1, 0, 0, 0);
  const spanMs = Math.floor(8 * 365.25 * 24 * 60 * 60 * 1000);
  const fraction = eventCount <= 1 ? 0 : (seq - 1) / (eventCount - 1);
  return new Date(base + Math.floor(spanMs * fraction)).toISOString();
}

function stateKey(index) {
  return `state.key.${String(index % 64).padStart(2, '0')}`;
}

function makeSyntheticEvent(seq, eventCount, seed, generationState, pendingQueue) {
  const eventId = `q2e${String(seq).padStart(9, '0')}`;
  let type;
  let actor;
  let source;
  let payload;

  if (seq % 997 === 0) {
    type = 'continuity_handoff';
    actor = 'synthetic-platform';
    const turn = Math.floor(seq / 997);
    payload = { from: `synthetic-host-${turn % 5}`, to: `synthetic-host-${(turn + 1) % 5}` };
    source = `synthetic-handoff-${turn}`;
  } else if (seq % 389 === 0) {
    const key = stateKey(Math.floor(seq / 389) * 7 + seed);
    const previous = generationState.state[key]?.event_id ?? null;
    type = previous ? 'state_corrected' : 'state_asserted';
    actor = 'synthetic-operator';
    payload = { key, value: `v${(seq * 48271 + seed) % 100000}`, supersedes_event_id: previous };
    source = `synthetic-correction-${Math.floor(seq / 389)}`;
  } else if (seq % 211 === 0) {
    const commitmentId = `C-${String(seq).padStart(9, '0')}`;
    type = 'commitment_created';
    actor = 'synthetic-agent';
    payload = { commitment_id: commitmentId, due_tick: seq + 5000 + (seed % 997) };
    source = `synthetic-commitment-${seq}`;
    pendingQueue.push(commitmentId);
  } else if (seq % 223 === 0 && pendingQueue.length) {
    const commitmentId = pendingQueue.shift();
    type = 'commitment_completed';
    actor = 'synthetic-agent';
    payload = { commitment_id: commitmentId };
    source = `synthetic-completion-${seq}`;
  } else if (seq % 97 === 0) {
    const key = stateKey(Math.floor(seq / 97) + seed);
    const previous = generationState.state[key]?.event_id ?? null;
    type = previous ? 'state_corrected' : 'state_asserted';
    actor = 'synthetic-operator';
    payload = { key, value: `v${(seq * 69621 + seed * 13) % 100000}`, supersedes_event_id: previous };
    source = `synthetic-state-${Math.floor(seq / 97)}`;
  } else if (seq % 331 === 0) {
    type = 'supporting_evidence';
    actor = 'synthetic-observer';
    payload = { supports_key: stateKey(Math.floor(seq / 331) * 3 + seed), observation: (seq * 31 + seed) % 1000 };
    source = `synthetic-evidence-${Math.floor(seq / 331)}`;
  } else if (seq % 53 === 0) {
    type = 'derived_summary';
    actor = 'synthetic-summary-engine';
    payload = { authoritative: false, summary_tick: seq, text: `Derived synthetic summary ${seq}` };
    source = `synthetic-derived-${Math.floor(seq / 53)}`;
  } else {
    type = 'telemetry_observed';
    actor = 'synthetic-monitor';
    payload = { metric: `metric.${seq % 23}`, value: (seq * 17 + seed) % 10000 };
    source = `synthetic-telemetry-${seq % 17}`;
  }

  const event = {
    seq,
    event_id: eventId,
    time: eventTime(seq, eventCount),
    type,
    actor,
    source,
    payload,
    prev_hash: generationState.last_event_hash,
  };
  event.event_hash = computeEventHash(event);
  return event;
}

export function eventAffectsBaseline(event) {
  return ['state_asserted', 'state_corrected', 'commitment_created', 'commitment_completed', 'continuity_handoff'].includes(event.type);
}

async function writeStreamLine(stream, text) {
  if (!stream.write(text)) await once(stream, 'drain');
}

async function closeWriteStream(stream) {
  stream.end();
  await once(stream, 'finish');
}

function policySpecs(eventCount) {
  return [
    { id: 'pct-1', fraction: 0.01 },
    { id: 'pct-5', fraction: 0.05 },
    { id: 'pct-10', fraction: 0.10 },
  ].map((item) => ({ ...item, interval_events: Math.max(1, Math.floor(eventCount * item.fraction)) }));
}

function checkpointEntry(policy, state, nextOffset) {
  const content = {
    schema: 'cairn.q2-checkpoint.v1',
    benchmark_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    policy: policy.id,
    interval_events: policy.interval_events,
    seq: state.last_seq,
    event_hash: state.last_event_hash,
    next_offset: nextOffset,
    snapshot: normalizeState(state),
  };
  return { ...content, integrity_digest: checkpointDigest(content) };
}

async function fileSize(filePath) {
  return (await stat(filePath)).size;
}

async function directorySize(dirPath) {
  let total = 0;
  for (const entry of await readdir(dirPath, { withFileTypes: true })) {
    const target = path.join(dirPath, entry.name);
    total += entry.isDirectory() ? await directorySize(target) : (await stat(target)).size;
  }
  return total;
}

export async function generateDataset({ workdir, eventCount, seed = 20260831, segmentSize = 10000 }) {
  await rm(workdir, { recursive: true, force: true });
  await mkdir(workdir, { recursive: true });
  const dependencyDir = path.join(workdir, 'dependency');
  const checkpointDir = path.join(workdir, 'checkpoints');
  await mkdir(dependencyDir, { recursive: true });
  await mkdir(checkpointDir, { recursive: true });

  const eventLogPath = path.join(workdir, 'events.ndjson');
  const eventStream = createWriteStream(eventLogPath, { encoding: 'utf8' });
  const policies = policySpecs(eventCount);
  const checkpointStreams = new Map();
  const checkpointFiles = new Map();
  const checkpointOffsets = new Map();
  const checkpointIndexes = new Map();
  for (const policy of policies) {
    const filePath = path.join(checkpointDir, `${policy.id}.ndjson`);
    checkpointFiles.set(policy.id, filePath);
    checkpointStreams.set(policy.id, createWriteStream(filePath, { encoding: 'utf8' }));
    checkpointOffsets.set(policy.id, 0);
    checkpointIndexes.set(policy.id, []);
  }

  const generationState = blankState();
  const pendingQueue = [];
  let offset = 0;
  let segmentEntries = [];
  let segmentStartSeq = 1;
  let segmentStartPrevHash = Q2_GENESIS_HASH;
  const segments = [];
  const typeCounts = {};
  const started = performance.now();

  async function flushSegment(endSeq, endHash) {
    if (endSeq < segmentStartSeq) return;
    const content = {
      schema: 'cairn.q2-dependency-segment.v1',
      benchmark_namespace: Q2_NAMESPACE,
      authoritative_cairn_state: false,
      start_seq: segmentStartSeq,
      end_seq: endSeq,
      start_prev_hash: segmentStartPrevHash,
      end_hash: endHash,
      entries: segmentEntries,
    };
    const envelope = makeEnvelope(content);
    const filename = `segment-${String(segmentStartSeq).padStart(9, '0')}-${String(endSeq).padStart(9, '0')}.json`;
    await writeFile(path.join(dependencyDir, filename), `${JSON.stringify(envelope)}\n`, 'utf8');
    segments.push({
      filename,
      start_seq: segmentStartSeq,
      end_seq: endSeq,
      entry_count: segmentEntries.length,
      integrity_digest: envelope.integrity_digest,
      end_hash: endHash,
    });
    segmentEntries = [];
    segmentStartSeq = endSeq + 1;
    segmentStartPrevHash = endHash;
  }

  for (let seq = 1; seq <= eventCount; seq += 1) {
    const event = makeSyntheticEvent(seq, eventCount, seed, generationState, pendingQueue);
    const line = `${JSON.stringify(event)}\n`;
    const length = Buffer.byteLength(line);
    await writeStreamLine(eventStream, line);

    typeCounts[event.type] = (typeCounts[event.type] ?? 0) + 1;
    if (eventAffectsBaseline(event)) {
      segmentEntries.push({ seq, offset, length, event_hash: event.event_hash, event_id: event.event_id, type: event.type });
    }

    offset += length;
    applyEvent(generationState, event);

    for (const policy of policies) {
      if (seq < eventCount && seq % policy.interval_events === 0) {
        const entry = checkpointEntry(policy, generationState, offset);
        const checkpointLine = `${JSON.stringify(entry)}\n`;
        const checkpointLength = Buffer.byteLength(checkpointLine);
        const checkpointOffset = checkpointOffsets.get(policy.id);
        checkpointIndexes.get(policy.id).push({
          seq: entry.seq,
          offset: checkpointOffset,
          length: checkpointLength,
          integrity_digest: entry.integrity_digest,
        });
        checkpointOffsets.set(policy.id, checkpointOffset + checkpointLength);
        await writeStreamLine(checkpointStreams.get(policy.id), checkpointLine);
      }
    }

    if (seq % segmentSize === 0 || seq === eventCount) await flushSegment(seq, event.event_hash);
  }

  await closeWriteStream(eventStream);
  for (const stream of checkpointStreams.values()) await closeWriteStream(stream);

  const dependencyManifestContent = {
    schema: 'cairn.q2-dependency-manifest.v1',
    benchmark_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    segment_size: segmentSize,
    segments,
  };
  const dependencyManifest = makeEnvelope(dependencyManifestContent);
  const dependencyManifestPath = path.join(workdir, 'dependency-manifest.json');
  await writeFile(dependencyManifestPath, `${JSON.stringify(dependencyManifest, null, 2)}\n`, 'utf8');

  const checkpointStats = [];
  for (const policy of policies) {
    const filePath = checkpointFiles.get(policy.id);
    checkpointStats.push({
      policy: policy.id,
      fraction: policy.fraction,
      interval_events: policy.interval_events,
      file: path.relative(workdir, filePath),
      bytes: await fileSize(filePath),
      checkpoints: checkpointIndexes.get(policy.id),
    });
  }

  const manifestContent = {
    schema: 'cairn.q2-dataset-manifest.v1',
    benchmark_namespace: Q2_NAMESPACE,
    authoritative_cairn_state: false,
    workload_version: Q2_WORKLOAD_VERSION,
    seed,
    synthetic_years: 8,
    event_count: eventCount,
    event_log_file: path.relative(workdir, eventLogPath),
    event_log_bytes: await fileSize(eventLogPath),
    final_event_hash: generationState.last_event_hash,
    dependency_manifest_file: path.relative(workdir, dependencyManifestPath),
    dependency_manifest_digest: dependencyManifest.integrity_digest,
    dependency_bytes: await directorySize(dependencyDir) + await fileSize(dependencyManifestPath),
    checkpoint_policies: checkpointStats,
    checkpoint_bytes: checkpointStats.reduce((sum, item) => sum + item.bytes, 0),
    type_counts: typeCounts,
    expected_baseline: normalizeState(generationState),
  };
  const datasetManifest = makeEnvelope(manifestContent);
  const manifestPath = path.join(workdir, 'dataset-manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(datasetManifest, null, 2)}\n`, 'utf8');

  return {
    workdir,
    manifest_path: manifestPath,
    manifest: datasetManifest,
    generation_ms: performance.now() - started,
    storage: {
      event_log_bytes: manifestContent.event_log_bytes,
      checkpoint_bytes: manifestContent.checkpoint_bytes,
      dependency_bytes: manifestContent.dependency_bytes,
      manifest_bytes: await fileSize(manifestPath),
      overhead_ratio: (manifestContent.checkpoint_bytes + manifestContent.dependency_bytes + await fileSize(manifestPath)) / manifestContent.event_log_bytes,
    },
  };
}

export async function loadDatasetManifest(workdir) {
  const envelope = JSON.parse(await readFile(path.join(workdir, 'dataset-manifest.json'), 'utf8'));
  if (!verifyEnvelope(envelope)) throw new Error('Dataset manifest integrity verification failed.');
  if (envelope.content.benchmark_namespace !== Q2_NAMESPACE || envelope.content.authoritative_cairn_state !== false) {
    throw new Error('Q2 refused dataset: not explicitly synthetic/non-authoritative.');
  }
  return envelope;
}

function lineReader(filePath, start = undefined) {
  const stream = createReadStream(filePath, start === undefined ? {} : { start });
  return readline.createInterface({ input: stream, crlfDelay: Infinity });
}

export async function reconstructFull(workdir, { verify = true, eventLogOverride = null } = {}) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const eventLogPath = eventLogOverride ?? path.join(workdir, manifest.event_log_file);
  const state = blankState();
  let expectedPrev = Q2_GENESIS_HASH;
  let eventsRead = 0;
  let eventsApplied = 0;

  const rl = lineReader(eventLogPath);
  for await (const line of rl) {
    if (!line) continue;
    const event = JSON.parse(line);
    eventsRead += 1;
    if (verify) {
      if (event.prev_hash !== expectedPrev) throw new Error(`History predecessor mismatch at seq ${event.seq}.`);
      if (computeEventHash(event) !== event.event_hash) throw new Error(`History event hash mismatch at seq ${event.seq}.`);
      expectedPrev = event.event_hash;
    }
    applyEvent(state, event);
    eventsApplied += 1;
  }
  if (verify && expectedPrev !== manifest.final_event_hash) throw new Error('History terminal hash mismatch.');
  return { state: normalizeState(state), events_read: eventsRead, events_applied: eventsApplied, fallback: null };
}

async function readExactJsonLine(fileHandle, offset, length) {
  const buffer = Buffer.alloc(length);
  const { bytesRead } = await fileHandle.read(buffer, 0, length, offset);
  if (bytesRead !== length) throw new Error(`Short event-log read at offset ${offset}.`);
  return JSON.parse(buffer.toString('utf8').trim());
}

async function latestValidCheckpoint(workdir, policyId, checkpointFileOverride = null) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const policy = manifest.checkpoint_policies.find((item) => item.policy === policyId);
  if (!policy) throw new Error(`Unknown checkpoint policy: ${policyId}`);
  const filePath = checkpointFileOverride ?? path.join(workdir, policy.file);
  const fh = await open(filePath, 'r');
  let rejected = 0;
  try {
    for (let index = policy.checkpoints.length - 1; index >= 0; index -= 1) {
      const meta = policy.checkpoints[index];
      try {
        const entry = await readExactJsonLine(fh, meta.offset, meta.length);
        const valid = entry.integrity_digest === checkpointDigest(entry) && entry.integrity_digest === meta.integrity_digest;
        if (valid) return { checkpoint: entry, rejected_checkpoint_count: rejected, policy };
      } catch {
        // Invalid or truncated checkpoint content is a rejected candidate.
      }
      rejected += 1;
    }
  } finally {
    await fh.close();
  }
  return { checkpoint: null, rejected_checkpoint_count: rejected, policy };
}

export async function reconstructCheckpoint(workdir, policyId, { verify = true, checkpointFileOverride = null } = {}) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const loaded = await latestValidCheckpoint(workdir, policyId, checkpointFileOverride);
  if (!loaded.checkpoint) {
    const full = await reconstructFull(workdir, { verify });
    return { ...full, fallback: 'full-replay-no-valid-checkpoint', rejected_checkpoint_count: loaded.rejected_checkpoint_count };
  }

  const cp = loaded.checkpoint;
  const state = cloneState(cp.snapshot);
  let expectedPrev = cp.event_hash;
  let eventsRead = 0;
  let eventsApplied = 0;
  const rl = lineReader(path.join(workdir, manifest.event_log_file), cp.next_offset);
  for await (const line of rl) {
    if (!line) continue;
    const event = JSON.parse(line);
    eventsRead += 1;
    if (verify) {
      if (event.prev_hash !== expectedPrev) throw new Error(`Checkpoint tail predecessor mismatch at seq ${event.seq}.`);
      if (computeEventHash(event) !== event.event_hash) throw new Error(`Checkpoint tail event hash mismatch at seq ${event.seq}.`);
      expectedPrev = event.event_hash;
    }
    applyEvent(state, event);
    eventsApplied += 1;
  }
  if (verify && expectedPrev !== manifest.final_event_hash) throw new Error('Checkpoint tail terminal hash mismatch.');
  return {
    state: normalizeState(state),
    events_read: eventsRead,
    events_applied: eventsApplied,
    checkpoint_seq: cp.seq,
    checkpoint_age_events: manifest.event_count - cp.seq,
    rejected_checkpoint_count: loaded.rejected_checkpoint_count,
    fallback: loaded.rejected_checkpoint_count ? 'previous-valid-checkpoint' : null,
  };
}

async function loadDependencyManifest(workdir) {
  const dataset = (await loadDatasetManifest(workdir)).content;
  const envelope = JSON.parse(await readFile(path.join(workdir, dataset.dependency_manifest_file), 'utf8'));
  if (!verifyEnvelope(envelope) || envelope.integrity_digest !== dataset.dependency_manifest_digest) {
    throw new Error('Dependency manifest integrity verification failed.');
  }
  return envelope.content;
}

export async function reconstructSelective(workdir, policyId, {
  verify = true,
  checkpointFileOverride = null,
  dependencyFileOverrides = null,
  fallbackOnDependencyFailure = true,
} = {}) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const loaded = await latestValidCheckpoint(workdir, policyId, checkpointFileOverride);
  if (!loaded.checkpoint) {
    const full = await reconstructFull(workdir, { verify });
    return { ...full, fallback: 'full-replay-no-valid-checkpoint', rejected_checkpoint_count: loaded.rejected_checkpoint_count };
  }

  const cp = loaded.checkpoint;
  const state = cloneState(cp.snapshot);
  const dependencyManifest = await loadDependencyManifest(workdir);
  const relevantSegments = dependencyManifest.segments.filter((segment) => segment.end_seq > cp.seq);
  const eventFile = await open(path.join(workdir, manifest.event_log_file), 'r');
  let eventsRead = 0;
  let eventsApplied = 0;
  let selectedCount = 0;

  try {
    for (const segmentMeta of relevantSegments) {
      const segmentPath = dependencyFileOverrides?.[segmentMeta.filename] ?? path.join(workdir, 'dependency', segmentMeta.filename);
      const envelope = JSON.parse(await readFile(segmentPath, 'utf8'));
      if (verify && (!verifyEnvelope(envelope) || envelope.integrity_digest !== segmentMeta.integrity_digest)) {
        throw new Error(`Dependency segment integrity verification failed: ${segmentMeta.filename}`);
      }
      const entries = envelope.content.entries.filter((entry) => entry.seq > cp.seq);
      selectedCount += entries.length;
      for (const entry of entries) {
        const event = await readExactJsonLine(eventFile, entry.offset, entry.length);
        eventsRead += 1;
        if (verify) {
          const computed = computeEventHash(event);
          if (computed !== event.event_hash || event.event_hash !== entry.event_hash) {
            throw new Error(`Selective event integrity verification failed at seq ${event.seq}.`);
          }
        }
        applyEvent(state, event);
        eventsApplied += 1;
      }
    }
  } catch (error) {
    await eventFile.close();
    if (fallbackOnDependencyFailure) {
      const fallback = await reconstructCheckpoint(workdir, policyId, { verify, checkpointFileOverride });
      return {
        ...fallback,
        fallback: 'checkpoint-incremental-after-dependency-rejection',
        dependency_error: String(error.message ?? error),
        dependency_selected_events: selectedCount,
      };
    }
    throw error;
  }
  await eventFile.close();

  // Skipped non-dependent events are represented by verified dataset/dependency metadata.
  // This is ordinary selective recovery, not a claim of full tail audit.
  state.last_event_hash = manifest.final_event_hash;
  state.last_seq = manifest.event_count;

  return {
    state: normalizeState(state),
    events_read: eventsRead,
    events_applied: eventsApplied,
    dependency_selected_events: selectedCount,
    checkpoint_seq: cp.seq,
    checkpoint_age_events: manifest.event_count - cp.seq,
    rejected_checkpoint_count: loaded.rejected_checkpoint_count,
    fallback: loaded.rejected_checkpoint_count ? 'previous-valid-checkpoint' : null,
    integrity_scope: 'checkpoint + dependency metadata + selected events',
  };
}

export function assertMatchesExpected(manifestEnvelope, result) {
  if (!statesEqual(manifestEnvelope.content.expected_baseline, result.state)) {
    throw new Error('Reconstructed authoritative baseline does not match generated ground truth.');
  }
  return true;
}

function percentile(sorted, q) {
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)];
}

export async function measureRepeated(fn, repetitions = 5) {
  await fn();
  const runs = [];
  for (let index = 0; index < repetitions; index += 1) {
    const beforeCpu = process.cpuUsage();
    const start = performance.now();
    const value = await fn();
    const elapsed = performance.now() - start;
    const cpu = process.cpuUsage(beforeCpu);
    runs.push({
      run: index + 1,
      latency_ms: Number(elapsed.toFixed(3)),
      cpu_user_ms: Number((cpu.user / 1000).toFixed(3)),
      cpu_system_ms: Number((cpu.system / 1000).toFixed(3)),
      max_rss_kb_process_highwater: process.resourceUsage().maxRSS,
      events_read: value.events_read,
      events_applied: value.events_applied,
      checkpoint_age_events: value.checkpoint_age_events ?? null,
      fallback: value.fallback ?? null,
    });
  }
  const latencies = runs.map((item) => item.latency_ms).sort((a, b) => a - b);
  return {
    repetitions,
    runs,
    p50_latency_ms: percentile(latencies, 0.50),
    p95_latency_ms: percentile(latencies, 0.95),
    min_latency_ms: latencies[0],
    max_latency_ms: latencies.at(-1),
    events_read: runs[0]?.events_read ?? 0,
    events_applied: runs[0]?.events_applied ?? 0,
    checkpoint_age_events: runs[0]?.checkpoint_age_events ?? null,
  };
}

export function hardwareProfile() {
  return {
    platform: process.platform,
    arch: process.arch,
    os_release: os.release(),
    cpu_model: os.cpus()[0]?.model ?? null,
    logical_cpu_count: os.cpus().length,
    total_memory_bytes: os.totalmem(),
    node_version: process.version,
  };
}

export async function corruptLatestCheckpoint(workdir, policyId, outputPath) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const policy = manifest.checkpoint_policies.find((item) => item.policy === policyId);
  const inputPath = path.join(workdir, policy.file);
  const lines = (await readFile(inputPath, 'utf8')).trimEnd().split('\n');
  const latest = JSON.parse(lines.at(-1));
  const firstKey = Object.keys(latest.snapshot.state)[0];
  if (firstKey) {
    const original = String(latest.snapshot.state[firstKey].value);
    latest.snapshot.state[firstKey].value = `${original.slice(0, -1)}${original.endsWith('X') ? 'Y' : 'X'}`;
  }
  lines[lines.length - 1] = JSON.stringify(latest);
  await writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  return outputPath;
}

export async function corruptDependencySegment(workdir, policyId, outputPath) {
  const loaded = await latestValidCheckpoint(workdir, policyId);
  const dependencyManifest = await loadDependencyManifest(workdir);
  const targetMeta = dependencyManifest.segments.find((segment) => segment.end_seq > loaded.checkpoint.seq && segment.entry_count > 0);
  if (!targetMeta) throw new Error('No dependency segment available for corruption probe.');
  const envelope = JSON.parse(await readFile(path.join(workdir, 'dependency', targetMeta.filename), 'utf8'));
  if (envelope.content.entries.length) envelope.content.entries.pop();
  await writeFile(outputPath, `${JSON.stringify(envelope)}\n`, 'utf8');
  return { filename: targetMeta.filename, path: outputPath };
}

export async function corruptHistoryCopy(workdir, outputPath) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  await cp(path.join(workdir, manifest.event_log_file), outputPath);
  const fh = await open(outputPath, 'r+');
  try {
    const buffer = Buffer.alloc(4096);
    const { bytesRead } = await fh.read(buffer, 0, buffer.length, 0);
    const text = buffer.subarray(0, bytesRead).toString('utf8');
    const marker = 'synthetic-monitor';
    const index = text.indexOf(marker);
    if (index < 0) throw new Error('Unable to locate mutation marker in history copy.');
    const byteOffset = Buffer.byteLength(text.slice(0, index));
    const replacement = Buffer.from('synthetic-monit0r', 'utf8');
    await fh.write(replacement, 0, replacement.length, byteOffset);
  } finally {
    await fh.close();
  }
  return outputPath;
}

export async function storageProfile(workdir) {
  const manifest = (await loadDatasetManifest(workdir)).content;
  const manifestBytes = await fileSize(path.join(workdir, 'dataset-manifest.json'));
  return {
    event_log_bytes: manifest.event_log_bytes,
    checkpoint_bytes: manifest.checkpoint_bytes,
    dependency_bytes: manifest.dependency_bytes,
    manifest_bytes: manifestBytes,
    overhead_ratio: (manifest.checkpoint_bytes + manifest.dependency_bytes + manifestBytes) / manifest.event_log_bytes,
  };
}
