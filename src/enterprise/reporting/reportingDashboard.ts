export interface ReportingDashboard {
  id: string;
  name: string;
  reportIds: string[];
  widgets: string[];
}

export function createReportingDashboard(
  dashboard: ReportingDashboard,
): ReportingDashboard {
  return dashboard;
}
