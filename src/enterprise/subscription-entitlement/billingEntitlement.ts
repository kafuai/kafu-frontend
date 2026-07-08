import { SubscriptionPlanModel } from "./subscriptionEntitlementTypes";

export class BillingEntitlement {
  constructor(private readonly plan: SubscriptionPlanModel) {}

  getBillingStatus(): string {
    return `${this.plan.name}:${this.plan.status}`;
  }
}
