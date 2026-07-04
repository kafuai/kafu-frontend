import {
  ExecutionAnalyticsInput,
  ExecutionAnalyticsReport,
} from "./analyticsTypes";
import {
  calculateHealthScore,
  calculateRiskScore,
} from "./analyticsScoring";
import { detectExecutionAnalyticsSignals } from "./analyticsSignalDetector";
import { generateExecutionAnalyticsInsights } from "./analyticsInsightEngine";

export function buildExecutionAnalyticsReport(
  input: ExecutionAnalyticsInput,
): ExecutionAnalyticsReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const signals = detectExecutionAnalyticsSignals(input.metrics);
  const insights = generateExecutionAnalyticsInsights(signals, input.metrics);
  const healthScore = calculateHealthScore(input.metrics);
  const riskScore = calculateRiskScore(input.metrics);

  return {
    id: `execution-analytics-report-${generatedAt}`,
    generatedAt,
    metrics: input.metrics,
    signals,
    insights,
    healthScore,
    riskScore,
    summary: buildAnalyticsSummary(healthScore, riskScore, insights.length),
  };
}

function buildAnalyticsSummary(
  healthScore: number,
  riskScore: number,
  insightCount: number,
): string {
  if (riskScore >= 75) {
    return `Execution analytics indicates critical operational risk with ${insightCount} actionable insights.`;
  }

  if (riskScore >= 40) {
    return `Execution analytics indicates elevated operational risk with ${insightCount} actionable insights.`;
  }

  if (healthScore >= 85) {
    return `Execution analytics indicates strong execution health with ${insightCount} actionable insights.`;
  }

  return `Execution analytics indicates moderate execution variance with ${insightCount} actionable insights.`;
}