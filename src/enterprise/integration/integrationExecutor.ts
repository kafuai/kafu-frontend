import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";
import { IntegrationPipeline } from "./integrationPipeline";

export class IntegrationExecutor {
  constructor(private readonly pipeline: IntegrationPipeline) {}

  async execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
  ): Promise<IntegrationExecutionResult> {
    return this.pipeline.run(integration, context);
  }
}