import { AutomationTrigger } from "./automationTypes";

export function createManualAutomationTrigger(): AutomationTrigger {
  return {
    type: "manual",
  };
}

export function createScheduledAutomationTrigger(
  schedule: string,
): AutomationTrigger {
  return {
    type: "scheduled",
    schedule,
  };
}

export function createEventAutomationTrigger(
  source: string,
  eventName: string,
): AutomationTrigger {
  return {
    type: "event",
    source,
    eventName,
  };
}

export function createWorkflowAutomationTrigger(
  workflowId: string,
  eventName: string,
): AutomationTrigger {
  return {
    type: "workflow",
    source: workflowId,
    eventName,
  };
}