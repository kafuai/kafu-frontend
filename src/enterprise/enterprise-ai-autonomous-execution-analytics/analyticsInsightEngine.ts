import {
  ExecutionAnalyticsInsight,
  ExecutionAnalyticsMetric,
  ExecutionAnalyticsSignal,
} from "./analyticsTypes";

export function generateExecutionAnalyticsInsights(
  signals: ExecutionAnalyticsSignal[],
  metrics: ExecutionAnalyticsMetric[],
): ExecutionAnalyticsInsight[] {
  return signals
    .filter((signal) => signal.severity !== "low" || Math.abs(signal.delta) >= 10)
    .map((signal) => {
      const metric = metrics.find((item) => item.id === signal.metricId);

      return {
        id: `analytics-insight-${signal.id}`,
        signalId: signal.id,
        title: buildInsightTitle(signal),
        description: buildInsightDescription(signal, metric?.name ?? "Unknown metric"),
        severity: signal.severity,
        recommendedAction: buildRecommendedAction(signal),
        confidence: signal.confidence,
        createdAt: signal.detectedAt,
      };
    });
}

function buildInsightTitle(signal: ExecutionAnalyticsSignal): string {
  return `${signal.type.toUpperCase()} analytics ${signal.trend} signal`;
}

function buildInsightDescription(
  signal: ExecutionAnalyticsSignal,
  metricName: string,
): string {
  return `${metricName} produced a ${signal.severity} ${signal.type} analytics signal with ${signal.delta}% deviation from baseline.`;
}

function buildRecommendedAction(signal: ExecutionAnalyticsSignal): string {
  if (signal.severity === "critical") {
    return "Escalate immediately, review execution dependencies, and trigger operational risk controls.";
  }

  if (signal.severity === "high") {
    return "Prioritize investigation, compare recent execution telemetry, and prepare corrective action.";
  }

  if (signal.trend === "degrading") {
    return "Monitor closely and review related execution plans before degradation becomes material.";
  }

  if (signal.trend === "improving") {
    return "Capture the positive execution pattern and evaluate whether it can be reused across workflows.";
  }

  return "Continue monitoring and include this signal in the next execution analytics cycle.";
}