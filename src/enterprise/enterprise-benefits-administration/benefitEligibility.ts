export interface BenefitEligibilityRule {
  employeeType: string;
  department?: string;
  eligible: boolean;
}

export function checkBenefitEligibility(
  rule: BenefitEligibilityRule
): boolean {
  return rule.eligible;
}

export function hasDepartmentRestriction(
  rule: BenefitEligibilityRule
): boolean {
  return Boolean(rule.department);
}
