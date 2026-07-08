export interface TalentAnalytics {
  totalTalent: number;
  highPotentialCount: number;
  readinessRate: number;
}

export function calculateTalentHealth(
  analytics: TalentAnalytics
): number {
  return Math.round(
    analytics.readinessRate
  );
}

export function hasTalentAnalyticsData(
  analytics: TalentAnalytics
): boolean {
  return analytics.totalTalent > 0;
}
