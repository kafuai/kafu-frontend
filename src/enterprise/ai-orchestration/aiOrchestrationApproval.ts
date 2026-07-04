export type AIOrchestrationApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface AIOrchestrationApproval {
  id: string;
  executionId: string;
  workflowId: string;
  stepId: string;
  approver: string;
  status: AIOrchestrationApprovalStatus;
  comments?: string;
  createdAt: Date;
  decidedAt?: Date;
}

export function approveAIOrchestrationStep(
  approval: AIOrchestrationApproval,
  comments?: string,
): AIOrchestrationApproval {
  return {
    ...approval,
    status: "approved",
    comments,
    decidedAt: new Date(),
  };
}

export function rejectAIOrchestrationStep(
  approval: AIOrchestrationApproval,
  comments?: string,
): AIOrchestrationApproval {
  return {
    ...approval,
    status: "rejected",
    comments,
    decidedAt: new Date(),
  };
}