import { AIOrchestrationAnalytics } from "./aiOrchestrationAnalytics";
import { AIOrchestrationMetrics } from "./aiOrchestrationMetrics";
import { AIOrchestrationResult } from "./aiOrchestrationResult";

export interface AIOrchestrationReport {
  executionId: string;
  workflowId: string;
  organizationId: string;
  generatedAt: Date;
  success: boolean;
  metrics: AIOrchestrationMetrics;
  analytics: AIOrchestrationAnalytics;
  stepSummaries: AIOrchestrationReportStepSummary[];
}

export interface AIOrchestrationReportStepSummary {
  stepId: string;
  success: boolean;
  durationMs: number;
  warnings: string[];
  errors: string[];
}

export function createAIOrchestrationReport(
  result: AIOrchestrationResult,
  metrics: AIOrchestrationMetrics,
  analytics: AIOrchestrationAnalytics,
): AIOrchestrationReport {
  return {
    executionId: result.executionId,
    workflowId: result.workflowId,
    organizationId: result.organizationId,
    generatedAt: new Date(),
    success: result.success,
    metrics,
    analytics,
    stepSummaries: result.stepResults.map((step) => ({
      stepId: step.stepId,
      success: step.success,
      durationMs: step.durationMs,
      warnings: step.warnings,
      errors: step.errors,
    })),
  };
}