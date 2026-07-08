import { SubscriptionPlanModel } from "./subscriptionEntitlementTypes";

export class LicenseManagement {
  constructor(private readonly plan: SubscriptionPlanModel) {}

  getLicensedUsers(): number {
    return this.plan.users;
  }
}
