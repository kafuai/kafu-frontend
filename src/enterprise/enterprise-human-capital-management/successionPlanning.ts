export interface SuccessionPlan {
  role: string;
  candidates: string[];
  readinessLevel: number;
}

export function hasSuccessionCoverage(
  plan: SuccessionPlan
): boolean {
  return plan.candidates.length > 0;
}

export function isSuccessionReady(
  plan: SuccessionPlan
): boolean {
  return plan.readinessLevel >= 80;
}
