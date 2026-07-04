import {
  PerformanceMetric,
  PerformanceMetricType,
} from "./performanceTypes";

export type CreatePerformanceMetricInput = {
  id: string;
  name: string;
  type: PerformanceMetricType;
  value: number;
  unit: string;
};

export function createPerformanceMetric(
  input: CreatePerformanceMetricInput,
): PerformanceMetric {
  return {
    id: input.id,
    name: input.name,
    type: input.type,
    value: input.value,
    unit: input.unit,
    recordedAt: new Date(),
  };
}

export function calculateAveragePerformanceMetric(
  metrics: PerformanceMetric[],
): number {
  if (metrics.length === 0) return 0;

  const total = metrics.reduce((sum, metric) => sum + metric.value, 0);

  return total / metrics.length;
}