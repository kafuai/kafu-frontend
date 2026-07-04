import { ConfigurationService } from "./configurationService";
import { EnterpriseServiceContract } from "./enterpriseServiceTypes";
import { EnvironmentService } from "./environmentService";
import { LoggingService } from "./loggingService";
import { SettingsService } from "./settingsService";

export class EnterpriseServicesContainer {
  private readonly services = new Map<string, EnterpriseServiceContract>();

  register(service: EnterpriseServiceContract): void {
    if (this.services.has(service.name)) {
      throw new Error(`Enterprise service already registered: ${service.name}`);
    }

    this.services.set(service.name, service);
  }

  get<T extends EnterpriseServiceContract>(name: string): T | undefined {
    return this.services.get(name) as T | undefined;
  }

  getAll(): EnterpriseServiceContract[] {
    return Array.from(this.services.values());
  }
}

export function createEnterpriseServicesContainer(): EnterpriseServicesContainer {
  const container = new EnterpriseServicesContainer();

  container.register(new ConfigurationService());
  container.register(new EnvironmentService());
  container.register(new LoggingService());
  container.register(new SettingsService());

  return container;
}