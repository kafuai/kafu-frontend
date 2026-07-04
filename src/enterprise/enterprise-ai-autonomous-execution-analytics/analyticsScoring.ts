import {
  AnalyticsSeverity,
  AnalyticsTrend,
  ExecutionAnalyticsMetric,
} from "./analyticsTypes";

export function calculateAnalyticsDelta(metric: ExecutionAnalyticsMetric): number {
  if (metric.baseline === 0) {
    return metric.value === 0 ? 0 : 100;
  }

  return Number((((metric.value - metric.baseline) / metric.baseline) * 100).toFixed(2));
}

export function classifyAnalyticsSeverity(delta: number): AnalyticsSeverity {
  const absoluteDelta = Math.abs(delta);

  if (absoluteDelta >= 75) return "critical";
  if (absoluteDelta >= 40) return "high";
  if (absoluteDelta >= 15) return "medium";

  return "low";
}

export function classifyAnalyticsTrend(delta: number): AnalyticsTrend {
  if (delta <= -20) return "degrading";
  if (delta >= 20) return "improving";
  if (Math.abs(delta) >= 10) return "volatile";

  return "stable";
}

export function calculateSignalConfidence(metric: ExecutionAnalyticsMetric, delta: number): number {
  const baselineStrength = metric.baseline > 0 ? 0.35 : 0.15;
  const magnitudeStrength = Math.min(Math.abs(delta) / 100, 0.45);
  const sourceStrength = metric.source.trim().length > 0 ? 0.2 : 0.05;

  return Number(Math.min(baselineStrength + magnitudeStrength + sourceStrength, 0.99).toFixed(2));
}

export function calculateHealthScore(metrics: ExecutionAnalyticsMetric[]): number {
  if (metrics.length === 0) return 100;

  const penalty = metrics.reduce((total, metric) => {
    const delta = Math.abs(calculateAnalyticsDelta(metric));
    return total + Math.min(delta, 100);
  }, 0);

  const averagePenalty = penalty / metrics.length;

  return Number(Math.max(0, 100 - averagePenalty).toFixed(2));
}

export function calculateRiskScore(metrics: ExecutionAnalyticsMetric[]): number {
  if (metrics.length === 0) return 0;

  const risk = metrics.reduce((total, metric) => {
    const delta = Math.abs(calculateAnalyticsDelta(metric));
    return total + Math.min(delta, 100);
  }, 0);

  return Number(Math.min(100, risk / metrics.length).toFixed(2));
}