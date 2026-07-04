import {
  AIExecutionObservabilityMetric,
  AIExecutionObservabilitySignal,
} from "./aiAutonomousExecutionObservabilityTypes";

export interface AIExecutionHealthSnapshot {
  executionId: string;
  overallHealth: number;
  metricCount: number;
  signalCount: number;
  criticalSignals: number;
  capturedAt: string;
}

export function createAIExecutionHealthSnapshot(
  executionId: string,
  metrics: AIExecutionObservabilityMetric[],
  signals: AIExecutionObservabilitySignal[],
): AIExecutionHealthSnapshot {
  const criticalSignals = signals.filter(
    (signal) => signal.severity === "critical",
  ).length;

  const health = Math.max(
    0,
    Math.min(100, 100 - criticalSignals * 20),
  );

  return {
    executionId,
    overallHealth: health,
    metricCount: metrics.length,
    signalCount: signals.length,
    criticalSignals,
    capturedAt: new Date().toISOString(),
  };
}