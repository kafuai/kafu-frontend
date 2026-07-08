import { Entitlement } from "./subscriptionEntitlementTypes";

export class EntitlementPolicy {
  constructor(private readonly entitlements: Entitlement[]) {}

  hasFeature(feature: string): boolean {
    return this.entitlements.some(e => e.feature === feature);
  }
}
