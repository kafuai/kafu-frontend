export interface WorkforceAnalytics {
  totalEmployees: number;
  activeAssignments: number;
  utilizationRate: number;
}

export function calculateWorkforceHealth(
  analytics: WorkforceAnalytics
): number {
  return Math.round(
    analytics.utilizationRate
  );
}
