import {
  ObservabilityContext,
  ObservabilityMetric,
} from "./observabilityTypes";

export function createObservabilityMetric(
  name: string,
  value: number,
  context: ObservabilityContext,
  unit?: string,
  tags?: Record<string, string>,
): ObservabilityMetric {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    name,
    value,
    unit,
    context,
    tags,
  };
}

export function isNegativeObservabilityMetric(
  metric: ObservabilityMetric,
): boolean {
  return metric.value < 0;
}