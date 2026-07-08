export interface HRDashboard {
  employees: number;
  engagementScore: number;
  performanceScore: number;
  generatedAt: string;
}

export function createHRDashboard(
  dashboard: HRDashboard
): HRDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
