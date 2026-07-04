import { IntegrationProvider } from "./integrationProvider";
import { IntegrationRegistry } from "./integrationRegistry";

export class IntegrationFactory {
  constructor(private readonly registry: IntegrationRegistry) {}

  create(provider: string): IntegrationProvider {
    const integrationProvider = this.registry.get(provider);

    if (!integrationProvider) {
      throw new Error(
        `Integration provider "${provider}" is not registered.`,
      );
    }

    return integrationProvider;
  }
}