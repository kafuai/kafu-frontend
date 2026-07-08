export type OperationalPerformanceStatus =
  | "excellent"
  | "stable"
  | "watch"
  | "underperforming"
  | "critical";

export type OperationalMetricTrend = "improving" | "stable" | "declining";

export type OperationalAlertSeverity = "low" | "medium" | "high" | "urgent";

export interface OperationalPerformanceMetric {
  id: string;
  name: string;
  domain: string;
  owner: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: OperationalMetricTrend;
  status: OperationalPerformanceStatus;
}

export interface OperationalInsight {
  id: string;
  metricId: string;
  title: string;
  summary: string;
  recommendedAction: string;
  severity: OperationalAlertSeverity;
}

export interface OperationalForecast {
  metricId: string;
  projectedValue: number;
  confidence: number;
  riskOfMissingTarget: boolean;
}

export interface OperationalPerformanceSummary {
  totalMetrics: number;
  excellentMetrics: number;
  underperformingMetrics: number;
  urgentInsights: number;
  averageTargetAchievement: number;
}
