import { RuntimeContainer } from "./runtimeContainer";
import { RuntimeToken } from "./runtimeTokens";

export class RuntimeResolver {
  constructor(private readonly container: RuntimeContainer) {}

  resolve<T>(token: RuntimeToken<T>): T {
    const service = this.container.resolve(token);

    if (!service) {
      throw new Error(`Runtime service not found: ${String(token)}`);
    }

    return service;
  }

  optional<T>(token: RuntimeToken<T>): T | null {
    return this.container.resolve(token);
  }
}