export interface CompensationDashboard {
  employeesCovered: number;
  averageCompensation: number;
  equityScore: number;
  generatedAt: string;
}

export function createCompensationDashboard(
  dashboard: CompensationDashboard
): CompensationDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
