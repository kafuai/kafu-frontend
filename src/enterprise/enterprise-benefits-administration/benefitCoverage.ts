export interface BenefitCoverage {
  benefitId: string;
  coveredEmployees: number;
  maximumCoverage: number;
}

export function calculateCoverageRate(
  coverage: BenefitCoverage
): number {
  if (!coverage.maximumCoverage) return 0;

  return Math.round(
    (coverage.coveredEmployees /
      coverage.maximumCoverage) *
      100
  );
}
