export interface BenefitPlan {
  name: string;
  category: string;
  active: boolean;
}

export function activateBenefitPlan(
  plan: BenefitPlan
): BenefitPlan {
  return {
    ...plan,
    active: true,
  };
}

export function isBenefitAvailable(
  plan: BenefitPlan
): boolean {
  return plan.active;
}
