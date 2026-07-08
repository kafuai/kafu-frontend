export interface WorkforceAnalytics {
  totalEmployees: number;
  departments: number;
  utilizationRate: number;
  productivityScore: number;
}

export function calculateWorkforceHealth(
  analytics: WorkforceAnalytics
): number {
  return Math.round(
    analytics.utilizationRate * 0.5 +
    analytics.productivityScore * 0.5
  );
}
