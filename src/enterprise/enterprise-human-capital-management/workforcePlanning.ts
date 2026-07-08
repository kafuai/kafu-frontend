export interface WorkforcePlan {
  organizationId: string;
  requiredRoles: string[];
  currentCapacity: number;
  targetCapacity: number;
}

export function calculateWorkforceGap(
  plan: WorkforcePlan
): number {
  return Math.max(
    plan.targetCapacity - plan.currentCapacity,
    0
  );
}

export function hasWorkforceGap(
  plan: WorkforcePlan
): boolean {
  return calculateWorkforceGap(plan) > 0;
}
