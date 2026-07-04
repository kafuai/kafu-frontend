import { WorkflowDefinition } from "../workflow";
import { AutomationDefinition } from "./automationTypes";
import {
  bindAutomationToWorkflow,
  AutomationWorkflowBinding,
} from "./automationWorkflowIntegration";
import {
  orchestrateAutomation,
  AutomationOrchestrationResult,
} from "./automationOrchestrator";

export type AutomationWorkflowOrchestrationResult = {
  binding: AutomationWorkflowBinding;
  orchestration: AutomationOrchestrationResult;
};

export function orchestrateAutomationWorkflow(input: {
  automation: AutomationDefinition;
  workflow: WorkflowDefinition;
}): AutomationWorkflowOrchestrationResult {
  return {
    binding: bindAutomationToWorkflow({
      automationId: input.automation.id,
      organizationId: input.automation.organizationId,
      workflow: input.workflow,
    }),
    orchestration: orchestrateAutomation(input.automation),
  };
}