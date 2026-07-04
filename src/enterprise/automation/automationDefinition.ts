import {
  AutomationAction,
  AutomationCondition,
  AutomationDefinition,
  AutomationStatus,
  AutomationTrigger,
} from "./automationTypes";

export type CreateAutomationDefinitionInput = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status?: AutomationStatus;
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
};

export function createAutomationDefinition(
  input: CreateAutomationDefinitionInput,
): AutomationDefinition {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    status: input.status ?? "draft",
    trigger: input.trigger,
    conditions: input.conditions ?? [],
    actions: input.actions ?? [],
    createdAt: now,
    updatedAt: now,
  };
}