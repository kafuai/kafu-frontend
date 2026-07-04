import { AutomationExecutionContext } from "./automationExecutionContext";
import { updateAutomationExecutionStatus } from "./automationLifecycle";

export type AutomationFailureResult = {
  context: AutomationExecutionContext;
  error: string;
  failedAt: Date;
};

export function handleAutomationFailure(
  context: AutomationExecutionContext,
  error: string,
): AutomationFailureResult {
  return {
    context: updateAutomationExecutionStatus(context, "failed"),
    error,
    failedAt: new Date(),
  };
}