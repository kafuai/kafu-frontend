export interface EmployeeLifecycleDashboard {
  totalEmployees: number;
  activeEmployees: number;
  engagementScore: number;
  generatedAt: string;
}

export function createEmployeeDashboard(
  dashboard: EmployeeLifecycleDashboard
): EmployeeLifecycleDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
