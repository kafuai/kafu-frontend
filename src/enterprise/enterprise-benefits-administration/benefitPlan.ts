export interface BenefitPlan {
  id: string;
  name: string;
  category: string;
  provider: string;
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

export function isPlanActive(
  plan: BenefitPlan
): boolean {
  return plan.active;
}
