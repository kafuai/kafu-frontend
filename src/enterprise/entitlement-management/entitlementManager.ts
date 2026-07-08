import { EntitlementRecord } from "./entitlement";
import { EntitlementService } from "./entitlementService";

export class EntitlementManager {
  constructor(private readonly service: EntitlementService) {}

  activate(entitlement: EntitlementRecord): EntitlementRecord {
    return {
      ...entitlement,
      status: "active",
    };
  }

  suspend(entitlement: EntitlementRecord): EntitlementRecord {
    return {
      ...entitlement,
      status: "suspended",
    };
  }

  getEntitlement(id: string): EntitlementRecord | undefined {
    return this.service.findById(id);
  }
}