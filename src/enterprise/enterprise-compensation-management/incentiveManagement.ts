export interface IncentivePlan {
  name: string;
  target: string;
  percentage: number;
  active: boolean;
}

export function isValidIncentivePlan(
  plan: IncentivePlan
): boolean {
  return (
    plan.percentage >= 0 &&
    plan.percentage <= 100
  );
}

export function activateIncentivePlan(
  plan: IncentivePlan
): IncentivePlan {
  return {
    ...plan,
    active: true,
  };
}
