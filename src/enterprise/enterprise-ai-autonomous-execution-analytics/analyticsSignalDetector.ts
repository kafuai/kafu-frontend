import {
  ExecutionAnalyticsMetric,
  ExecutionAnalyticsSignal,
} from "./analyticsTypes";
import {
  calculateAnalyticsDelta,
  calculateSignalConfidence,
  classifyAnalyticsSeverity,
  classifyAnalyticsTrend,
} from "./analyticsScoring";

export function detectExecutionAnalyticsSignals(
  metrics: ExecutionAnalyticsMetric[],
): ExecutionAnalyticsSignal[] {
  return metrics.map((metric) => {
    const delta = calculateAnalyticsDelta(metric);
    const severity = classifyAnalyticsSeverity(delta);
    const trend = classifyAnalyticsTrend(delta);
    const confidence = calculateSignalConfidence(metric, delta);

    return {
      id: `analytics-signal-${metric.id}`,
      metricId: metric.id,
      type: metric.type,
      severity,
      trend,
      delta,
      confidence,
      summary: buildSignalSummary(metric.name, delta, trend, severity),
      detectedAt: metric.timestamp,
    };
  });
}

function buildSignalSummary(
  metricName: string,
  delta: number,
  trend: string,
  severity: string,
): string {
  return `${metricName} changed by ${delta}% with ${trend} trend and ${severity} severity.`;
}