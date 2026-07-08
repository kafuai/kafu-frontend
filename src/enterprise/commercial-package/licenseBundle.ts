import { PricingPlan } from "./commercialPackageTypes";

export class LicenseBundle {
  constructor(private readonly plans: PricingPlan[]) {}

  getEnterprisePlans(): PricingPlan[] {
    return this.plans.filter(plan => plan.tier === "enterprise");
  }
}
