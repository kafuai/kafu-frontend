export interface BenefitClaim {
  employeeId: string;
  benefitId: string;
  amount: number;
  approved: boolean;
}

export function approveBenefitClaim(
  claim: BenefitClaim
): BenefitClaim {
  return {
    ...claim,
    approved: true,
  };
}

export function isClaimApproved(
  claim: BenefitClaim
): boolean {
  return claim.approved;
}
