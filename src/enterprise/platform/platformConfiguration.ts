export type PlatformConfigurationValue =
  | string
  | number
  | boolean
  | null;

export class PlatformConfiguration {
  private readonly values = new Map<string, PlatformConfigurationValue>();

  set(key: string, value: PlatformConfigurationValue): void {
    this.values.set(key, value);
  }

  get<T extends PlatformConfigurationValue>(
    key: string,
  ): T | undefined {
    return this.values.get(key) as T | undefined;
  }

  has(key: string): boolean {
    return this.values.has(key);
  }

  remove(key: string): boolean {
    return this.values.delete(key);
  }

  all(): Record<string, PlatformConfigurationValue> {
    return Object.fromEntries(this.values.entries());
  }
}