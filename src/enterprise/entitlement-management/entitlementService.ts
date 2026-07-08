import { EntitlementRecord } from "./entitlement";
import { EntitlementRegistry } from "./entitlementRegistry";

export class EntitlementService {
  constructor(private readonly registry: EntitlementRegistry) {}

  create(entitlement: EntitlementRecord): EntitlementRecord {
    this.registry.register(entitlement);
    return entitlement;
  }

  findById(id: string): EntitlementRecord | undefined {
    return this.registry.get(id);
  }

  list(): EntitlementRecord[] {
    return this.registry.list();
  }
}