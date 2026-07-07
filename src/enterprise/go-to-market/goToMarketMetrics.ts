import {
  GoToMarketChannel,
  GoToMarketSegment,
} from "./goToMarketTypes";

export interface GoToMarketMetric {
  id: string;
  segment: GoToMarketSegment;
  channel: GoToMarketChannel;
  name: string;
  value: number;
  target: number;
  unit: string;
}

export interface GoToMarketMetricSummary {
  totalMetrics: number;
  achievedTargets: number;
  achievementRate: number;
}

export function summarizeGoToMarketMetrics(
  metrics: GoToMarketMetric[],
): GoToMarketMetricSummary {
  const achievedTargets = metrics.filter(
    (metric) => metric.value >= metric.target,
  ).length;

  return {
    totalMetrics: metrics.length,
    achievedTargets,
    achievementRate:
      metrics.length === 0
        ? 0
        : Math.round((achievedTargets / metrics.length) * 100),
  };
}