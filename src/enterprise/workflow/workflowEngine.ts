import { createWorkflowStateSnapshot, WorkflowStateSnapshot } from "./workflowState";
import { validateWorkflowDefinition } from "./workflowValidator";
import { WorkflowDefinition } from "./workflowTypes";

export type WorkflowEngineResult = {
  workflow: WorkflowDefinition;
  state: WorkflowStateSnapshot;
};

export function runWorkflowEngine(
  workflow: WorkflowDefinition,
): WorkflowEngineResult {
  validateWorkflowDefinition(workflow);

  const state = createWorkflowStateSnapshot(workflow);

  return {
    workflow,
    state,
  };
}