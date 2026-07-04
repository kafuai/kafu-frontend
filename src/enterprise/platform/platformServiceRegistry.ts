import {
  PlatformCapability,
  PlatformServiceHealth,
  PlatformServiceStatus,
} from "./platformTypes";

export type PlatformServiceRegistration = {
  capability: PlatformCapability;
  name: string;
  version: string;
  status: PlatformServiceStatus;
};

export class PlatformServiceRegistry {
  private readonly services = new Map<
    PlatformCapability,
    PlatformServiceRegistration
  >();

  register(service: PlatformServiceRegistration): void {
    this.services.set(service.capability, service);
  }

  get(capability: PlatformCapability): PlatformServiceRegistration | undefined {
    return this.services.get(capability);
  }

  list(): PlatformServiceRegistration[] {
    return [...this.services.values()];
  }

  health(): PlatformServiceHealth[] {
    const now = new Date();

    return this.list().map((service) => ({
      capability: service.capability,
      status: service.status,
      message: `${service.name}@${service.version}`,
      checkedAt: now,
    }));
  }
}