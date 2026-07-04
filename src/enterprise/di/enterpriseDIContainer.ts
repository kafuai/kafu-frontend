import {
  EnterpriseDIProvider,
  EnterpriseDIToken,
} from "./enterpriseDITypes";

export class EnterpriseDIContainer {
  private readonly providers = new Map<EnterpriseDIToken, EnterpriseDIProvider>();

  register<T>(provider: EnterpriseDIProvider<T>): void {
    this.providers.set(provider.token, provider);
  }

  has(token: EnterpriseDIToken): boolean {
    return this.providers.has(token);
  }

  getProvider<T>(token: EnterpriseDIToken<T>): EnterpriseDIProvider<T> | undefined {
    return this.providers.get(token) as EnterpriseDIProvider<T> | undefined;
  }

  getProviderTokens(): EnterpriseDIToken[] {
    return Array.from(this.providers.keys());
  }
}