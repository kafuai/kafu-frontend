import { WorkflowDefinition } from "../workflow";

export type AutomationWorkflowBinding = {
  automationId: string;
  workflowId: string;
  organizationId: string;
  workflow: WorkflowDefinition;
};

export function bindAutomationToWorkflow(input: {
  automationId: string;
  organizationId: string;
  workflow: WorkflowDefinition;
}): AutomationWorkflowBinding {
  return {
    automationId: input.automationId,
    organizationId: input.organizationId,
    workflowId: input.workflow.id,
    workflow: input.workflow,
  };
}