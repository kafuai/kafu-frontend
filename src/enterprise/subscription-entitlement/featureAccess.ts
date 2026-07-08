import { Entitlement } from "./subscriptionEntitlementTypes";

export class FeatureAccess {
  constructor(private readonly entitlements: Entitlement[]) {}

  getAccess(feature: string): Entitlement | undefined {
    return this.entitlements.find(e => e.feature === feature);
  }
}
