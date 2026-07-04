import { AutomationDefinition, AutomationAction } from "./automationTypes";
import { validateAutomationDefinition } from "./automationValidator";

export type AutomationExecutionResult = {
  automationId: string;
  organizationId: string;
  status: "executed" | "failed";
  actions: AutomationAction[];
  errors: string[];
  executedAt: Date;
};

export function executeAutomation(
  definition: AutomationDefinition,
): AutomationExecutionResult {
  const validation = validateAutomationDefinition(definition);

  if (!validation.valid) {
    return {
      automationId: definition.id,
      organizationId: definition.organizationId,
      status: "failed",
      actions: [],
      errors: validation.errors,
      executedAt: new Date(),
    };
  }

  return {
    automationId: definition.id,
    organizationId: definition.organizationId,
    status: "executed",
    actions: definition.actions,
    errors: [],
    executedAt: new Date(),
  };
}