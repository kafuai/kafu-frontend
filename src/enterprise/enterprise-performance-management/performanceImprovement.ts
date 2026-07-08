export interface PerformanceImprovementPlan {
  employeeId: string;
  issues: string[];
  actions: string[];
  active: boolean;
}

export function activateImprovementPlan(
  plan: PerformanceImprovementPlan
): PerformanceImprovementPlan {
  return {
    ...plan,
    active: true,
  };
}

export function requiresImprovement(
  plan: PerformanceImprovementPlan
): boolean {
  return plan.issues.length > 0;
}
