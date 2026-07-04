import {
  PlatformConfiguration,
  PlatformConfigurationValue,
} from "./platformConfiguration";
import { PlatformConfigurationSchema } from "./platformConfigurationSchema";

export class PlatformConfigurationProvider {
  constructor(
    private readonly configuration: PlatformConfiguration,
  ) {}

  load(values: Record<string, PlatformConfigurationValue>): void {
    for (const [key, value] of Object.entries(values)) {
      this.configuration.set(key, value);
    }
  }

  applySchema(schema: PlatformConfigurationSchema): void {
    for (const field of schema.fields) {
      if (!this.configuration.has(field.key) && field.defaultValue !== undefined) {
        this.configuration.set(field.key, field.defaultValue);
      }
    }
  }

  value<T extends PlatformConfigurationValue>(
    key: string,
  ): T | undefined {
    return this.configuration.get<T>(key);
  }

  snapshot() {
    return this.configuration.all();
  }
}