import {
  AnalyticsSignalType,
  ExecutionAnalyticsMetric,
} from "./analyticsTypes";
import { calculateAnalyticsDelta } from "./analyticsScoring";

export interface ExecutionAnalyticsAggregate {
  type: AnalyticsSignalType;
  metricCount: number;
  averageValue: number;
  averageBaseline: number;
  averageDelta: number;
  maxDelta: number;
  minDelta: number;
}

export function aggregateExecutionAnalyticsMetrics(
  metrics: ExecutionAnalyticsMetric[],
): ExecutionAnalyticsAggregate[] {
  const grouped = metrics.reduce<Record<AnalyticsSignalType, ExecutionAnalyticsMetric[]>>(
    (groups, metric) => {
      groups[metric.type] = [...(groups[metric.type] ?? []), metric];
      return groups;
    },
    {} as Record<AnalyticsSignalType, ExecutionAnalyticsMetric[]>,
  );

  return Object.entries(grouped).map(([type, items]) => {
    const deltas = items.map(calculateAnalyticsDelta);

    return {
      type: type as AnalyticsSignalType,
      metricCount: items.length,
      averageValue: average(items.map((item) => item.value)),
      averageBaseline: average(items.map((item) => item.baseline)),
      averageDelta: average(deltas),
      maxDelta: Math.max(...deltas),
      minDelta: Math.min(...deltas),
    };
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / values.length).toFixed(2));
}