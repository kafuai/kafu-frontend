import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";
import { IntegrationRuntime } from "./integrationRuntime";

export class IntegrationEngine {
  constructor(private readonly runtime: IntegrationRuntime) {}

  execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult> {
    return this.runtime.execute(integration, context, payload);
  }
}