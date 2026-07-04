import { IntegrationConnector } from "./integrationConnector";
import { IntegrationDefinition } from "./integrationTypes";

export class IntegrationConnectorRegistry {
  private readonly connectors = new Map<string, IntegrationConnector>();

  register(connector: IntegrationConnector): void {
    this.connectors.set(connector.id, connector);
  }

  get(id: string): IntegrationConnector | undefined {
    return this.connectors.get(id);
  }

  list(): IntegrationConnector[] {
    return Array.from(this.connectors.values());
  }

  findByProvider(provider: string): IntegrationConnector[] {
    return this.list().filter((connector) => connector.provider === provider);
  }

  resolve(
    integration: IntegrationDefinition,
  ): IntegrationConnector | undefined {
    return this.list().find((connector) =>
      connector.canHandle(integration),
    );
  }

  clear(): void {
    this.connectors.clear();
  }
}