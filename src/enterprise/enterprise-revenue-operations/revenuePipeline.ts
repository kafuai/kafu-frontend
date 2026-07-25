import type {
  RevenueConcentration,
  RevenueCoverageMetrics,
  RevenueForecastCategory,
  RevenueMotion,
  RevenueOperationStatus,
  RevenueOwner,
  RevenuePriority,
  RevenueStageConversion,
  RevenueVelocityMetrics,
} from "./revenueOperationsTypes";

export interface RevenuePipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
}

export interface RevenuePipelineOpportunity {
  id: string;
  accountId?: string;
  accountName: string;
  opportunityName?: string;
  motion: RevenueMotion;
  stageId: string;
  owner: RevenueOwner;
  amount: number;
  currency: string;
  priority: RevenuePriority;
  status: RevenueOperationStatus;
  expectedCloseDate: string;
  createdAt?: string;
  stageEnteredAt?: string;
  closedAt?: string | null;
  won?: boolean | null;
  forecastCategory?: RevenueForecastCategory;
  nextActionDueAt?: string | null;
  lastActivityAt?: string | null;
}

export interface RevenuePipelineIntelligence {
  totalPipeline: number;
  weightedPipeline: number;
  commitRevenue: number;
  bestCaseRevenue: number;
  pipelineRevenue: number;
  omittedRevenue: number;
  openOpportunityCount: number;
  averageDealValue: number;
  coverage: RevenueCoverageMetrics;
  concentration: RevenueConcentration;
  velocity: RevenueVelocityMetrics;
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

function safeAmount(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function daysBetween(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 0;
  }

  return Math.max(0, (endTime - startTime) / 86_400_000);
}

export function calculatePipelineValue(
  opportunities: RevenuePipelineOpportunity[],
): number {
  return opportunities.reduce(
    (total, opportunity) => total + safeAmount(opportunity.amount),
    0,
  );
}

export function calculateWeightedPipeline(
  opportunities: RevenuePipelineOpportunity[],
  stages: RevenuePipelineStage[],
): number {
  const probabilities = new Map(
    stages.map((stage) => [
      stage.id,
      normalizeProbability(stage.probability),
    ]),
  );

  return opportunities.reduce((total, opportunity) => {
    const probability = probabilities.get(opportunity.stageId) ?? 0;

    return total + safeAmount(opportunity.amount) * probability;
  }, 0);
}

export function calculateForecastCategoryTotals(
  opportunities: RevenuePipelineOpportunity[],
): Record<RevenueForecastCategory, number> {
  return opportunities.reduce<Record<RevenueForecastCategory, number>>(
    (totals, opportunity) => {
      const category = opportunity.forecastCategory ?? "pipeline";

      totals[category] += safeAmount(opportunity.amount);

      return totals;
    },
    {
      commit: 0,
      best_case: 0,
      pipeline: 0,
      omitted: 0,
    },
  );
}

export function calculatePipelineCoverage(
  totalPipeline: number,
  weightedPipeline: number,
  targetRevenue: number,
): RevenueCoverageMetrics {
  const normalizedTarget = Math.max(0, targetRevenue);
  const normalizedPipeline = Math.max(0, totalPipeline);
  const normalizedWeightedPipeline = Math.max(0, weightedPipeline);

  return {
    targetRevenue: normalizedTarget,
    totalPipeline: normalizedPipeline,
    weightedPipeline: normalizedWeightedPipeline,
    coverageRatio:
      normalizedTarget > 0
        ? normalizedPipeline / normalizedTarget
        : 0,
    weightedCoverageRatio:
      normalizedTarget > 0
        ? normalizedWeightedPipeline / normalizedTarget
        : 0,
    coverageGap: Math.max(
      0,
      normalizedTarget - normalizedWeightedPipeline,
    ),
  };
}

export function calculateRevenueConcentration(
  opportunities: RevenuePipelineOpportunity[],
): RevenueConcentration {
  const amounts = opportunities
    .map((opportunity) => safeAmount(opportunity.amount))
    .filter((amount) => amount > 0)
    .sort((first, second) => second - first);

  const totalPipeline = amounts.reduce((total, amount) => total + amount, 0);
  const topOpportunityValue = amounts[0] ?? 0;
  const topFiveValue = amounts
    .slice(0, 5)
    .reduce((total, amount) => total + amount, 0);

  const topOpportunityShare =
    totalPipeline > 0 ? topOpportunityValue / totalPipeline : 0;

  const topFiveShare =
    totalPipeline > 0 ? topFiveValue / totalPipeline : 0;

  return {
    topOpportunityValue,
    topOpportunityShare,
    topFiveValue,
    topFiveShare,
    concentrated: topOpportunityShare >= 0.35 || topFiveShare >= 0.75,
  };
}

export function calculateSalesVelocity(
  opportunities: RevenuePipelineOpportunity[],
  asOf = new Date().toISOString(),
): RevenueVelocityMetrics {
  const closedOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.closedAt &&
      opportunity.createdAt &&
      opportunity.won !== null &&
      opportunity.won !== undefined,
  );

  const wonOpportunities = closedOpportunities.filter(
    (opportunity) => opportunity.won === true,
  );

  const opportunityCount = opportunities.length;

  const averageDealValue =
    opportunityCount > 0
      ? calculatePipelineValue(opportunities) / opportunityCount
      : 0;

  const winRate =
    closedOpportunities.length > 0
      ? wonOpportunities.length / closedOpportunities.length
      : 0;

  const cycleDurations = closedOpportunities
    .map((opportunity) =>
      daysBetween(
        opportunity.createdAt ?? asOf,
        opportunity.closedAt ?? asOf,
      ),
    )
    .filter((duration) => duration > 0);

  const averageSalesCycleDays =
    cycleDurations.length > 0
      ? cycleDurations.reduce((total, duration) => total + duration, 0) /
        cycleDurations.length
      : 0;

  const revenueVelocity =
    averageSalesCycleDays > 0
      ? (opportunityCount *
          averageDealValue *
          clampRatio(winRate)) /
        averageSalesCycleDays
      : 0;

  return {
    opportunityCount,
    averageDealValue,
    winRate,
    averageSalesCycleDays,
    revenueVelocity,
  };
}

export function calculateStageConversion(
  stages: RevenuePipelineStage[],
  history: Array<{
    opportunityId: string;
    stageId: string;
    enteredAt: string;
    exitedAt?: string | null;
    outcome?: "advanced" | "won" | "lost" | "open";
  }>,
): RevenueStageConversion[] {
  return stages
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((stage) => {
      const stageHistory = history.filter(
        (entry) => entry.stageId === stage.id,
      );

      const entered = stageHistory.length;
      const advanced = stageHistory.filter(
        (entry) =>
          entry.outcome === "advanced" || entry.outcome === "won",
      ).length;
      const won = stageHistory.filter(
        (entry) => entry.outcome === "won",
      ).length;
      const lost = stageHistory.filter(
        (entry) => entry.outcome === "lost",
      ).length;

      const durations = stageHistory
        .filter((entry) => entry.exitedAt)
        .map((entry) =>
          daysBetween(entry.enteredAt, entry.exitedAt as string),
        );

      const averageDaysInStage =
        durations.length > 0
          ? durations.reduce((total, duration) => total + duration, 0) /
            durations.length
          : 0;

      return {
        stageId: stage.id,
        stageName: stage.name,
        entered,
        advanced,
        won,
        lost,
        conversionRate: entered > 0 ? advanced / entered : 0,
        winRate: entered > 0 ? won / entered : 0,
        lossRate: entered > 0 ? lost / entered : 0,
        averageDaysInStage,
      };
    });
}

export function createRevenuePipelineIntelligence(input: {
  opportunities: RevenuePipelineOpportunity[];
  stages: RevenuePipelineStage[];
  targetRevenue: number;
  asOf?: string;
}): RevenuePipelineIntelligence {
  const totalPipeline = calculatePipelineValue(input.opportunities);
  const weightedPipeline = calculateWeightedPipeline(
    input.opportunities,
    input.stages,
  );

  const categories = calculateForecastCategoryTotals(input.opportunities);

  return {
    totalPipeline,
    weightedPipeline,
    commitRevenue: categories.commit,
    bestCaseRevenue: categories.best_case,
    pipelineRevenue: categories.pipeline,
    omittedRevenue: categories.omitted,
    openOpportunityCount: input.opportunities.filter(
      (opportunity) =>
        opportunity.status === "active" ||
        opportunity.status === "draft" ||
        opportunity.status === "paused" ||
        opportunity.status === "blocked",
    ).length,
    averageDealValue:
      input.opportunities.length > 0
        ? totalPipeline / input.opportunities.length
        : 0,
    coverage: calculatePipelineCoverage(
      totalPipeline,
      weightedPipeline,
      input.targetRevenue,
    ),
    concentration: calculateRevenueConcentration(input.opportunities),
    velocity: calculateSalesVelocity(
      input.opportunities,
      input.asOf,
    ),
  };
}