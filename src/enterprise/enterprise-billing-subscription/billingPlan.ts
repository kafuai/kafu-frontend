import { BillingPlan } from "./billingSubscriptionTypes";

export function createBillingPlan(plan: BillingPlan): BillingPlan {
  return {
    ...plan,
    basePrice: normalizeAmount(plan.basePrice),
    overageUnitPrice: normalizeAmount(plan.overageUnitPrice),
    includedUsageUnits: Math.max(0, plan.includedUsageUnits),
    features: Array.from(new Set(plan.features)),
  };
}

export function isBillingPlanActive(plan: BillingPlan): boolean {
  return plan.status === "active";
}

export function retireBillingPlan(plan: BillingPlan, updatedAt: string): BillingPlan {
  return {
    ...plan,
    status: "retired",
    updatedAt,
  };
}

function normalizeAmount(amount: number): number {
  return Math.max(0, Number(amount.toFixed(2)));
}