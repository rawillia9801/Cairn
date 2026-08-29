#!/usr/bin/env node

import net from 'node:net';
import { performance } from 'node:perf_hooks';

const argv = process.argv.slice(2);

function argValue(name, fallback = undefined) {
  const prefix = `${name}=`;
  const direct = argv.find((value) => value.startsWith(prefix));
  if (direct) return direct.slice(prefix.length);
  const index = argv.indexOf(name);
  if (index >= 0 && index + 1 < argv.length) return argv[index + 1];
  return fallback;
}

function hasFlag(name) {
  return argv.includes(name);
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return Number(sorted[index].toFixed(2));
}

function summarize(samples) {
  const successes = samples.filter((sample) => sample.ok);
  const failures = samples.length - successes.length;
  const latencies = successes.map((sample) => sample.latency_ms);
  return {
    attempts: samples.length,
    successes: successes.length,
    failures,
    availability: samples.length ? Number((successes.length / samples.length).toFixed(4)) : 0,
    latency_ms: {
      min: latencies.length ? Number(Math.min(...latencies).toFixed(2)) : null,
      median: percentile(latencies, 50),
      p95: percentile(latencies, 95),
      max: latencies.length ? Number(Math.max(...latencies).toFixed(2)) : null,
    },
  };
}

async function tcpProbe({ host, port, timeoutMs }) {
  const started = performance.now();
  return await new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({
        transport: 'tcp',
        target: `${host}:${port}`,
        latency_ms: Number((performance.now() - started).toFixed(2)),
        ...result,
      });
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish({ ok: true }));
    socket.once('timeout', () => finish({ ok: false, error: 'timeout' }));
    socket.once('error', (error) => finish({ ok: false, error: error.code || error.message }));
  });
}

async function httpProbe({ url, timeoutMs }) {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'user-agent': 'cairn-transport-benchmark/0.1' },
    });
    return {
      transport: 'http',
      target: url,
      ok: response.status >= 200 && response.status < 500,
      status: response.status,
      latency_ms: Number((performance.now() - started).toFixed(2)),
    };
  } catch (error) {
    return {
      transport: 'http',
      target: url,
      ok: false,
      error: error?.name === 'AbortError' ? 'timeout' : String(error?.code || error?.message || error),
      latency_ms: Number((performance.now() - started).toFixed(2)),
    };
  } finally {
    clearTimeout(timer);
  }
}

function routeScore(summary) {
  if (!summary.attempts || !summary.successes || summary.latency_ms.p95 == null) return 0;
  const availabilityWeight = summary.availability * 1000;
  const latencyPenalty = Math.min(summary.latency_ms.p95, 5000) / 5;
  return Number(Math.max(0, availabilityWeight - latencyPenalty).toFixed(2));
}

async function runProbe(probe, attempts, intervalMs) {
  const samples = [];
  for (let index = 0; index < attempts; index += 1) {
    samples.push(await probe());
    if (index < attempts - 1 && intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  const summary = summarize(samples);
  return { samples, summary: { ...summary, route_score: routeScore(summary) } };
}

function usage() {
  console.log(`Cairn transport-only benchmark\n\nUsage:\n  node tools/transport-benchmark.mjs --http https://example.com [--attempts 5]\n  node tools/transport-benchmark.mjs --tcp example.com:443 [--attempts 5]\n\nOptions:\n  --http <url>           Probe an HTTP(S) endpoint with HEAD requests\n  --tcp <host:port>      Probe TCP connection establishment\n  --attempts <n>         Number of probes (default: 5)\n  --timeout-ms <n>       Per-probe timeout (default: 5000)\n  --interval-ms <n>      Delay between probes (default: 250)\n  --samples              Include individual samples in output\n  --help                 Show this help\n\nBoundary:\n  This tool measures infrastructure/transport only. It does not create, read,\n  mutate, reconstruct, or simulate authoritative Cairn state.\n`);
}

if (hasFlag('--help')) {
  usage();
  process.exit(0);
}

const attempts = Math.max(1, Number.parseInt(argValue('--attempts', '5'), 10));
const timeoutMs = Math.max(100, Number.parseInt(argValue('--timeout-ms', '5000'), 10));
const intervalMs = Math.max(0, Number.parseInt(argValue('--interval-ms', '250'), 10));
const httpUrl = argValue('--http');
const tcpTarget = argValue('--tcp');

if (!httpUrl && !tcpTarget) {
  usage();
  process.exitCode = 2;
} else {
  const results = [];

  if (httpUrl) {
    const result = await runProbe(() => httpProbe({ url: httpUrl, timeoutMs }), attempts, intervalMs);
    results.push({ kind: 'http', target: httpUrl, ...result });
  }

  if (tcpTarget) {
    const separator = tcpTarget.lastIndexOf(':');
    if (separator <= 0) throw new Error('--tcp must be formatted as host:port');
    const host = tcpTarget.slice(0, separator);
    const port = Number.parseInt(tcpTarget.slice(separator + 1), 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('invalid TCP port');
    const result = await runProbe(() => tcpProbe({ host, port, timeoutMs }), attempts, intervalMs);
    results.push({ kind: 'tcp', target: `${host}:${port}`, ...result });
  }

  const output = {
    schema: 'cairn.transport-benchmark.v1',
    generated_at: new Date().toISOString(),
    boundary: 'infrastructure-and-transport-only',
    cairn_state_touched: false,
    results: results.map((result) => hasFlag('--samples') ? result : ({ ...result, samples: undefined })),
  };

  console.log(JSON.stringify(output, null, 2));
}
