import { EnterpriseContext } from "./contextTypes";

export class ContextRegistry {
  private readonly contexts = new Map<string, EnterpriseContext>();

  register(context: EnterpriseContext): void {
    this.contexts.set(context.id, context);
  }

  get(id: string): EnterpriseContext | undefined {
    return this.contexts.get(id);
  }

  getAll(): EnterpriseContext[] {
    return [...this.contexts.values()];
  }

  remove(id: string): boolean {
    return this.contexts.delete(id);
  }

  clear(): void {
    this.contexts.clear();
  }
}