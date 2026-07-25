export type RevenueOperationStatus =
  | "draft"
  | "active"
  | "paused"
  | "blocked"
  | "completed"
  | "archived";

export type RevenuePriority = "low" | "medium" | "high" | "critical";

export type RevenueMotion =
  | "new_business"
  | "expansion"
  | "renewal"
  | "retention"
  | "partner"
  | "enterprise";

export type RevenueRiskLevel = "low" | "medium" | "high" | "critical";

export type RevenueForecastCategory =
  | "commit"
  | "best_case"
  | "pipeline"
  | "omitted";

export type RevenueTrendDirection = "up" | "down" | "stable";

export type RevenueSignalKind =
  | "close_date"
  | "stalled_stage"
  | "low_probability"
  | "missing_next_action"
  | "overdue_next_action"
  | "low_activity"
  | "forecast_slippage"
  | "pipeline_concentration"
  | "coverage_gap"
  | "conversion_drop";

export type RevenueSignalStatus = "open" | "acknowledged" | "resolved";

export interface RevenueOwner {
  id: string;
  name: string;
  role: string;
  team?: string;
}

export interface RevenueTimeframe {
  startDate: string;
  endDate: string;
}

export interface RevenueMetric {
  key: string;
  label: string;
  value: number;
  target?: number;
  unit?: string;
  trend?: RevenueTrendDirection;
  previousValue?: number;
}

export interface RevenueInsight {
  id: string;
  title: string;
  summary: string;
  priority: RevenuePriority;
  createdAt: string;
}

export interface RevenueRiskSignal {
  id: string;
  opportunityId: string | null;
  accountId: string | null;
  kind: RevenueSignalKind;
  level: RevenueRiskLevel;
  status: RevenueSignalStatus;
  title: string;
  description: string;
  recommendedAction: string;
  score: number;
  detectedAt: string;
  metadata: Record<string, unknown>;
}

export interface RevenueStageConversion {
  stageId: string;
  stageName: string;
  entered: number;
  advanced: number;
  won: number;
  lost: number;
  conversionRate: number;
  winRate: number;
  lossRate: number;
  averageDaysInStage: number;
}

export interface RevenueVelocityMetrics {
  opportunityCount: number;
  averageDealValue: number;
  winRate: number;
  averageSalesCycleDays: number;
  revenueVelocity: number;
}

export interface RevenueForecastAccuracy {
  actualRevenue: number;
  forecastRevenue: number;
  absoluteError: number;
  percentageError: number;
  accuracy: number;
  bias: number;
}

export interface RevenueCoverageMetrics {
  targetRevenue: number;
  totalPipeline: number;
  weightedPipeline: number;
  coverageRatio: number;
  weightedCoverageRatio: number;
  coverageGap: number;
}

export interface RevenueConcentration {
  topOpportunityValue: number;
  topOpportunityShare: number;
  topFiveValue: number;
  topFiveShare: number;
  concentrated: boolean;
}