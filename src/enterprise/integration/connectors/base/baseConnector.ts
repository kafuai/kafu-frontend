import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "../../integrationTypes";
import { IntegrationConnector } from "../../integrationConnector";

export abstract class BaseConnector implements IntegrationConnector {
  abstract readonly id: string;
  abstract readonly provider: string;
  abstract readonly capabilities: IntegrationConnector["capabilities"];

  canHandle(_integration: IntegrationDefinition): boolean {
    return true;
  }

  async connect(
    _integration: IntegrationDefinition,
    _context: IntegrationExecutionContext,
  ): Promise<void> {}

  async disconnect(
    _integration: IntegrationDefinition,
    _context: IntegrationExecutionContext,
  ): Promise<void> {}

  abstract execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult>;
}