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
    void _integration;
    return true;
  }

  async connect(
    _integration: IntegrationDefinition,
    _context: IntegrationExecutionContext,
  ): Promise<void> {
    void _integration;
    void _context;
  }

  async disconnect(
    _integration: IntegrationDefinition,
    _context: IntegrationExecutionContext,
  ): Promise<void> {
    void _integration;
    void _context;
  }

  abstract execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult>;
}