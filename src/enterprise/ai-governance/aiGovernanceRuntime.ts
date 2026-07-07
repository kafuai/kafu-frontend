import { AIGovernanceApprovalWorkflow, isGovernanceWorkflowApproved } from "./aiGovernanceApprovalWorkflow";
import { AIGovernanceViolation, getOpenGovernanceViolations } from "./aiGovernanceViolation";

export interface AIGovernanceRuntimeInput {
  workflow: AIGovernanceApprovalWorkflow;
  violations: AIGovernanceViolation[];
}

export interface AIGovernanceRuntimeResult {
  approved: boolean;
  openViolationCount: number;
  healthy: boolean;
}

export function executeAIGovernanceRuntime(
  input: AIGovernanceRuntimeInput,
): AIGovernanceRuntimeResult {
  const open = getOpenGovernanceViolations(input.violations);
  const approved = isGovernanceWorkflowApproved(input.workflow);

  return {
    approved,
    openViolationCount: open.length,
    healthy: approved && open.length === 0,
  };
}
