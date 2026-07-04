import { AIAutonomousLearningRuntimeResult } from "./aiAutonomousLearningRuntime";

export interface AIAutonomousLearningReport {
  organizationId: string;
  executionId: string;
  score: number;
  insightCount: number;
  planActionCount: number;
  recommendations: string[];
  summary: string;
  generatedAt: Date;
}

export function createAIAutonomousLearningReport(
  result: AIAutonomousLearningRuntimeResult,
): AIAutonomousLearningReport {
  const planActionCount = result.plan?.actions.length ?? 0;

  return {
    organizationId: result.organizationId,
    executionId: result.executionId,
    score: result.evaluation.score,
    insightCount: result.insights.length,
    planActionCount,
    recommendations: result.evaluation.recommendations,
    summary: buildAIAutonomousLearningReportSummary(result),
    generatedAt: new Date(),
  };
}

export function buildAIAutonomousLearningReportSummary(
  result: AIAutonomousLearningRuntimeResult,
): string {
  const planActionCount = result.plan?.actions.length ?? 0;

  return [
    `Autonomous learning execution ${result.executionId} completed.`,
    `Score: ${result.evaluation.score}.`,
    `Insights generated: ${result.insights.length}.`,
    `Plan actions generated: ${planActionCount}.`,
  ].join(" ");
}