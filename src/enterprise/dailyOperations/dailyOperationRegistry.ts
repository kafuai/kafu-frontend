import type { DailyOperation } from "./dailyOperation";

export class DailyOperationRegistry {
  private readonly operations = new Map<string, DailyOperation>();

  register(operation: DailyOperation): void {
    if (this.operations.has(operation.id)) {
      throw new Error(`Daily operation already registered: ${operation.id}`);
    }

    this.operations.set(operation.id, operation);
  }

  get(operationId: string): DailyOperation | undefined {
    return this.operations.get(operationId);
  }

  has(operationId: string): boolean {
    return this.operations.has(operationId);
  }

  list(): readonly DailyOperation[] {
    return Array.from(this.operations.values());
  }

  listByDomain(domain: string): readonly DailyOperation[] {
    return this.list().filter((operation) => operation.domain === domain);
  }
}