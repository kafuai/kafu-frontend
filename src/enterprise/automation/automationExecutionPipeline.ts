import { AutomationDefinition } from "./automationTypes";
import {
  AutomationExecutionContext,
  createAutomationExecutionContext,
} from "./automationExecutionContext";
import { updateAutomationExecutionStatus } from "./automationLifecycle";

export type AutomationExecutionPipelineResult = {
  automation: AutomationDefinition;
  context: AutomationExecutionContext;
};

export function runAutomationExecutionPipeline(
  automation: AutomationDefinition,
): AutomationExecutionPipelineResult {
  let context = createAutomationExecutionContext({
    automationId: automation.id,
    organizationId: automation.organizationId,
  });

  context = updateAutomationExecutionStatus(context, "running");
  context = updateAutomationExecutionStatus(context, "completed");

  return {
    automation,
    context,
  };
}