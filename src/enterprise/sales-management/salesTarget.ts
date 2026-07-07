import { SalesTarget } from "./salesManagementTypes";

export function createSalesTarget(input: {
  id: string;
  ownerId: string;
  period: string;
  targetAmount?: number;
  achievedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}): SalesTarget {
  const now = new Date().toISOString();

  return {
    id: input.id,
    ownerId: input.ownerId,
    period: input.period,
    targetAmount: Math.max(0, input.targetAmount ?? 0),
    achievedAmount: Math.max(0, input.achievedAmount ?? 0),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function calculateSalesTargetAttainment(target: SalesTarget): number {
  if (target.targetAmount === 0) {
    return 0;
  }

  return Number((target.achievedAmount / target.targetAmount).toFixed(2));
}