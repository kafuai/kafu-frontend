import {
  AIOptimizationExpectedImpact,
  AIOptimizationMetricSnapshot,
} from "./aiOptimizationTypes";

export interface AIOptimizationMetricsReport {
  organizationId: string;
  before: AIOptimizationMetricSnapshot;
  after: AIOptimizationMetricSnapshot;
  actualImpact: AIOptimizationExpectedImpact;
  successScore: number;
  createdAt: Date;
}

export function calculateAIOptimizationMetricsReport(
  organizationId: string,
  before: AIOptimizationMetricSnapshot,
  after: AIOptimizationMetricSnapshot,
): AIOptimizationMetricsReport {
  const actualImpact: AIOptimizationExpectedImpact = {
    costReductionPercent: calculateReduction(before.averageCostUsd, after.averageCostUsd),
    latencyReductionPercent: calculateReduction(
      before.averageLatencyMs,
      after.averageLatencyMs,
    ),
    tokenReductionPercent: calculateReduction(
      before.averageTokensUsed,
      after.averageTokensUsed,
    ),
    accuracyIncreasePercent: calculateIncrease(before.accuracyScore, after.accuracyScore),
    qualityIncreasePercent: calculateIncrease(before.qualityScore, after.qualityScore),
    safetyIncreasePercent: calculateIncrease(before.safetyScore, after.safetyScore),
    reliabilityIncreasePercent: calculateIncrease(
      before.reliabilityScore,
      after.reliabilityScore,
    ),
    hallucinationReductionPercent: calculateReduction(
      before.hallucinationRate,
      after.hallucinationRate,
    ),
    roiIncreasePercent: calculateIncrease(before.roiScore, after.roiScore),
  };

  return {
    organizationId,
    before,
    after,
    actualImpact,
    successScore: calculateOptimizationSuccessScore(actualImpact),
    createdAt: new Date(),
  };
}

export function calculateOptimizationSuccessScore(
  impact: AIOptimizationExpectedImpact,
): number {
  const values = Object.values(impact).filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value),
  );

  if (values.length === 0) return 0;

  const average = values.reduce((sum, value) => sum + Math.max(0, value), 0) / values.length;

  return Math.min(1, average / 100);
}

function calculateReduction(before?: number, after?: number): number | undefined {
  if (before === undefined || after === undefined || before === 0) return undefined;
  return ((before - after) / before) * 100;
}

function calculateIncrease(before?: number, after?: number): number | undefined {
  if (before === undefined || after === undefined || before === 0) return undefined;
  return ((after - before) / before) * 100;
}