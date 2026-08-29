#!/usr/bin/env node

import fs from 'node:fs/promises';

const SOURCE_REVISION = 'cdb37ade6f8e80822e6c5ec4e6de457f2dcaf637';

function usage() {
  console.log(`Normalize exported LiveKit Agents metrics into Cairn transport/realtime benchmark observations.\n\nUsage:\n  node tools/livekit-metrics-normalize.mjs <metrics.json>\n  cat metrics.json | node tools/livekit-metrics-normalize.mjs -\n\nAccepted input:\n  - an array of LiveKit metric objects\n  - { "metrics": [...] }\n  - one LiveKit metric object\n\nOutput is deliberately non-authoritative and strips conversation text, prompts,\ntranscripts, tool payloads, memory, and other semantic/session state.\n`);
}

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function boolean(value) {
  return typeof value === 'boolean' ? value : undefined;
}

function text(value) {
  return typeof value === 'string' && value.length <= 160 ? value : undefined;
}

function metadata(metric) {
  const source = metric && typeof metric.metadata === 'object' ? metric.metadata : {};
  const result = {};
  const modelName = text(source?.model_name);
  const modelProvider = text(source?.model_provider);
  if (modelName) result.model_name = modelName;
  if (modelProvider) result.model_provider = modelProvider;
  return Object.keys(result).length ? result : undefined;
}

function pick(metric, fields) {
  const result = {};
  for (const field of fields) {
    const value = finiteNumber(metric?.[field]);
    if (value !== undefined) result[field] = value;
  }
  return result;
}

function normalizeMetric(metric, index) {
  if (!metric || typeof metric !== 'object' || Array.isArray(metric)) {
    return { ignored: true, index, reason: 'metric-not-an-object' };
  }

  const common = {
    type: text(metric.type) || 'unknown',
    timestamp: finiteNumber(metric.timestamp),
    metadata: metadata(metric),
  };

  let performance = {};
  let flags = {};

  switch (metric.type) {
    case 'stt_metrics':
      performance = pick(metric, ['duration', 'audio_duration', 'acquire_time']);
      flags = {
        streamed: boolean(metric.streamed),
        connection_reused: boolean(metric.connection_reused),
      };
      break;
    case 'tts_metrics':
      performance = pick(metric, ['ttfb', 'duration', 'audio_duration', 'acquire_time']);
      flags = {
        streamed: boolean(metric.streamed),
        cancelled: boolean(metric.cancelled),
        connection_reused: boolean(metric.connection_reused),
      };
      break;
    case 'llm_metrics':
      performance = pick(metric, ['duration', 'ttft', 'tokens_per_second']);
      flags = { cancelled: boolean(metric.cancelled) };
      break;
    case 'vad_metrics':
      performance = pick(metric, ['idle_time', 'inference_duration_total', 'inference_count']);
      break;
    case 'eou_metrics':
      performance = pick(metric, ['end_of_utterance_delay', 'transcription_delay', 'on_user_turn_completed_delay']);
      break;
    case 'eot_inference_metrics':
      performance = pick(metric, ['total_duration', 'detection_delay', 'prediction_duration', 'num_requests']);
      break;
    case 'realtime_model_metrics':
      performance = pick(metric, ['duration', 'session_duration', 'ttft', 'tokens_per_second', 'acquire_time']);
      flags = {
        cancelled: boolean(metric.cancelled),
        connection_reused: boolean(metric.connection_reused),
      };
      break;
    case 'interruption_metrics':
      performance = pick(metric, ['total_duration', 'prediction_duration', 'detection_delay', 'num_interruptions', 'num_backchannels', 'num_requests']);
      break;
    default:
      return { ignored: true, index, reason: `unsupported-metric-type:${text(metric.type) || 'unknown'}` };
  }

  return {
    ignored: false,
    index,
    observation: {
      ...common,
      performance,
      flags: Object.fromEntries(Object.entries(flags).filter(([, value]) => value !== undefined)),
    },
  };
}

async function readInput(path) {
  if (!path || path === '-') {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
  }
  return fs.readFile(path, 'utf8');
}

if (process.argv.includes('--help')) {
  usage();
  process.exit(0);
}

const raw = await readInput(process.argv[2]);
if (!raw.trim()) {
  console.error('No input received.');
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  console.error(`Invalid JSON: ${error.message}`);
  process.exit(2);
}

const metrics = Array.isArray(parsed)
  ? parsed
  : Array.isArray(parsed?.metrics)
    ? parsed.metrics
    : [parsed];

const normalized = metrics.map(normalizeMetric);
const observations = normalized.filter((entry) => !entry.ignored).map((entry) => entry.observation);
const ignored = normalized.filter((entry) => entry.ignored).map(({ index, reason }) => ({ index, reason }));

const output = {
  schema: 'cairn.transport-observation.v1',
  generated_at: new Date().toISOString(),
  source: {
    project: 'livekit/agents',
    revision: SOURCE_REVISION,
  },
  boundary: 'infrastructure-and-transport-only',
  authoritative: false,
  cairn_state_touched: false,
  semantic_content_retained: false,
  observations,
  ignored,
};

console.log(JSON.stringify(output, null, 2));
