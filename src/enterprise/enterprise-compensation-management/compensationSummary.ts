export interface CompensationSummary {
  organizationId: string;
  totalCost: number;
  averageValue: number;
  recommendations: string[];
}

export function hasCompensationRecommendations(
  summary: CompensationSummary
): boolean {
  return summary.recommendations.length > 0;
}

export function calculateCostPerEmployee(
  summary: CompensationSummary
): number {
  if (!summary.averageValue) return 0;

  return Math.round(
    summary.totalCost /
      summary.averageValue
  );
}
