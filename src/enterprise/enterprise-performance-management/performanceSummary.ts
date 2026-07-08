export interface PerformanceSummary {
  organizationId: string;
  totalReviews: number;
  averageScore: number;
  recommendations: string[];
}

export function hasPerformanceRecommendations(
  summary: PerformanceSummary
): boolean {
  return summary.recommendations.length > 0;
}

export function calculatePerformanceScale(
  summary: PerformanceSummary
): number {
  return (
    summary.totalReviews +
    summary.averageScore
  );
}
