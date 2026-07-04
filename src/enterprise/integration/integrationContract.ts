import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";

export interface IntegrationContract {
  readonly provider: string;

  supports(integration: IntegrationDefinition): boolean;

  execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
  ): Promise<IntegrationExecutionResult>;
}