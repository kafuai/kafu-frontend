export interface CompensationPlan {
  organizationId: string;
  budget: number;
  allocated: number;
  period: string;
}

export function calculateRemainingBudget(
  plan: CompensationPlan
): number {
  return Math.max(
    plan.budget - plan.allocated,
    0
  );
}

export function isBudgetExceeded(
  plan: CompensationPlan
): boolean {
  return plan.allocated > plan.budget;
}
