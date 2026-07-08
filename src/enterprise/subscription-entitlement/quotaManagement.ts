import { SubscriptionPlanModel } from "./subscriptionEntitlementTypes";

export class QuotaManagement {
  constructor(private readonly plan: SubscriptionPlanModel) {}

  getUserQuota(): number {
    return this.plan.users;
  }
}
