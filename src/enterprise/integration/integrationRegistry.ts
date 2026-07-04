import { IntegrationProvider } from "./integrationProvider";

export class IntegrationRegistry {
  private readonly providers = new Map<string, IntegrationProvider>();

  register(provider: IntegrationProvider): void {
    this.providers.set(provider.provider, provider);
  }

  get(provider: string): IntegrationProvider | undefined {
    return this.providers.get(provider);
  }

  list(): IntegrationProvider[] {
    return Array.from(this.providers.values());
  }

  has(provider: string): boolean {
    return this.providers.has(provider);
  }

  clear(): void {
    this.providers.clear();
  }
}