import type {
  ExecutiveDemoAnalyticsMetric,
  ExecutiveDemoAnalyticsSnapshot,
  ExecutiveDemoAnalyticsTrend,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsComparison {
  metricId: string;
  label: string;
  currentValue: number;
  previousValue: number;
  difference: number;
  percentageChange: number;
  trend: ExecutiveDemoAnalyticsTrend;
}

function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
): number {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return Math.round(
    ((currentValue - previousValue) / Math.abs(previousValue)) * 100,
  );
}

function resolveTrend(
  difference: number,
): ExecutiveDemoAnalyticsTrend {
  if (difference > 0) {
    return "up";
  }

  if (difference < 0) {
    return "down";
  }

  return "stable";
}

export function compareExecutiveDemoAnalyticsMetrics(
  currentMetrics: ExecutiveDemoAnalyticsMetric[],
  previousMetrics: ExecutiveDemoAnalyticsMetric[],
): ExecutiveDemoAnalyticsComparison[] {
  const previousMetricMap = new Map(
    previousMetrics.map((metric) => [metric.id, metric]),
  );

  return currentMetrics.flatMap((metric) => {
    const previousMetric = previousMetricMap.get(metric.id);

    if (!previousMetric) {
      return [];
    }

    const difference = metric.value - previousMetric.value;

    return [
      {
        metricId: metric.id,
        label: metric.label,
        currentValue: metric.value,
        previousValue: previousMetric.value,
        difference,
        percentageChange: calculatePercentageChange(
          metric.value,
          previousMetric.value,
        ),
        trend: resolveTrend(difference),
      },
    ];
  });
}

export function compareExecutiveDemoAnalyticsSnapshots(
  currentSnapshot: ExecutiveDemoAnalyticsSnapshot,
  previousSnapshot: ExecutiveDemoAnalyticsSnapshot,
): ExecutiveDemoAnalyticsComparison[] {
  return compareExecutiveDemoAnalyticsMetrics(
    currentSnapshot.metrics,
    previousSnapshot.metrics,
  );
}
