import { executeWorkflow, WorkflowExecutionResult } from "./workflowExecution";
import { WorkflowDefinition } from "./workflowTypes";

export type EnterpriseWorkflowResult = WorkflowExecutionResult;

export function runEnterpriseWorkflow(
  workflow: WorkflowDefinition,
): EnterpriseWorkflowResult {
  return executeWorkflow(workflow);
}