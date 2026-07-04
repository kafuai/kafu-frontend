import {
  AIExecutionObservabilityMetric,
  AIExecutionObservabilitySignal,
  AIExecutionObservabilityTrace,
} from "./aiAutonomousExecutionObservabilityTypes";

export interface AIExecutionObservabilityReport {
  generatedAt: string;
  executionId?: string;
  tenantId?: string;
  signalCount: number;
  metricCount: number;
  traceCount: number;
  criticalSignalCount: number;
  failedTraceCount: number;
  averageMetricValue: number;
}

export function createAIExecutionObservabilityReport(input: {
  signals: AIExecutionObservabilitySignal[];
  metrics: AIExecutionObservabilityMetric[];
  traces: AIExecutionObservabilityTrace[];
  executionId?: string;
  tenantId?: string;
}): AIExecutionObservabilityReport {
  const criticalSignalCount = input.signals.filter(
    (signal) => signal.severity === "critical",
  ).length;

  const failedTraceCount = input.traces.filter(
    (trace) => trace.status === "failed",
  ).length;

  const averageMetricValue =
    input.metrics.length === 0
      ? 0
      : input.metrics.reduce((sum, metric) => sum + metric.value, 0) /
        input.metrics.length;

  return {
    generatedAt: new Date().toISOString(),
    executionId: input.executionId,
    tenantId: input.tenantId,
    signalCount: input.signals.length,
    metricCount: input.metrics.length,
    traceCount: input.traces.length,
    criticalSignalCount,
    failedTraceCount,
    averageMetricValue,
  };
}