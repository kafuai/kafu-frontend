import { prioritizeExecutionInsights } from "./executionInsightPrioritizer";
import {
  summarizeExecutionInsights,
  ExecutionInsightSummary,
} from "./executionInsightSummary";
import { ExecutionInsight } from "./executionInsightTypes";

export interface ExecutionInsightReport {
  readonly reportId: string;
  readonly generatedAt: string;
  readonly summary: ExecutionInsightSummary;
  readonly prioritizedInsights: readonly ExecutionInsight[];
}

export const createExecutionInsightReport = (
  insights: readonly ExecutionInsight[],
  generatedAt: string = new Date().toISOString(),
): ExecutionInsightReport => {
  const prioritizedInsights = prioritizeExecutionInsights(insights);

  return {
    reportId: `execution-insight-report-${generatedAt}`,
    generatedAt,
    summary: summarizeExecutionInsights(prioritizedInsights),
    prioritizedInsights,
  };
};