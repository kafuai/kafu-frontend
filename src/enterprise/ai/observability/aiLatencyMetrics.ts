import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AILatencyMetrics {
  totalRequests: number;
  averageLatencyMs: number;
  minimumLatencyMs: number;
  maximumLatencyMs: number;
  slowRequests: number;
}

export function calculateAILatencyMetrics(
  signals: AIObservabilitySignal[],
  slowRequestThresholdMs = 3000,
): AILatencyMetrics {
  const latencyValues = signals
    .filter((signal) => signal.type === "latency")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (latencyValues.length === 0) {
    return {
      totalRequests: 0,
      averageLatencyMs: 0,
      minimumLatencyMs: 0,
      maximumLatencyMs: 0,
      slowRequests: 0,
    };
  }

  const totalLatency = latencyValues.reduce((total, value) => total + value, 0);

  return {
    totalRequests: latencyValues.length,
    averageLatencyMs: totalLatency / latencyValues.length,
    minimumLatencyMs: Math.min(...latencyValues),
    maximumLatencyMs: Math.max(...latencyValues),
    slowRequests: latencyValues.filter((value) => value >= slowRequestThresholdMs).length,
  };
}