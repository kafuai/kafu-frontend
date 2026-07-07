import {
  PortfolioHealthStatus,
  PortfolioMetric,
} from "./portfolioManagementTypes";

export interface PortfolioHealth {
  status: PortfolioHealthStatus;
  score: number;
  metrics: PortfolioMetric[];
}

export function evaluatePortfolioHealth(
  metrics: PortfolioMetric[],
): PortfolioHealth {
  const score =
    metrics.length === 0
      ? 0
      : Math.round(
          metrics.reduce(
            (total, metric) => total + metric.value / Math.max(metric.target, 1),
            0,
          ) /
            metrics.length *
            100,
        );

  const status: PortfolioHealthStatus =
    score >= 85
      ? "healthy"
      : score >= 70
        ? "watch"
        : score >= 50
          ? "at_risk"
          : "critical";

  return {
    status,
    score,
    metrics,
  };
}