import type {
  RevenueForecastAccuracy,
  RevenueMetric,
  RevenueTimeframe,
} from "./revenueOperationsTypes";

export interface RevenueForecastInput {
  committedRevenue: number;
  bestCaseRevenue: number;
  pipelineRevenue?: number;
  weightedPipeline?: number;
  targetRevenue?: number;
  historicalAccuracy: number;
  timeframe?: RevenueTimeframe;
  createdAt?: string;
}

export interface RevenueForecast {
  id: string;
  timeframe: RevenueTimeframe;
  committedRevenue: number;
  bestCaseRevenue: number;
  pipelineRevenue: number;
  weightedPipeline: number;
  forecastAmount: number;
  targetRevenue: number;
  confidence: number;
  coverageRatio: number;
  forecastGap: number;
  metrics: RevenueMetric[];
  createdAt: string;
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function safeRevenue(value: number | undefined): number {
  return Number.isFinite(value) && (value ?? 0) > 0 ? value ?? 0 : 0;
}

function createForecastId(createdAt: string): string {
  return `revenue-forecast-${createdAt.replace(/[^0-9]/g, "")}`;
}

export function calculateForecastAccuracy(
  forecastRevenue: number,
  actualRevenue: number,
): RevenueForecastAccuracy {
  const normalizedForecast = safeRevenue(forecastRevenue);
  const normalizedActual = safeRevenue(actualRevenue);
  const absoluteError = Math.abs(normalizedForecast - normalizedActual);

  const percentageError =
    normalizedActual > 0
      ? absoluteError / normalizedActual
      : normalizedForecast > 0
        ? 1
        : 0;

  return {
    actualRevenue: normalizedActual,
    forecastRevenue: normalizedForecast,
    absoluteError,
    percentageError,
    accuracy: clampRatio(1 - percentageError),
    bias: normalizedForecast - normalizedActual,
  };
}

export function calculateForecastConfidence(input: {
  historicalAccuracy: number;
  commitShare: number;
  weightedCoverageRatio: number;
}): number {
  const historicalAccuracy = clampRatio(input.historicalAccuracy);
  const commitShare = clampRatio(input.commitShare);
  const coverageQuality = clampRatio(input.weightedCoverageRatio);

  return clampRatio(
    historicalAccuracy * 0.55 +
      commitShare * 0.25 +
      coverageQuality * 0.2,
  );
}

export function createRevenueForecast(
  input: RevenueForecastInput,
): RevenueForecast {
  const createdAt = input.createdAt ?? new Date().toISOString();

  const committedRevenue = safeRevenue(input.committedRevenue);
  const bestCaseRevenue = safeRevenue(input.bestCaseRevenue);
  const pipelineRevenue = safeRevenue(input.pipelineRevenue);
  const weightedPipeline = safeRevenue(input.weightedPipeline);
  const targetRevenue = safeRevenue(input.targetRevenue);

  const bestCaseContribution = bestCaseRevenue * 0.5;
  const pipelineContribution =
    weightedPipeline > 0
      ? weightedPipeline
      : pipelineRevenue * 0.2;

  const forecastAmount =
    committedRevenue +
    bestCaseContribution +
    pipelineContribution;

  const totalUnweighted =
    committedRevenue + bestCaseRevenue + pipelineRevenue;

  const commitShare =
    totalUnweighted > 0 ? committedRevenue / totalUnweighted : 0;

  const weightedCoverageRatio =
    targetRevenue > 0 ? forecastAmount / targetRevenue : 0;

  const confidence = calculateForecastConfidence({
    historicalAccuracy: input.historicalAccuracy,
    commitShare,
    weightedCoverageRatio,
  });

  const coverageRatio =
    targetRevenue > 0 ? forecastAmount / targetRevenue : 0;

  const forecastGap = Math.max(0, targetRevenue - forecastAmount);

  return {
    id: createForecastId(createdAt),
    timeframe:
      input.timeframe ?? {
        startDate: createdAt,
        endDate: createdAt,
      },
    committedRevenue,
    bestCaseRevenue,
    pipelineRevenue,
    weightedPipeline,
    forecastAmount,
    targetRevenue,
    confidence,
    coverageRatio,
    forecastGap,
    metrics: [
      {
        key: "committed_revenue",
        label: "Committed Revenue",
        value: committedRevenue,
        unit: "currency",
      },
      {
        key: "best_case_revenue",
        label: "Best Case Revenue",
        value: bestCaseRevenue,
        unit: "currency",
      },
      {
        key: "pipeline_revenue",
        label: "Pipeline Revenue",
        value: pipelineRevenue,
        unit: "currency",
      },
      {
        key: "weighted_pipeline",
        label: "Weighted Pipeline",
        value: weightedPipeline,
        unit: "currency",
      },
      {
        key: "forecast_amount",
        label: "Forecast Amount",
        value: forecastAmount,
        target: targetRevenue,
        unit: "currency",
      },
      {
        key: "forecast_confidence",
        label: "Forecast Confidence",
        value: confidence,
        target: 1,
        unit: "ratio",
      },
      {
        key: "forecast_coverage",
        label: "Forecast Coverage",
        value: coverageRatio,
        target: 1,
        unit: "ratio",
      },
      {
        key: "forecast_gap",
        label: "Forecast Gap",
        value: forecastGap,
        target: 0,
        unit: "currency",
      },
    ],
    createdAt,
  };
}