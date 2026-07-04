import { GovernanceSubject } from "./governanceTypes";

export type WorkflowGovernanceInput = {
  id: string;
  organizationId: string;
};

export function mapWorkflowToGovernanceSubject(
  workflow: WorkflowGovernanceInput,
): GovernanceSubject {
  return {
    id: workflow.id,
    type: "workflow",
    organizationId: workflow.organizationId,
  };
}