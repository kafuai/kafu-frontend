export interface WorkforceDashboard {
  workforceSize: number;
  utilization: number;
  balanceScore: number;
  generatedAt: string;
}

export function createWorkforceDashboard(
  dashboard: WorkforceDashboard
): WorkforceDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
