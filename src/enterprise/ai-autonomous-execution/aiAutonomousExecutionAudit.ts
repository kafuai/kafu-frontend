import { AIAutonomousExecutionResult } from "./aiAutonomousExecutionResult";

export interface AIAutonomousExecutionAuditRecord {
  executionId: string;
  organizationId: string;
  planId: string;
  status: string;
  executedTasks: number;
  waitingApprovalTasks: number;
  blockedTasks: number;
  skippedTasks: number;
  auditedAt: Date;
}

export function createAIAutonomousExecutionAuditRecord(
  result: AIAutonomousExecutionResult,
): AIAutonomousExecutionAuditRecord {
  return {
    executionId: result.executionId,
    organizationId: result.organizationId,
    planId: result.planId,
    status: result.status,
    executedTasks: result.taskResults.filter(
      (task) => task.status === "executed",
    ).length,
    waitingApprovalTasks: result.taskResults.filter(
      (task) => task.status === "waiting_approval",
    ).length,
    blockedTasks: result.taskResults.filter(
      (task) => task.status === "blocked",
    ).length,
    skippedTasks: result.taskResults.filter(
      (task) => task.status === "skipped",
    ).length,
    auditedAt: new Date(),
  };
}