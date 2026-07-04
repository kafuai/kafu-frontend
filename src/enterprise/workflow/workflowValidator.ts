import { WorkflowDefinition } from "./workflowTypes";

export function validateWorkflowDefinition(
  workflow: WorkflowDefinition,
): void {
  const errors: string[] = [];

  if (!workflow.id) errors.push("Workflow id is required.");
  if (!workflow.organizationId) errors.push("Organization id is required.");
  if (!workflow.name) errors.push("Workflow name is required.");
  if (!workflow.status) errors.push("Workflow status is required.");
  if (!workflow.priority) errors.push("Workflow priority is required.");
  if (!Array.isArray(workflow.steps)) errors.push("Workflow steps must be an array.");

  for (const step of workflow.steps ?? []) {
    if (!step.id) errors.push("Workflow step id is required.");
    if (!step.name) errors.push("Workflow step name is required.");
    if (!step.status) errors.push(`Workflow step status is required for step ${step.id}.`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}