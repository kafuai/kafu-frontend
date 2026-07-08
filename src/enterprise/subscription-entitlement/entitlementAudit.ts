import { Entitlement } from "./subscriptionEntitlementTypes";

export class EntitlementAudit {
  constructor(private readonly entitlements: Entitlement[]) {}

  getAdminEntitlements(): Entitlement[] {
    return this.entitlements.filter((entitlement) => entitlement.access === "admin");
  }
}
