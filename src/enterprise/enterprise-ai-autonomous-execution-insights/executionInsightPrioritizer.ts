import {
  ExecutionInsight,
  ExecutionInsightSeverity,
} from "./executionInsightTypes";

const severityScore: Record<ExecutionInsightSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const prioritizeExecutionInsights = (
  insights: readonly ExecutionInsight[],
): ExecutionInsight[] => {
  return [...insights].sort((first, second) => {
    const severityDelta =
      severityScore[second.severity] - severityScore[first.severity];

    if (severityDelta !== 0) {
      return severityDelta;
    }

    return second.confidence - first.confidence;
  });
};