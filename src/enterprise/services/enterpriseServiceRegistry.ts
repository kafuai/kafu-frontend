import {
  EnterpriseServiceContract,
  EnterpriseServiceDefinition,
  EnterpriseServiceStatus,
} from "./enterpriseServiceTypes";

export class EnterpriseServiceRegistry {
  private readonly services = new Map<string, EnterpriseServiceDefinition>();

  register(service: EnterpriseServiceContract): void {
    if (this.services.has(service.name)) {
      throw new Error(`Enterprise service already registered: ${service.name}`);
    }

    this.services.set(service.name, {
      name: service.name,
      status: "idle",
    });
  }

  updateStatus(name: string, status: EnterpriseServiceStatus): void {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Enterprise service not found: ${name}`);
    }

    this.services.set(name, {
      ...service,
      status,
    });
  }

  getService(name: string): EnterpriseServiceDefinition | undefined {
    return this.services.get(name);
  }

  getServices(): EnterpriseServiceDefinition[] {
    return Array.from(this.services.values());
  }
}