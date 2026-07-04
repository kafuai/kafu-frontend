import { EnterpriseServiceRegistry } from "./enterpriseServiceRegistry";
import { EnterpriseServiceContract } from "./enterpriseServiceTypes";
import { createEnterpriseServicesContainer } from "./enterpriseServicesContainer";

export class EnterpriseServicesManager {
  private readonly registry = new EnterpriseServiceRegistry();
  private readonly container = createEnterpriseServicesContainer();

  registerServices(): void {
    for (const service of this.container.getAll()) {
      this.registry.register(service);
    }
  }

  initializeServices(): void {
    for (const service of this.container.getAll()) {
      service.initialize?.();
      this.registry.updateStatus(service.name, "ready");
    }
  }

  getServicesRegistry(): EnterpriseServiceRegistry {
    return this.registry;
  }

  getService<T extends EnterpriseServiceContract>(
    name: string,
  ): T | undefined {
    return this.container.get<T>(name);
  }

  async runHealthChecks(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  for (const service of this.container.getAll()) {
    results[service.name] = await Promise.resolve(
      service.healthCheck?.() ?? true,
    );
  }

  return results;
}

}