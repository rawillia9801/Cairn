export type TransportObservation = {
  routeId: string;
  available: boolean;
  latencyMs: number | null;
  measuredAt: string;
};

export type TransportRouteSummary = {
  routeId: string;
  attempts: number;
  availability: number;
  medianLatencyMs: number | null;
  p95LatencyMs: number | null;
  score: number;
};

function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return Number(sorted[index].toFixed(2));
}

export function summarizeTransportRoute(
  routeId: string,
  observations: TransportObservation[],
): TransportRouteSummary {
  const route = observations.filter((observation) => observation.routeId === routeId);
  const successful = route.filter(
    (observation) => observation.available && observation.latencyMs !== null,
  );
  const latencies = successful.map((observation) => observation.latencyMs as number);
  const availability = route.length === 0 ? 0 : successful.length / route.length;
  const p95LatencyMs = percentile(latencies, 95);
  const availabilityWeight = availability * 1000;
  const latencyPenalty = p95LatencyMs === null ? 1000 : Math.min(p95LatencyMs, 5000) / 5;

  return {
    routeId,
    attempts: route.length,
    availability: Number(availability.toFixed(4)),
    medianLatencyMs: percentile(latencies, 50),
    p95LatencyMs,
    score: Number(Math.max(0, availabilityWeight - latencyPenalty).toFixed(2)),
  };
}

export function rankTransportRoutes(
  observations: TransportObservation[],
): TransportRouteSummary[] {
  const routeIds = [...new Set(observations.map((observation) => observation.routeId))];
  return routeIds
    .map((routeId) => summarizeTransportRoute(routeId, observations))
    .sort((a, b) => b.score - a.score);
}

export const TRANSPORT_BENCHMARK_BOUNDARY = Object.freeze({
  scope: 'infrastructure-and-transport-only',
  authoritativeCairnStateAllowed: false,
  prohibited: [
    'identity',
    'continuity-ledger',
    'memory',
    'commitments',
    'checkpoints',
    'genesis-data',
    'provenance-state',
    'commit-gate-state',
  ],
});
