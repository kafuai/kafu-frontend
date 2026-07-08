import { SubscriptionPlanModel } from "./subscriptionEntitlementTypes";

export class SubscriptionPlan {
  constructor(private readonly plan: SubscriptionPlanModel) {}

  getPlan(): SubscriptionPlanModel {
    return this.plan;
  }
}
