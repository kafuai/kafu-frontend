import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";

export type IntegrationConnectorCapability =
  | "read"
  | "write"
  | "sync"
  | "webhook"
  | "stream";

export interface IntegrationConnector {
  readonly id: string;
  readonly provider: string;
  readonly capabilities: IntegrationConnectorCapability[];

  canHandle(integration: IntegrationDefinition): boolean;

  connect?(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
  ): Promise<void>;

  disconnect?(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
  ): Promise<void>;

  execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult>;
}