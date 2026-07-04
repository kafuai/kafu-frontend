import { AutomationDefinition } from "./automationTypes";

export type AutomationValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateAutomationDefinition(
  definition: AutomationDefinition,
): AutomationValidationResult {
  const errors: string[] = [];

  if (!definition.id) errors.push("Automation id is required.");
  if (!definition.organizationId) errors.push("Organization id is required.");
  if (!definition.name) errors.push("Automation name is required.");
  if (!definition.trigger) errors.push("Automation trigger is required.");

  if (!definition.actions.length) {
    errors.push("Automation must include at least one action.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}