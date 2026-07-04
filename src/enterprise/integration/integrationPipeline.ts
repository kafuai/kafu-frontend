import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";
import { IntegrationEngine } from "./integrationEngine";

export class IntegrationPipeline {
  constructor(private readonly engine: IntegrationEngine) {}

  async run(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
  ): Promise<IntegrationExecutionResult> {
    return this.engine.execute(integration, context);
  }
}