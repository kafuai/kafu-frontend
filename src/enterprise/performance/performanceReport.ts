import { PerformanceDashboard } from "./performanceDashboard";

export type PerformanceReport = {
  id: string;
  organizationId: string;
  dashboard: PerformanceDashboard;
  createdAt: Date;
};

export function createPerformanceReport(
  id: string,
  organizationId: string,
  dashboard: PerformanceDashboard,
): PerformanceReport {
  return {
    id,
    organizationId,
    dashboard,
    createdAt: new Date(),
  };
}