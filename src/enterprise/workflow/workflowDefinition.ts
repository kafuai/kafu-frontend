import { WorkflowDefinition } from "./workflowTypes";

export function createWorkflowDefinition(
  workflow: WorkflowDefinition,
): WorkflowDefinition {
  return {
    ...workflow,
    createdAt: workflow.createdAt ?? new Date(),
    updatedAt: new Date(),
  };
}