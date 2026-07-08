import { Entitlement } from "./subscriptionEntitlementTypes";

export class UsageTracking {
  constructor(private readonly entitlements: Entitlement[]) {}

  getTrackedFeatures(): string[] {
    return this.entitlements.map((entitlement) => entitlement.feature);
  }
}
