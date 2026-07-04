import { EnterpriseServiceContract } from "./enterpriseServiceTypes";

export class SettingsService implements EnterpriseServiceContract {
  readonly name = "settings-service";

  private readonly settings = new Map<string, unknown>();

  set<T>(key: string, value: T): void {
    this.settings.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.settings.get(key) as T | undefined;
  }

  has(key: string): boolean {
    return this.settings.has(key);
  }

  remove(key: string): void {
    this.settings.delete(key);
  }

  clear(): void {
    this.settings.clear();
  }

  healthCheck(): boolean {
    return true;
  }
}