import type {
  SalesForecastPeriod,
  SalesOpportunity,
  SalesPipelineStage,
} from "../sales-intelligence/salesIntelligenceTypes";

import {
  createRevenuePipelineIntelligence,
  type RevenuePipelineOpportunity,
  type RevenuePipelineStage,
} from "./revenuePipeline";

import {
  calculateForecastAccuracy,
  createRevenueForecast,
  type RevenueForecast,
} from "./revenueForecast";

import {
  assessOpportunityRevenueRisk,
  type RevenueRiskAssessment,
} from "./revenueRisk";

import {
  createRevenueAnalytics,
  type RevenueAnalytics,
} from "./revenueAnalytics";

import {
  createRevenueOperationsSummary,
  type RevenueOperationsSummary,
} from "./revenueOperationsSummary";

import type {
  RevenueForecastCategory,
  RevenueMotion,
  RevenueOperationStatus,
  RevenuePriority,
  RevenueRiskSignal,
} from "./revenueOperationsTypes";

export interface RevenueIntelligenceInput {
  opportunities: SalesOpportunity[];
  pipelineStages: SalesPipelineStage[];
  forecastPeriods: SalesForecastPeriod[];
  historicalActualRevenue?: number;
  historicalForecastRevenue?: number;
  targetRevenue?: number;
  currency?: string;
  generatedAt?: string;
}

export interface RevenueIntelligenceSnapshot {
  generatedAt: string;
  currency: string;
  forecast: RevenueForecast;
  risks: RevenueRiskAssessment[];
  analytics: RevenueAnalytics;
  summary: RevenueOperationsSummary;
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeProbability(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return clampRatio(value > 1 ? value / 100 : value);
}

function resolveForecastCategory(
  opportunity: SalesOpportunity,
): RevenueForecastCategory {
  const probability = normalizeProbability(opportunity.probability);

  if (opportunity.status === "won") {
    return "commit";
  }

  if (opportunity.status === "lost") {
    return "omitted";
  }

  if (probability >= 0.75) {
    return "commit";
  }

  if (probability >= 0.5) {
    return "best_case";
  }

  if (probability > 0) {
    return "pipeline";
  }

  return "omitted";
}

function resolvePriority(
  opportunity: SalesOpportunity,
): RevenuePriority {
  if (
    opportunity.health === "critical" ||
    opportunity.value >= 500_000
  ) {
    return "critical";
  }

  if (
    opportunity.health === "attention" ||
    opportunity.value >= 150_000
  ) {
    return "high";
  }

  if (opportunity.value >= 50_000) {
    return "medium";
  }

  return "low";
}

function resolveOperationStatus(
  opportunity: SalesOpportunity,
): RevenueOperationStatus {
  if (opportunity.status === "won") {
    return "completed";
  }

  if (opportunity.status === "lost") {
    return "archived";
  }

  if (opportunity.health === "critical") {
    return "blocked";
  }

  if (opportunity.health === "attention") {
    return "paused";
  }

  return "active";
}

function resolveMotion(
  opportunity: SalesOpportunity,
): RevenueMotion {
  const normalizedName = opportunity.opportunityName.toLowerCase();

  if (
    normalizedName.includes("renewal") ||
    normalizedName.includes("تجديد")
  ) {
    return "renewal";
  }

  if (
    normalizedName.includes("expansion") ||
    normalizedName.includes("upsell") ||
    normalizedName.includes("توسع")
  ) {
    return "expansion";
  }

  if (
    normalizedName.includes("partner") ||
    normalizedName.includes("شريك")
  ) {
    return "partner";
  }

  if (opportunity.value >= 250_000) {
    return "enterprise";
  }

  return "new_business";
}

function createOwnerId(ownerName: string): string {
  const normalizedOwnerName = ownerName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedOwnerName
    ? `sales-owner-${normalizedOwnerName}`
    : "sales-owner-unassigned";
}

function mapSalesOpportunity(
  opportunity: SalesOpportunity,
  currency: string,
): RevenuePipelineOpportunity {
  return {
    id: opportunity.id,
    accountId: opportunity.id,
    accountName: opportunity.companyName,
    opportunityName: opportunity.opportunityName,
    motion: resolveMotion(opportunity),
    stageId: opportunity.status,
    owner: {
      id: createOwnerId(opportunity.ownerName),
      name: opportunity.ownerName,
      role: "sales_owner",
    },
    amount: Math.max(0, opportunity.value),
    currency,
    priority: resolvePriority(opportunity),
    status: resolveOperationStatus(opportunity),
    expectedCloseDate: opportunity.expectedCloseDate,
    forecastCategory: resolveForecastCategory(opportunity),
    nextActionDueAt: opportunity.nextActionDueAt || null,
  };
}

function mapPipelineStages(
  pipelineStages: SalesPipelineStage[],
): RevenuePipelineStage[] {
  return pipelineStages.map((stage, index) => ({
    id: stage.status,
    name: stage.label,
    order: index + 1,
    probability: clampRatio(stage.percentage / 100),
  }));
}

function calculateHistoricalAccuracy(input: {
  historicalActualRevenue?: number;
  historicalForecastRevenue?: number;
}): number {
  const actual = input.historicalActualRevenue;
  const forecast = input.historicalForecastRevenue;

  if (
    actual === undefined ||
    forecast === undefined
  ) {
    return 0.75;
  }

  return calculateForecastAccuracy(
    forecast,
    actual,
  ).accuracy;
}

function selectCurrentForecastPeriod(
  periods: SalesForecastPeriod[],
): SalesForecastPeriod | null {
  if (!periods.length) {
    return null;
  }

  return periods[periods.length - 1] ?? null;
}

export function createRevenueIntelligenceSnapshot(
  input: RevenueIntelligenceInput,
): RevenueIntelligenceSnapshot {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const currency = input.currency ?? "BHD";

  const opportunities = input.opportunities.map((opportunity) =>
    mapSalesOpportunity(opportunity, currency),
  );

  const stages = mapPipelineStages(input.pipelineStages);

  const selectedForecastPeriod = selectCurrentForecastPeriod(
    input.forecastPeriods,
  );

  const targetRevenue =
    input.targetRevenue ??
    selectedForecastPeriod?.target ??
    0;

  const pipelineIntelligence = createRevenuePipelineIntelligence({
    opportunities,
    stages,
    targetRevenue,
    asOf: generatedAt,
  });

  const committedRevenue =
    selectedForecastPeriod?.committed ??
    pipelineIntelligence.commitRevenue;

  const bestCaseRevenue =
    selectedForecastPeriod?.probable ??
    pipelineIntelligence.bestCaseRevenue;

  const pipelineRevenue =
    selectedForecastPeriod?.pipeline ??
    pipelineIntelligence.pipelineRevenue;

  const historicalAccuracy = calculateHistoricalAccuracy(input);

  const forecast = createRevenueForecast({
    committedRevenue,
    bestCaseRevenue,
    pipelineRevenue,
    weightedPipeline: pipelineIntelligence.weightedPipeline,
    targetRevenue,
    historicalAccuracy,
    timeframe: selectedForecastPeriod
      ? {
          startDate: generatedAt,
          endDate: generatedAt,
        }
      : undefined,
    createdAt: generatedAt,
  });

  const risks = opportunities.map((opportunity) => {
    const stage = stages.find(
      (pipelineStage) => pipelineStage.id === opportunity.stageId,
    );

    return assessOpportunityRevenueRisk(opportunity, {
      asOf: generatedAt,
      stageProbability: stage?.probability ?? 0,
    });
  });

  const riskSignals: RevenueRiskSignal[] = risks.flatMap(
    (risk) => risk.signals ?? [],
  );

  const forecastAccuracy =
    input.historicalActualRevenue !== undefined &&
    input.historicalForecastRevenue !== undefined
      ? calculateForecastAccuracy(
          input.historicalForecastRevenue,
          input.historicalActualRevenue,
        )
      : undefined;

  const analytics = createRevenueAnalytics({
    metrics: [
      {
        key: "total_pipeline",
        label: "Total Pipeline",
        value: pipelineIntelligence.totalPipeline,
        target: targetRevenue,
        unit: "currency",
      },
      {
        key: "weighted_pipeline",
        label: "Weighted Pipeline",
        value: pipelineIntelligence.weightedPipeline,
        target: targetRevenue,
        unit: "currency",
      },
      {
        key: "forecast_revenue",
        label: "Forecast Revenue",
        value: forecast.forecastAmount,
        target: targetRevenue,
        unit: "currency",
      },
      {
        key: "forecast_confidence",
        label: "Forecast Confidence",
        value: forecast.confidence,
        target: 1,
        unit: "ratio",
      },
      {
        key: "pipeline_coverage",
        label: "Pipeline Coverage",
        value: pipelineIntelligence.coverage.coverageRatio,
        target: 3,
        unit: "ratio",
      },
      {
        key: "weighted_coverage",
        label: "Weighted Coverage",
        value: pipelineIntelligence.coverage.weightedCoverageRatio,
        target: 1,
        unit: "ratio",
      },
      {
        key: "revenue_velocity",
        label: "Revenue Velocity",
        value: pipelineIntelligence.velocity.revenueVelocity,
        unit: "currency_per_day",
      },
    ],
    riskSignals,
    stageConversions: [],
    velocity: pipelineIntelligence.velocity,
    forecastAccuracy,
    generatedAt,
  });

  const summary = createRevenueOperationsSummary({
    id: `revenue-summary-${generatedAt.replace(/[^0-9]/g, "")}`,
    status: "active",
    currency,
    targetRevenue,
    totalPipeline: pipelineIntelligence.totalPipeline,
    weightedPipeline: pipelineIntelligence.weightedPipeline,
    commitRevenue: committedRevenue,
    bestCaseRevenue,
    pipelineRevenue,
    forecastRevenue: forecast.forecastAmount,
    forecastConfidence: forecast.confidence,
    velocity: pipelineIntelligence.velocity,
    forecastAccuracy,
    stageConversions: [],
    riskSignals,
    insights: analytics.insights,
    generatedAt,
  });

  return {
    generatedAt,
    currency,
    forecast,
    risks,
    analytics,
    summary,
  };
}