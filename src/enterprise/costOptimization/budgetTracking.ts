import { BudgetPolicy } from "./budgetPolicy";

export type BudgetTrackingSnapshot = {
  policyId: string;
  organizationId: string;
  budgetLimit: number;
  currentSpend: number;
  remainingBudget: number;
  utilization: number;
  warningReached: boolean;
  criticalReached: boolean;
  exceeded: boolean;
  trackedAt: Date;
};

export function trackBudget(
  policy: BudgetPolicy,
  currentSpend: number,
): BudgetTrackingSnapshot {
  const utilization =
    policy.limit === 0 ? 0 : currentSpend / policy.limit;

  return {
    policyId: policy.id,
    organizationId: policy.organizationId,
    budgetLimit: policy.limit,
    currentSpend,
    remainingBudget: Math.max(policy.limit - currentSpend, 0),
    utilization,
    warningReached: utilization >= policy.warningThreshold,
    criticalReached: utilization >= policy.criticalThreshold,
    exceeded: currentSpend > policy.limit,
    trackedAt: new Date(),
  };
}