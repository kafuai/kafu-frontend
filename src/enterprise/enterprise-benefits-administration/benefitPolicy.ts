export interface BenefitPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateBenefitPolicy(
  policy: BenefitPolicy
): BenefitPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateBenefitPolicy(
  policy: BenefitPolicy
): boolean {
  return policy.rules.length > 0;
}
