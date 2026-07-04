import { WorkflowDefinition, WorkflowStatus } from "./workflowTypes";

export type WorkflowStateSnapshot = {
  workflowId: string;
  organizationId: string;
  status: WorkflowStatus;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  pendingSteps: number;
  runningSteps: number;
  updatedAt: Date;
};

export function createWorkflowStateSnapshot(
  workflow: WorkflowDefinition,
): WorkflowStateSnapshot {
  return {
    workflowId: workflow.id,
    organizationId: workflow.organizationId,
    status: workflow.status,
    totalSteps: workflow.steps.length,
    completedSteps: workflow.steps.filter((step) => step.status === "completed").length,
    failedSteps: workflow.steps.filter((step) => step.status === "failed").length,
    pendingSteps: workflow.steps.filter((step) => step.status === "pending").length,
    runningSteps: workflow.steps.filter((step) => step.status === "running").length,
    updatedAt: new Date(),
  };
}