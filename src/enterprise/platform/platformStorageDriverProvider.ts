import { PlatformStorageObject } from "./platformStorage";
import { PlatformStorageDriverRegistry } from "./platformStorageDriverRegistry";

export class PlatformStorageDriverProvider {
  constructor(
    private readonly drivers: PlatformStorageDriverRegistry,
    private readonly defaultDriver: string,
  ) {}

  async save(
    object: PlatformStorageObject,
    driverName = this.defaultDriver,
  ): Promise<PlatformStorageObject> {
    const driver = this.drivers.get(driverName);

    if (!driver) {
      throw new Error(`Missing storage driver: ${driverName}`);
    }

    return driver.write(object);
  }

  async load(
    key: string,
    driverName = this.defaultDriver,
  ): Promise<PlatformStorageObject | undefined> {
    const driver = this.drivers.get(driverName);

    if (!driver) {
      throw new Error(`Missing storage driver: ${driverName}`);
    }

    return driver.read(key);
  }
}