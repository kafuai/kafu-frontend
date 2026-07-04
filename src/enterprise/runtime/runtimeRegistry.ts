import { RuntimeService } from "./enterpriseRuntimeTypes";

export class RuntimeRegistry {
  private readonly services: RuntimeService[] = [];

  register(service: RuntimeService): void {
    this.services.push(service);
  }

  getAll(): RuntimeService[] {
    return [...this.services];
  }

  count(): number {
    return this.services.length;
  }
}