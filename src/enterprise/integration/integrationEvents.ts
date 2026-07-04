import { IntegrationExecutionResult } from "./integrationTypes";

export type IntegrationEventType =
  | "integration.registered"
  | "integration.executed"
  | "integration.failed"
  | "integration.disabled";

export type IntegrationEvent = {
  id: string;
  integrationId: string;
  type: IntegrationEventType;
  occurredAt: Date;
  result?: IntegrationExecutionResult;
  metadata?: Record<string, unknown>;
};