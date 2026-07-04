import { ObservabilityMetric, ObservabilitySeverity } from "./observabilityTypes";

export type ObservabilityRetentionPolicy = {
  retentionDays: number;
  archiveEnabled: boolean;
};

export type ObservabilitySamplingPolicy = {
  samplingRate: number;
  alwaysSampleSeverities: ObservabilitySeverity[];
};

export type ObservabilityThresholdPolicy = {
  metricName: string;
  warningThreshold: number;
  criticalThreshold: number;
};

export function shouldSampleObservabilitySignal(
  samplingPolicy: ObservabilitySamplingPolicy,
): boolean {
  return Math.random() <= samplingPolicy.samplingRate;
}

export function evaluateObservabilityMetricThreshold(
  metric: ObservabilityMetric,
  policy: ObservabilityThresholdPolicy,
): ObservabilitySeverity | undefined {
  if (metric.name !== policy.metricName) return undefined;
  if (metric.value >= policy.criticalThreshold) return "critical";
  if (metric.value >= policy.warningThreshold) return "warning";

  return undefined;
}