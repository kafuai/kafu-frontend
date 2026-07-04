import {
  ExecutionInsight,
  ExecutionInsightCategory,
  ExecutionInsightSeverity,
} from "./executionInsightTypes";

export interface ExecutionInsightSummary {
  readonly totalInsights: number;
  readonly bySeverity: Record<ExecutionInsightSeverity, number>;
  readonly byCategory: Record<ExecutionInsightCategory, number>;
  readonly highestSeverity?: ExecutionInsightSeverity;
  readonly averageConfidence: number;
}

const emptySeverityCount = (): Record<ExecutionInsightSeverity, number> => ({
  low: 0,
  medium: 0,
  high: 0,
  critical: 0,
});

const emptyCategoryCount = (): Record<ExecutionInsightCategory, number> => ({
  performance: 0,
  reliability: 0,
  cost: 0,
  risk: 0,
  quality: 0,
  efficiency: 0,
  automation: 0,
});

const severityRank: Record<ExecutionInsightSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const summarizeExecutionInsights = (
  insights: readonly ExecutionInsight[],
): ExecutionInsightSummary => {
  const bySeverity = emptySeverityCount();
  const byCategory = emptyCategoryCount();

  let confidenceTotal = 0;
  let highestSeverity: ExecutionInsightSeverity | undefined;

  for (const insight of insights) {
    bySeverity[insight.severity] += 1;
    byCategory[insight.category] += 1;
    confidenceTotal += insight.confidence;

    if (
      highestSeverity === undefined ||
      severityRank[insight.severity] > severityRank[highestSeverity]
    ) {
      highestSeverity = insight.severity;
    }
  }

  return {
    totalInsights: insights.length,
    bySeverity,
    byCategory,
    highestSeverity,
    averageConfidence:
      insights.length === 0 ? 0 : Number((confidenceTotal / insights.length).toFixed(4)),
  };
};