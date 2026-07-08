import type { OperationalPerformanceMetric } from "./operationalPerformanceTypes";
import { buildOperationalPerformanceSummary } from "./operationalScorecard";
import { generateOperationalInsights } from "./operationalInsights";
import { buildOperationalAlerts } from "./operationalAlerts";
import { forecastOperationalPortfolio } from "./operationalForecast";

export function buildOperationalPerformanceDashboard(
  metrics: OperationalPerformanceMetric[]
) {
  const insights = generateOperationalInsights(metrics);

  return {
    summary: buildOperationalPerformanceSummary(metrics),
    insights,
    alerts: buildOperationalAlerts(insights),
    forecasts: forecastOperationalPortfolio(metrics),
  };
}
