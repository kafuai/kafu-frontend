import type {
  OperationalForecast,
  OperationalPerformanceMetric,
} from "./operationalPerformanceTypes";

export function forecastOperationalMetric(
  metric: OperationalPerformanceMetric
): OperationalForecast {
  const trendAdjustment =
    metric.trend === "improving" ? 4 : metric.trend === "declining" ? -6 : 0;

  const projectedValue = Math.max(0, Math.round(metric.currentValue + trendAdjustment));

  return {
    metricId: metric.id,
    projectedValue,
    confidence: metric.trend === "stable" ? 0.82 : 0.74,
    riskOfMissingTarget: projectedValue < metric.targetValue,
  };
}

export function forecastOperationalPortfolio(
  metrics: OperationalPerformanceMetric[]
): OperationalForecast[] {
  return metrics.map(forecastOperationalMetric);
}
