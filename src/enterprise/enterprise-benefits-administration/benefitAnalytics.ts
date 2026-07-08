export interface BenefitAnalytics {
  totalPlans: number;
  enrolledEmployees: number;
  utilizationRate: number;
}

export function calculateBenefitUtilization(
  analytics: BenefitAnalytics
): number {
  return Math.round(
    analytics.utilizationRate
  );
}

export function hasBenefitAnalyticsData(
  analytics: BenefitAnalytics
): boolean {
  return analytics.totalPlans > 0;
}
