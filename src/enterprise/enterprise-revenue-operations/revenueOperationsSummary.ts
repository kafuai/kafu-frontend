import type {
  RevenueForecastAccuracy,
  RevenueInsight,
  RevenueMetric,
  RevenueOperationStatus,
  RevenueRiskSignal,
  RevenueStageConversion,
  RevenueVelocityMetrics,
} from "./revenueOperationsTypes";

export interface RevenueOperationsSummary {
  id: string;
  status: RevenueOperationStatus;
  currency: string;
  targetRevenue: number;
  totalPipeline: number;
  weightedPipeline: number;
  commitRevenue: number;
  bestCaseRevenue: number;
  pipelineRevenue: number;
  forecastRevenue: number;
  forecastGap: number;
  forecastConfidence: number;
  quotaAttainment: number;
  pipelineCoverage: number;
  weightedCoverage: number;
  velocity: RevenueVelocityMetrics;
  forecastAccuracy?: RevenueForecastAccuracy;
  stageConversions: RevenueStageConversion[];
  riskSignals: RevenueRiskSignal[];
  insights: RevenueInsight[];
  metrics: RevenueMetric[];
  generatedAt: string;
}

export interface CreateRevenueOperationsSummaryInput {
  id?: string;
  status?: RevenueOperationStatus;
  currency: string;
  targetRevenue: number;
  totalPipeline: number;
  weightedPipeline: number;
  commitRevenue: number;
  bestCaseRevenue: number;
  pipelineRevenue: number;
  forecastRevenue: number;
  forecastConfidence: number;
  velocity: RevenueVelocityMetrics;
  forecastAccuracy?: RevenueForecastAccuracy;
  stageConversions?: RevenueStageConversion[];
  riskSignals?: RevenueRiskSignal[];
  insights?: RevenueInsight[];
  generatedAt?: string;
}

function safeRatio(numerator: number, denominator: number): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }

  return numerator / denominator;
}

export function createRevenueOperationsSummary(
  input: CreateRevenueOperationsSummaryInput,
): RevenueOperationsSummary {
  const generatedAt = input.generatedAt ?? new Date().toISOString();

  const quotaAttainment = safeRatio(
    input.forecastRevenue,
    input.targetRevenue,
  );

  const pipelineCoverage = safeRatio(
    input.totalPipeline,
    input.targetRevenue,
  );

  const weightedCoverage = safeRatio(
    input.weightedPipeline,
    input.targetRevenue,
  );

  const forecastGap = Math.max(
    0,
    input.targetRevenue - input.forecastRevenue,
  );

  const riskSignals = input.riskSignals ?? [];
  const stageConversions = input.stageConversions ?? [];
  const insights = input.insights ?? [];

  return {
    id: input.id ?? `revenue-summary-${generatedAt.replace(/[^0-9]/g, "")}`,
    status: input.status ?? "active",
    currency: input.currency,
    targetRevenue: input.targetRevenue,
    totalPipeline: input.totalPipeline,
    weightedPipeline: input.weightedPipeline,
    commitRevenue: input.commitRevenue,
    bestCaseRevenue: input.bestCaseRevenue,
    pipelineRevenue: input.pipelineRevenue,
    forecastRevenue: input.forecastRevenue,
    forecastGap,
    forecastConfidence: input.forecastConfidence,
    quotaAttainment,
    pipelineCoverage,
    weightedCoverage,
    velocity: input.velocity,
    forecastAccuracy: input.forecastAccuracy,
    stageConversions,
    riskSignals,
    insights,
    metrics: [
      {
        key: "target_revenue",
        label: "Revenue Target",
        value: input.targetRevenue,
        unit: "currency",
      },
      {
        key: "total_pipeline",
        label: "Total Pipeline",
        value: input.totalPipeline,
        target: input.targetRevenue,
        unit: "currency",
      },
      {
        key: "weighted_pipeline",
        label: "Weighted Pipeline",
        value: input.weightedPipeline,
        target: input.targetRevenue,
        unit: "currency",
      },
      {
        key: "commit_revenue",
        label: "Commit Revenue",
        value: input.commitRevenue,
        unit: "currency",
      },
      {
        key: "best_case_revenue",
        label: "Best Case Revenue",
        value: input.bestCaseRevenue,
        unit: "currency",
      },
      {
        key: "forecast_revenue",
        label: "Forecast Revenue",
        value: input.forecastRevenue,
        target: input.targetRevenue,
        unit: "currency",
      },
      {
        key: "forecast_gap",
        label: "Forecast Gap",
        value: forecastGap,
        target: 0,
        unit: "currency",
      },
      {
        key: "forecast_confidence",
        label: "Forecast Confidence",
        value: input.forecastConfidence,
        target: 1,
        unit: "ratio",
      },
      {
        key: "quota_attainment",
        label: "Quota Attainment",
        value: quotaAttainment,
        target: 1,
        unit: "ratio",
      },
      {
        key: "pipeline_coverage",
        label: "Pipeline Coverage",
        value: pipelineCoverage,
        target: 3,
        unit: "ratio",
      },
      {
        key: "weighted_coverage",
        label: "Weighted Coverage",
        value: weightedCoverage,
        target: 1,
        unit: "ratio",
      },
      {
        key: "revenue_velocity",
        label: "Revenue Velocity",
        value: input.velocity.revenueVelocity,
        unit: "currency_per_day",
      },
      {
        key: "open_revenue_risks",
        label: "Open Revenue Risks",
        value: riskSignals.filter(
          (signal) => signal.status === "open",
        ).length,
        target: 0,
        unit: "count",
      },
    ],
    generatedAt,
  };
}