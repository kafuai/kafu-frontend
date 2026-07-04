import {
  AIExecutionObservabilityMetric,
  AIExecutionObservabilitySignal,
  AIExecutionObservabilityTrace,
} from "./aiAutonomousExecutionObservabilityTypes";

export interface AIExecutionObservabilityPolicy {
  maxCriticalSignals: number;
  maxFailedTraces: number;
  maxAverageMetricValue?: number;
}

export interface AIExecutionObservabilityPolicyEvaluation {
  passed: boolean;
  violations: string[];
}

export function evaluateAIExecutionObservabilityPolicy(input: {
  policy: AIExecutionObservabilityPolicy;
  signals: AIExecutionObservabilitySignal[];
  metrics: AIExecutionObservabilityMetric[];
  traces: AIExecutionObservabilityTrace[];
}): AIExecutionObservabilityPolicyEvaluation {
  const criticalSignals = input.signals.filter(
    (signal) => signal.severity === "critical",
  ).length;

  const failedTraces = input.traces.filter(
    (trace) => trace.status === "failed",
  ).length;

  const averageMetricValue =
    input.metrics.length === 0
      ? 0
      : input.metrics.reduce((sum, metric) => sum + metric.value, 0) /
        input.metrics.length;

  const violations: string[] = [];

  if (criticalSignals > input.policy.maxCriticalSignals) {
    violations.push("critical_signal_threshold_exceeded");
  }

  if (failedTraces > input.policy.maxFailedTraces) {
    violations.push("failed_trace_threshold_exceeded");
  }

  if (
    typeof input.policy.maxAverageMetricValue === "number" &&
    averageMetricValue > input.policy.maxAverageMetricValue
  ) {
    violations.push("average_metric_threshold_exceeded");
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}