import { EnterpriseDIContainer } from "./enterpriseDIContainer";
import {
  EnterpriseDIResolutionResult,
  EnterpriseDIToken,
} from "./enterpriseDITypes";

export class EnterpriseDIResolver {
  private readonly singletons = new Map<EnterpriseDIToken, unknown>();

  constructor(private readonly container: EnterpriseDIContainer) {}

  resolve<T>(token: EnterpriseDIToken<T>): T | undefined {
    const provider = this.container.getProvider<T>(token);

    if (!provider) {
      return undefined;
    }

    if (provider.scope === "singleton") {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, this.createInstance(provider));
      }

      return this.singletons.get(token) as T;
    }

    return this.createInstance(provider);
  }

  resolveWithMetadata<T>(
    token: EnterpriseDIToken<T>,
  ): EnterpriseDIResolutionResult<T> | undefined {
    const provider = this.container.getProvider<T>(token);
    const resolved = this.resolve<T>(token);

    if (!provider || resolved === undefined) {
      return undefined;
    }

    return {
      token,
      resolved,
      scope: provider.scope,
    };
  }

  private createInstance<T>(provider: {
    useValue?: T;
    useFactory?: () => T;
  }): T {
    if (provider.useFactory) {
      return provider.useFactory();
    }

    if (provider.useValue !== undefined) {
      return provider.useValue;
    }

    throw new Error("DI provider must define useValue or useFactory.");
  }
}