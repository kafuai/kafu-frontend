import { AIOrchestrationMetrics } from "./aiOrchestrationMetrics";

export interface AIOrchestrationAnalytics {
  executionId: string;
  workflowId: string;
  organizationId: string;
  health: "excellent" | "good" | "degraded" | "critical";
  recommendations: string[];
}

export function analyzeAIOrchestrationMetrics(
  metrics: AIOrchestrationMetrics,
): AIOrchestrationAnalytics {
  const recommendations: string[] = [];

  let health: AIOrchestrationAnalytics["health"] = "excellent";

  if (metrics.failedSteps > 0) {
    health = "degraded";
    recommendations.push("Review failed orchestration steps and retry policies.");
  }

  if (metrics.successRate < 0.75) {
    health = "critical";
    recommendations.push("Investigate orchestration workflow reliability.");
  }

  if (metrics.averageStepDurationMs > 10_000) {
    recommendations.push("Optimize long-running orchestration capabilities.");
  }

  if (metrics.skippedSteps > 0) {
    recommendations.push("Review skipped steps to confirm workflow completeness.");
  }

  return {
    executionId: metrics.executionId,
    workflowId: metrics.workflowId,
    organizationId: metrics.organizationId,
    health,
    recommendations,
  };
}