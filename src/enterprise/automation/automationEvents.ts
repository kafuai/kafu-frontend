import { AutomationExecutionContextStatus } from "./automationExecutionContext";

export type AutomationEventType =
  | "automation.initialized"
  | "automation.started"
  | "automation.completed"
  | "automation.failed";

export type AutomationEvent = {
  id: string;
  automationId: string;
  organizationId: string;
  type: AutomationEventType;
  status: AutomationExecutionContextStatus;
  occurredAt: Date;
  message?: string;
  metadata?: Record<string, unknown>;
};

export function createAutomationEvent(input: {
  automationId: string;
  organizationId: string;
  type: AutomationEventType;
  status: AutomationExecutionContextStatus;
  message?: string;
  metadata?: Record<string, unknown>;
}): AutomationEvent {
  return {
    id: `${input.automationId}:${input.type}:${Date.now()}`,
    automationId: input.automationId,
    organizationId: input.organizationId,
    type: input.type,
    status: input.status,
    occurredAt: new Date(),
    message: input.message,
    metadata: input.metadata,
  };
}