import { EntitlementRecord } from "./entitlement";

export class EntitlementRegistry {
  private readonly registry = new Map<string, EntitlementRecord>();

  register(entitlement: EntitlementRecord): void {
    this.registry.set(entitlement.id, entitlement);
  }

  get(id: string): EntitlementRecord | undefined {
    return this.registry.get(id);
  }

  list(): EntitlementRecord[] {
    return [...this.registry.values()];
  }
}