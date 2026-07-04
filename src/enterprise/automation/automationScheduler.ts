import { AutomationDefinition } from "./automationTypes";
import { AutomationSchedule } from "./automationSchedule";
import {
  AutomationQueueItem,
  createAutomationQueueItem,
} from "./automationQueue";

export function scheduleAutomation(input: {
  automation: AutomationDefinition;
  schedule: AutomationSchedule;
}): AutomationQueueItem {
  return createAutomationQueueItem(input);
}