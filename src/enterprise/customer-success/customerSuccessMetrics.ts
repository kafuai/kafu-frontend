export interface CustomerSuccessMetrics {
  accountId: string;
  healthScore: number;
  adoptionScore: number;
  engagementScore: number;
  churnProbability: number;
  renewalProbability: number;
}

export function calculateCustomerSuccessScore(
  metrics: CustomerSuccessMetrics,
): number {
  return Math.round(
    metrics.healthScore * 0.3 +
      metrics.adoptionScore * 0.25 +
      metrics.engagementScore * 0.2 +
      (1 - metrics.churnProbability) * 100 * 0.15 +
      metrics.renewalProbability * 100 * 0.1,
  );
}