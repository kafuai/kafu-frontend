export interface TalentSummary {
  organizationId: string;
  totalTalent: number;
  readinessScore: number;
  recommendations: string[];
}

export function hasTalentRecommendations(
  summary: TalentSummary
): boolean {
  return summary.recommendations.length > 0;
}

export function calculateTalentScale(
  summary: TalentSummary
): number {
  return (
    summary.totalTalent +
    summary.readinessScore
  );
}
