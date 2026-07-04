import { PlatformServiceRegistry } from "./platformServiceRegistry";
import { PlatformServiceHealth } from "./platformTypes";

export class PlatformHealth {
  constructor(
    private readonly registry: PlatformServiceRegistry,
  ) {}

  check(): PlatformServiceHealth[] {
    return this.registry.health();
  }

  healthy(): boolean {
    return this.check().every(
      (service) => service.status === "active",
    );
  }
}