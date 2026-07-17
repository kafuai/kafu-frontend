import type {
  ExecutiveDemoAnalyticsMetric,
  ExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsInsight {
  id: string;
  title: string;
  summary: string;
  metricId: string;
  severity: "positive" | "neutral" | "warning" | "critical";
  value: number;
  recommendedAction?: string;
}

function buildInsightFromMetric(
  metric: ExecutiveDemoAnalyticsMetric,
): ExecutiveDemoAnalyticsInsight {
  if (metric.status === "healthy") {
    return {
      id: `${metric.id}-positive`,
      title: `${metric.label} is performing well`,
      summary: `${metric.label} currently records ${metric.value}${metric.unit ?? ""}.`,
      metricId: metric.id,
      severity: "positive",
      value: metric.value,
    };
  }

  if (metric.status === "attention") {
    return {
      id: `${metric.id}-attention`,
      title: `${metric.label} requires attention`,
      summary: `${metric.label} is below the preferred executive benchmark.`,
      metricId: metric.id,
      severity: "warning",
      value: metric.value,
      recommendedAction:
        "Review the underlying demo inputs and strengthen the supporting executive evidence.",
    };
  }

  if (metric.status === "critical") {
    return {
      id: `${metric.id}-critical`,
      title: `${metric.label} is critically low`,
      summary: `${metric.label} may reduce executive confidence in the demo outcome.`,
      metricId: metric.id,
      severity: "critical",
      value: metric.value,
      recommendedAction:
        "Prioritize corrective action before presenting the final executive recommendation.",
    };
  }

  return {
    id: `${metric.id}-neutral`,
    title: `${metric.label} has insufficient data`,
    summary: `${metric.label} cannot yet be evaluated reliably.`,
    metricId: metric.id,
    severity: "neutral",
    value: metric.value,
    recommendedAction:
      "Collect additional data before producing a final executive conclusion.",
  };
}

export function generateExecutiveDemoAnalyticsInsights(
  snapshot: ExecutiveDemoAnalyticsSnapshot,
): ExecutiveDemoAnalyticsInsight[] {
  return snapshot.metrics.map(buildInsightFromMetric);
}

export function getCriticalExecutiveDemoAnalyticsInsights(
  insights: ExecutiveDemoAnalyticsInsight[],
): ExecutiveDemoAnalyticsInsight[] {
  return insights.filter(
    (insight) =>
      insight.severity === "critical" ||
      insight.severity === "warning",
  );
}
