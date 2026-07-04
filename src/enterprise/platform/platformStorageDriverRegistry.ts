import { PlatformStorageDriver } from "./platformStorageDriver";

export class PlatformStorageDriverRegistry {
  private readonly drivers = new Map<string, PlatformStorageDriver>();

  register(driver: PlatformStorageDriver): void {
    this.drivers.set(driver.name, driver);
  }

  get(name: string): PlatformStorageDriver | undefined {
    return this.drivers.get(name);
  }

  list(): PlatformStorageDriver[] {
    return [...this.drivers.values()];
  }
}