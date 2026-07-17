import type {
  ExecutiveDemoAnalyticsMetric,
  ExecutiveDemoAnalyticsStatus,
} from "./executiveDemoAnalyticsTypes";
import type {
  ExecutiveDemoAnalyticsReport,
} from "./executiveDemoAnalyticsReport";

export interface ExecutiveDemoAnalyticsDashboardMetric {
  id: string;
  label: string;
  formattedValue: string;
  status: ExecutiveDemoAnalyticsStatus;
  description?: string;
}

export interface ExecutiveDemoAnalyticsDashboardViewModel {
  headline: string;
  executiveSummary: string;
  overallScore: number;
  overallStatus: ExecutiveDemoAnalyticsStatus;
  totalMetrics: number;
  priorityInsightsCount: number;
  metrics: ExecutiveDemoAnalyticsDashboardMetric[];
}

function formatMetricValue(
  metric: ExecutiveDemoAnalyticsMetric,
): string {
  if (metric.type === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: metric.unit ?? "SAR",
      maximumFractionDigits: 0,
    }).format(metric.value);
  }

  if (metric.unit === "%") {
    return `${metric.value}%`;
  }

  if (metric.unit === "/100") {
    return `${metric.value}/100`;
  }

  if (metric.unit) {
    return `${metric.value} ${metric.unit}`;
  }

  return String(metric.value);
}

export function buildExecutiveDemoAnalyticsDashboardViewModel(
  report: ExecutiveDemoAnalyticsReport,
  metrics: ExecutiveDemoAnalyticsMetric[],
): ExecutiveDemoAnalyticsDashboardViewModel {
  return {
    headline: report.headline,
    executiveSummary: report.executiveSummary,
    overallScore: report.scorecard.overallScore,
    overallStatus: report.scorecard.overallStatus,
    totalMetrics: report.scorecard.totalMetrics,
    priorityInsightsCount: report.priorityInsights.length,
    metrics: metrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      formattedValue: formatMetricValue(metric),
      status: metric.status,
      description: metric.description,
    })),
  };
}
