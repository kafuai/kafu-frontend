import { SubscriptionPlanModel } from "./subscriptionEntitlementTypes";

export class SubscriptionLifecycle {
  constructor(private readonly plan: SubscriptionPlanModel) {}

  isActive(): boolean {
    return this.plan.status === "active";
  }
}
