import { AutomationDefinition } from "./automationTypes";
import { AutomationSchedule } from "./automationSchedule";

export type AutomationQueueItem = {
  id: string;
  automation: AutomationDefinition;
  schedule: AutomationSchedule;
  queuedAt: Date;
};

export function createAutomationQueueItem(input: {
  automation: AutomationDefinition;
  schedule: AutomationSchedule;
}): AutomationQueueItem {
  return {
    id: `${input.automation.id}:${Date.now()}`,
    automation: input.automation,
    schedule: input.schedule,
    queuedAt: new Date(),
  };
}