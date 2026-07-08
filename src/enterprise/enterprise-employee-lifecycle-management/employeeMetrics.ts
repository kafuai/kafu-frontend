import type { EmployeeMetric } from "./employeeLifecycleTypes";

export function createEmployeeMetric(
  metric: EmployeeMetric
): EmployeeMetric {
  return metric;
}

export function averageEmployeeMetric(
  metrics: EmployeeMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, item) => sum + item.value,
      0
    ) / metrics.length
  );
}
