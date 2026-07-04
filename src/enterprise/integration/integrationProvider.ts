import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";
import { IntegrationContract } from "./integrationContract";

export type IntegrationProviderHealth = {
  provider: string;
  healthy: boolean;
  checkedAt: Date;
  message?: string;
};

export interface IntegrationProvider extends IntegrationContract {
  readonly name: string;

  validate?(integration: IntegrationDefinition): string[];

  healthCheck?(
    integration: IntegrationDefinition,
    context?: IntegrationExecutionContext,
  ): Promise<IntegrationProviderHealth>;

  transformInput?(
    integration: IntegrationDefinition,
    payload: unknown,
  ): unknown;

  transformOutput?(
    integration: IntegrationDefinition,
    result: IntegrationExecutionResult,
  ): IntegrationExecutionResult;
}