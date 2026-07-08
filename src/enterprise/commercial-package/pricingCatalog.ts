import { PricingPlan } from "./commercialPackageTypes";

export class PricingCatalog {
  constructor(private readonly plans: PricingPlan[]) {}

  getPlans(): PricingPlan[] {
    return this.plans;
  }
}
