import { AutomationAction, AutomationActionType } from "./automationTypes";

export function createAutomationAction(
  type: AutomationActionType,
  target: string,
  payload?: Record<string, unknown>,
): AutomationAction {
  return {
    type,
    target,
    payload,
  };
}

export function isWorkflowAutomationAction(
  action: AutomationAction,
): boolean {
  return action.type === "workflow";
}

export function isIntegrationAutomationAction(
  action: AutomationAction,
): boolean {
  return action.type === "integration";
}

export function isDecisionAutomationAction(
  action: AutomationAction,
): boolean {
  return action.type === "decision";
}