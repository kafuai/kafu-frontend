export interface WorkforcePlan {
  organizationId: string;
  requiredCapacity: number;
  availableCapacity: number;
  period: string;
}

export function calculateCapacityGap(
  plan: WorkforcePlan
): number {
  return Math.max(
    plan.requiredCapacity - plan.availableCapacity,
    0
  );
}

export function hasCapacityGap(
  plan: WorkforcePlan
): boolean {
  return calculateCapacityGap(plan) > 0;
}
