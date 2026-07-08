export interface TalentDashboard {
  talentCount: number;
  highPotentialCount: number;
  readinessScore: number;
  generatedAt: string;
}

export function createTalentDashboard(
  dashboard: TalentDashboard
): TalentDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
