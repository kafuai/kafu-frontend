import {
  AutomationExecutionContext,
  AutomationExecutionContextStatus,
} from "./automationExecutionContext";

export function updateAutomationExecutionStatus(
  context: AutomationExecutionContext,
  status: AutomationExecutionContextStatus,
): AutomationExecutionContext {
  return {
    ...context,
    status,
    completedAt:
      status === "completed" || status === "failed"
        ? new Date()
        : context.completedAt,
  };
}

export function isAutomationCompleted(
  context: AutomationExecutionContext,
): boolean {
  return (
    context.status === "completed" ||
    context.status === "failed"
  );
}