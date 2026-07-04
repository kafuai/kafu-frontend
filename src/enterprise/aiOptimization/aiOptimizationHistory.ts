import { AIOptimizationExecution } from "./aiOptimizationExecution";
import { AIOptimizationPlan } from "./aiOptimizationPlan";
import { AIOptimizationStatus } from "./aiOptimizationTypes";

export interface AIOptimizationHistoryRecord {
  id: string;
  organizationId: string;
  planId: string;
  executionId?: string;
  status: AIOptimizationStatus;
  title: string;
  summary: string;
  createdAt: Date;
}

export function createAIOptimizationHistoryRecord(
  id: string,
  plan: AIOptimizationPlan,
  execution?: AIOptimizationExecution,
): AIOptimizationHistoryRecord {
  return {
    id,
    organizationId: plan.organizationId,
    planId: plan.id,
    executionId: execution?.id,
    status: execution?.status ?? plan.status,
    title: plan.title,
    summary: buildOptimizationHistorySummary(plan, execution),
    createdAt: new Date(),
  };
}

export function buildOptimizationHistorySummary(
  plan: AIOptimizationPlan,
  execution?: AIOptimizationExecution,
): string {
  const recommendationCount = plan.recommendations.length;
  const stepCount = plan.steps.length;
  const executionStatus = execution ? ` Execution status: ${execution.status}.` : "";

  return `Optimization plan ${plan.title} includes ${recommendationCount} recommendations and ${stepCount} execution steps.${executionStatus}`;
}

export function filterAIOptimizationHistoryByStatus(
  history: AIOptimizationHistoryRecord[],
  status: AIOptimizationStatus,
): AIOptimizationHistoryRecord[] {
  return history.filter((record) => record.status === status);
}