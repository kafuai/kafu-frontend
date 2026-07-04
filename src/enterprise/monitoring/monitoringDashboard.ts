import {
  MonitoringCheckResult,
  MonitoringMetric,
  MonitoringSnapshot,
  MonitoringStatus,
} from "./monitoringTypes";
import {
  AvailabilitySummary,
  calculateAvailability,
} from "./availabilityMonitoring";

export type MonitoringDashboardModel = {
  snapshotId: string;
  status: MonitoringStatus;
  generatedAt: Date;
  totalChecks: number;
  totalMetrics: number;
  availability: AvailabilitySummary;
  criticalChecks: MonitoringCheckResult[];
  recentMetrics: MonitoringMetric[];
};

export function createMonitoringDashboardModel(
  snapshot: MonitoringSnapshot,
): MonitoringDashboardModel {
  return {
    snapshotId: snapshot.id,
    status: snapshot.status,
    generatedAt: snapshot.generatedAt,
    totalChecks: snapshot.checks.length,
    totalMetrics: snapshot.metrics.length,
    availability: calculateAvailability(snapshot.checks),
    criticalChecks: snapshot.checks.filter(
      (check) =>
        check.severity === "critical" ||
        check.status === "unhealthy" ||
        check.status === "offline",
    ),
    recentMetrics: snapshot.metrics.slice(-20),
  };
}