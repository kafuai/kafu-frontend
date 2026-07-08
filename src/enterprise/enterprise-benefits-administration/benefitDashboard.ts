export interface BenefitDashboard {
  activePlans: number;
  coveredEmployees: number;
  utilizationScore: number;
  generatedAt: string;
}

export function createBenefitDashboard(
  dashboard: BenefitDashboard
): BenefitDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
