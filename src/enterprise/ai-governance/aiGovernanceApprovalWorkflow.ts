export interface AIGovernanceApprovalStep {
  name: string;
  approver: string;
  approved: boolean;
  approvedAt?: string;
}

export interface AIGovernanceApprovalWorkflow {
  workflowId: string;
  steps: AIGovernanceApprovalStep[];
}

export function isGovernanceWorkflowApproved(
  workflow: AIGovernanceApprovalWorkflow,
): boolean {
  return workflow.steps.every((step) => step.approved);
}
