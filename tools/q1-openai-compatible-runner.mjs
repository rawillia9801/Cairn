#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);

function value(name, fallback = undefined) {
  const direct = argv.indexOf(name);
  if (direct >= 0 && direct + 1 < argv.length) return argv[direct + 1];
  const prefixed = argv.find((item) => item.startsWith(`${name}=`));
  return prefixed ? prefixed.slice(name.length + 1) : fallback;
}

function required(name, envName) {
  const result = value(name) ?? process.env[envName];
  if (!result) throw new Error(`Missing ${name} or ${envName}.`);
  return result;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function usage() {
  console.log(`Cairn Q1 blinded OpenAI-compatible engine runner\n\nPurpose:\n  Execute one blinded Trial 001 model arm against the already frozen synthetic\n  Q1 prompt package. This runner does not read benchmark ground truth or scorer\n  fixtures and does not initialize Cairn.\n\nUsage:\n  npm run benchmark:q1:run -- \\\n    --prompt ./q1-prompts.json \\\n    --expected-sha256 <frozen prompt sha> \\\n    --endpoint https://provider.example/v1/chat/completions \\\n    --model provider/model-id \\\n    --label engine-a \\\n    --out ./out/engine-a\n\nEnvironment alternatives:\n  Q1_ENDPOINT, Q1_API_KEY, Q1_MODEL, Q1_EXPECTED_PROMPT_SHA256\n\nThe endpoint must accept an OpenAI-compatible chat-completions request.\nThe raw HTTP response is preserved before any parsing or normalization.\n`);
}

if (argv.includes('--help')) {
  usage();
  process.exit(0);
}

const promptPath = path.resolve(required('--prompt', 'Q1_PROMPT_FILE'));
const expectedPromptHash = required('--expected-sha256', 'Q1_EXPECTED_PROMPT_SHA256').toLowerCase();
const endpoint = required('--endpoint', 'Q1_ENDPOINT');
const model = required('--model', 'Q1_MODEL');
const apiKey = value('--api-key') ?? process.env.Q1_API_KEY ?? '';
const label = value('--label', model.replace(/[^a-zA-Z0-9._-]+/g, '-'));
const outputDir = path.resolve(value('--out', `out/q1-trial-001/${label}`));
const temperatureRaw = value('--temperature', process.env.Q1_TEMPERATURE ?? '0');
const temperature = Number(temperatureRaw);

if (!Number.isFinite(temperature)) throw new Error(`Invalid temperature: ${temperatureRaw}`);

const promptBytes = await readFile(promptPath);
const actualPromptHash = sha256(promptBytes);
if (actualPromptHash !== expectedPromptHash) {
  throw new Error(`Frozen prompt hash mismatch. Expected ${expectedPromptHash}, got ${actualPromptHash}. Refusing to run.`);
}

const promptPackage = JSON.parse(promptBytes.toString('utf8'));
if (promptPackage.authoritative_cairn_state !== false || promptPackage.benchmark_namespace !== 'synthetic-q1-non-authoritative') {
  throw new Error('Refusing to run: prompt package is not explicitly synthetic and non-authoritative.');
}

const transportInstruction = [
  'You are participating in a blinded synthetic benchmark.',
  'Use only the supplied Q1 prompt package.',
  'Return one JSON object matching promptPackage.response_schema.',
  'Do not add Markdown fences or explanatory prose.',
].join(' ');

const requestBody = {
  model,
  temperature,
  messages: [
    { role: 'system', content: transportInstruction },
    { role: 'user', content: JSON.stringify(promptPackage) },
  ],
};

const startedAt = new Date().toISOString();
const headers = { 'content-type': 'application/json' };
if (apiKey) headers.authorization = `Bearer ${apiKey}`;

const response = await fetch(endpoint, {
  method: 'POST',
  headers,
  body: JSON.stringify(requestBody),
});

const rawBytes = Buffer.from(await response.arrayBuffer());
const finishedAt = new Date().toISOString();
const rawHash = sha256(rawBytes);

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'raw-response.bin'), rawBytes);

const responseHeaders = Object.fromEntries(response.headers.entries());
const metadata = {
  schema: 'cairn.q1-trial-arm-metadata.v1',
  benchmark_namespace: promptPackage.benchmark_namespace,
  authoritative_cairn_state: false,
  initialization_boundary_crossed: false,
  label,
  endpoint,
  model,
  temperature,
  prompt_file: promptPath,
  prompt_sha256: actualPromptHash,
  started_at: startedAt,
  finished_at: finishedAt,
  http_status: response.status,
  response_headers: responseHeaders,
  raw_response_sha256: rawHash,
  raw_response_file: 'raw-response.bin',
  transport_instruction: transportInstruction,
};
await writeJson(path.join(outputDir, 'metadata.json'), metadata);

if (!response.ok) {
  console.error(JSON.stringify(metadata, null, 2));
  throw new Error(`Model endpoint returned HTTP ${response.status}. Raw response preserved at ${outputDir}.`);
}

let envelope;
try {
  envelope = JSON.parse(rawBytes.toString('utf8'));
} catch {
  console.error(JSON.stringify(metadata, null, 2));
  throw new Error(`Provider response was not JSON. Raw response preserved at ${outputDir}.`);
}

const content = envelope?.choices?.[0]?.message?.content;
if (typeof content !== 'string') {
  console.error(JSON.stringify(metadata, null, 2));
  throw new Error(`OpenAI-compatible response did not contain choices[0].message.content. Raw response preserved at ${outputDir}.`);
}

await writeFile(path.join(outputDir, 'model-content.raw.txt'), content, 'utf8');

let modelOutput;
try {
  modelOutput = JSON.parse(content);
} catch {
  throw new Error(`Model content was not valid JSON. Original provider response and model content were preserved at ${outputDir}; do not hand-correct benchmark facts.`);
}

await writeJson(path.join(outputDir, 'engine-output.json'), modelOutput);
await writeJson(path.join(outputDir, 'manifest.json'), {
  ...metadata,
  model_content_sha256: sha256(Buffer.from(content, 'utf8')),
  engine_output_file: 'engine-output.json',
});

console.log(JSON.stringify({
  ok: true,
  label,
  model,
  prompt_sha256: actualPromptHash,
  raw_response_sha256: rawHash,
  output_dir: outputDir,
}, null, 2));
