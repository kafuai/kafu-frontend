import type {
  RevenueForecastAccuracy,
  RevenueInsight,
  RevenueMetric,
  RevenueRiskSignal,
  RevenueStageConversion,
  RevenueVelocityMetrics,
} from "./revenueOperationsTypes";

export interface RevenueAnalytics {
  metrics: RevenueMetric[];
  insights: RevenueInsight[];
  riskSignals?: RevenueRiskSignal[];
  stageConversions?: RevenueStageConversion[];
  velocity?: RevenueVelocityMetrics;
  forecastAccuracy?: RevenueForecastAccuracy;
  generatedAt?: string;
}

function normalizeMetricValue(metric: RevenueMetric): number {
  if (!Number.isFinite(metric.value)) {
    return 0;
  }

  if (metric.target && metric.target > 0) {
    return Math.min(1, Math.max(0, metric.value / metric.target));
  }

  if (metric.unit === "ratio") {
    return Math.min(1, Math.max(0, metric.value));
  }

  return metric.value;
}

export function analyticsScore(
  analytics: RevenueAnalytics,
): number {
  if (!analytics.metrics.length) {
    return 0;
  }

  const normalizedValues = analytics.metrics.map(normalizeMetricValue);

  return (
    normalizedValues.reduce((sum, value) => sum + value, 0) /
    normalizedValues.length
  );
}

export function createRevenueInsights(
  analytics: RevenueAnalytics,
  createdAt = new Date().toISOString(),
): RevenueInsight[] {
  const insights: RevenueInsight[] = [];

  const criticalSignals =
    analytics.riskSignals?.filter(
      (signal) => signal.level === "critical",
    ) ?? [];

  const highSignals =
    analytics.riskSignals?.filter(
      (signal) => signal.level === "high",
    ) ?? [];

  if (criticalSignals.length > 0) {
    insights.push({
      id: "revenue-critical-risk",
      title: "Critical revenue risks require executive action",
      summary:
        `${criticalSignals.length} critical revenue risk signal(s) are currently open.`,
      priority: "critical",
      createdAt,
    });
  } else if (highSignals.length > 0) {
    insights.push({
      id: "revenue-high-risk",
      title: "High revenue risks require intervention",
      summary:
        `${highSignals.length} high revenue risk signal(s) may affect the current forecast.`,
      priority: "high",
      createdAt,
    });
  }

  if (
    analytics.forecastAccuracy &&
    analytics.forecastAccuracy.accuracy < 0.7
  ) {
    insights.push({
      id: "forecast-accuracy-decline",
      title: "Forecast accuracy is below the accepted threshold",
      summary:
        `Current forecast accuracy is ${(analytics.forecastAccuracy.accuracy * 100).toFixed(1)}%.`,
      priority: "high",
      createdAt,
    });
  }

  if (
    analytics.velocity &&
    analytics.velocity.averageSalesCycleDays > 90
  ) {
    insights.push({
      id: "sales-cycle-delay",
      title: "Sales cycle duration is limiting revenue velocity",
      summary:
        `Average sales cycle duration is ${analytics.velocity.averageSalesCycleDays.toFixed(1)} days.`,
      priority: "high",
      createdAt,
    });
  }

  const weakConversions =
    analytics.stageConversions?.filter(
      (conversion) =>
        conversion.entered >= 3 &&
        conversion.conversionRate < 0.3,
    ) ?? [];

  if (weakConversions.length > 0) {
    insights.push({
      id: "stage-conversion-drop",
      title: "Pipeline stage conversion requires review",
      summary:
        `${weakConversions.length} pipeline stage(s) have conversion below 30%.`,
      priority: "medium",
      createdAt,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "revenue-performance-stable",
      title: "Revenue operations remain stable",
      summary:
        "No material forecast, velocity, conversion, or risk exceptions were detected.",
      priority: "low",
      createdAt,
    });
  }

  return insights;
}

export function createRevenueAnalytics(
  input: Omit<RevenueAnalytics, "insights" | "generatedAt"> & {
    insights?: RevenueInsight[];
    generatedAt?: string;
  },
): RevenueAnalytics {
  const generatedAt = input.generatedAt ?? new Date().toISOString();

  const analytics: RevenueAnalytics = {
    metrics: input.metrics,
    insights: input.insights ?? [],
    riskSignals: input.riskSignals,
    stageConversions: input.stageConversions,
    velocity: input.velocity,
    forecastAccuracy: input.forecastAccuracy,
    generatedAt,
  };

  if (!analytics.insights.length) {
    analytics.insights = createRevenueInsights(
      analytics,
      generatedAt,
    );
  }

  return analytics;
}