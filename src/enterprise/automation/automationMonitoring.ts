import { AutomationExecutionContext } from "./automationExecutionContext";

export type AutomationMonitoringSnapshot = {
  automationId: string;
  organizationId: string;
  status: string;
  collectedAt: Date;
};

export function createAutomationMonitoringSnapshot(
  context: AutomationExecutionContext,
): AutomationMonitoringSnapshot {
  return {
    automationId: context.automationId,
    organizationId: context.organizationId,
    status: context.status,
    collectedAt: new Date(),
  };
}