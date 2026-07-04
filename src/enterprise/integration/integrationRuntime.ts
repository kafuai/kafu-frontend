import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "./integrationTypes";
import { IntegrationConnectorRegistry } from "./integrationConnectorRegistry";

export class IntegrationRuntime {
  constructor(private readonly connectors: IntegrationConnectorRegistry) {}

  async execute(
    integration: IntegrationDefinition,
    context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult> {
    const connector = this.connectors.resolve(integration);

    if (!connector) {
      return {
        integrationId: integration.id,
        success: false,
        status: "failed",
        message: "No connector found for integration.",
        executedAt: new Date(),
      };
    }

    return connector.execute(integration, context, payload);
  }
}