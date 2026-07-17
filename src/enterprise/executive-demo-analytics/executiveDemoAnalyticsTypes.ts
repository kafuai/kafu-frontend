export type ExecutiveDemoAnalyticsMetricType =
  | "count"
  | "percentage"
  | "score"
  | "duration"
  | "currency";

export type ExecutiveDemoAnalyticsTrend =
  | "up"
  | "down"
  | "stable"
  | "unknown";

export type ExecutiveDemoAnalyticsStatus =
  | "healthy"
  | "attention"
  | "critical"
  | "unknown";

export interface ExecutiveDemoAnalyticsMetric {
  id: string;
  label: string;
  description?: string;
  type: ExecutiveDemoAnalyticsMetricType;
  value: number;
  unit?: string;
  previousValue?: number;
  targetValue?: number;
  trend: ExecutiveDemoAnalyticsTrend;
  status: ExecutiveDemoAnalyticsStatus;
}

export interface ExecutiveDemoAnalyticsInput {
  organizationId: string;
  sessionId: string;
  generatedAt?: string;
  totalDemoSteps: number;
  completedDemoSteps: number;
  totalInsights: number;
  highPriorityInsights: number;
  totalRecommendations: number;
  acceptedRecommendations: number;
  executiveReadinessScore: number;
  intelligenceConfidenceScore: number;
  estimatedAnnualValue?: number;
  estimatedTimeSavedHours?: number;
}

export interface ExecutiveDemoAnalyticsSummary {
  completionRate: number;
  insightPriorityRate: number;
  recommendationAcceptanceRate: number;
  executiveReadinessScore: number;
  intelligenceConfidenceScore: number;
  estimatedAnnualValue: number;
  estimatedTimeSavedHours: number;
}

export interface ExecutiveDemoAnalyticsSnapshot {
  organizationId: string;
  sessionId: string;
  generatedAt: string;
  summary: ExecutiveDemoAnalyticsSummary;
  metrics: ExecutiveDemoAnalyticsMetric[];
}
