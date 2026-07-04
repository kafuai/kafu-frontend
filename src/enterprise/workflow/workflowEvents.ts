import { WorkflowStatus, WorkflowStepStatus } from "./workflowTypes";

export type WorkflowEventType =
  | "workflow.created"
  | "workflow.started"
  | "workflow.paused"
  | "workflow.completed"
  | "workflow.failed"
  | "workflow.cancelled"
  | "workflow.step.started"
  | "workflow.step.completed"
  | "workflow.step.failed";

export type WorkflowEvent = {
  id: string;
  workflowId: string;
  organizationId: string;
  type: WorkflowEventType;
  message: string;
  workflowStatus?: WorkflowStatus;
  stepId?: string;
  stepStatus?: WorkflowStepStatus;
  createdAt: Date;
};

export function createWorkflowEvent(
  input: Omit<WorkflowEvent, "createdAt">,
): WorkflowEvent {
  return {
    ...input,
    createdAt: new Date(),
  };
}