import type { OperationalPerformanceMetric } from "./operationalPerformanceTypes";

export const operationalPerformanceMetrics: OperationalPerformanceMetric[] = [
  {
    id: "op-throughput",
    name: "Operational Throughput",
    domain: "Operations",
    owner: "COO Office",
    currentValue: 91,
    targetValue: 95,
    unit: "%",
    trend: "stable",
    status: "stable",
  },
  {
    id: "op-sla-adherence",
    name: "SLA Adherence",
    domain: "Customer Operations",
    owner: "Service Delivery",
    currentValue: 87,
    targetValue: 94,
    unit: "%",
    trend: "declining",
    status: "watch",
  },
  {
    id: "op-backlog-age",
    name: "Average Backlog Age",
    domain: "Work Management",
    owner: "Operations Control",
    currentValue: 42,
    targetValue: 24,
    unit: "hours",
    trend: "declining",
    status: "underperforming",
  },
];

export function getMetricById(
  metricId: string
): OperationalPerformanceMetric | undefined {
  return operationalPerformanceMetrics.find((metric) => metric.id === metricId);
}
