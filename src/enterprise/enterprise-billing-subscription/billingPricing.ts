import { BillingPlan } from "./billingSubscriptionTypes";

export function calculateBillingBaseAmount(plan: BillingPlan): number {
  return normalizeAmount(plan.basePrice);
}

export function calculateBillingOverageAmount(
  plan: BillingPlan,
  usedUnits: number,
): number {
  const billableUnits = Math.max(0, usedUnits - plan.includedUsageUnits);
  return normalizeAmount(billableUnits * plan.overageUnitPrice);
}

export function calculateBillingPeriodAmount(
  plan: BillingPlan,
  usedUnits: number,
): number {
  return normalizeAmount(
    calculateBillingBaseAmount(plan) + calculateBillingOverageAmount(plan, usedUnits),
  );
}

function normalizeAmount(amount: number): number {
  return Math.max(0, Number(amount.toFixed(2)));
}