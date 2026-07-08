export interface BenefitSummary {
  organizationId: string;
  totalPlans: number;
  totalCost: number;
  recommendations: string[];
}

export function hasBenefitRecommendations(
  summary: BenefitSummary
): boolean {
  return summary.recommendations.length > 0;
}

export function calculateAverageBenefitCost(
  summary: BenefitSummary
): number {
  if (!summary.totalPlans) return 0;

  return Math.round(
    summary.totalCost / summary.totalPlans
  );
}
