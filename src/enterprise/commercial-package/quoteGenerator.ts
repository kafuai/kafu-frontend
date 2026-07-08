import { PricingPlan } from "./commercialPackageTypes";

export class QuoteGenerator {
  constructor(private readonly plans: PricingPlan[]) {}

  calculateMonthlyTotal(): number {
    return this.plans.reduce((sum, plan) => sum + plan.monthlyPrice, 0);
  }
}
