import { RuntimeToken } from "./runtimeTokens";

export class RuntimeContainer {
  private readonly services = new Map<RuntimeToken<unknown>, unknown>();

  register<T>(token: RuntimeToken<T>, service: T): void {
    this.services.set(token, service);
  }

  resolve<T>(token: RuntimeToken<T>): T | null {
    return (this.services.get(token) as T | undefined) ?? null;
  }

  has(token: RuntimeToken<unknown>): boolean {
    return this.services.has(token);
  }

  count(): number {
    return this.services.size;
  }
}