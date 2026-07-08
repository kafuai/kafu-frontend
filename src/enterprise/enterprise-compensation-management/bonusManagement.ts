export interface BonusPlan {
  employeeId: string;
  targetAmount: number;
  achievedAmount: number;
  approved: boolean;
}

export function calculateBonusAchievement(
  plan: BonusPlan
): number {
  if (!plan.targetAmount) return 0;

  return Math.round(
    (plan.achievedAmount / plan.targetAmount) * 100
  );
}

export function canPayBonus(
  plan: BonusPlan
): boolean {
  return plan.approved;
}
