import { runWorkflowEngine } from "./workflowEngine";
import { WorkflowDefinition } from "./workflowTypes";

export type WorkflowExecutionResult = ReturnType<typeof runWorkflowEngine>;

export function executeWorkflow(
  workflow: WorkflowDefinition,
): WorkflowExecutionResult {
  return runWorkflowEngine(workflow);
}