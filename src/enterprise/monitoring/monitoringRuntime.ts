import {
  MonitoringCheckResult,
  MonitoringMetric,
  MonitoringSnapshot,
} from "./monitoringTypes";
import {
  MonitoringAlert,
  MonitoringAlertRule,
  evaluateMonitoringAlertRules,
} from "./monitoringAlertRules";
import { createMonitoringDashboardModel } from "./monitoringDashboard";
import { createRuntimeMonitoringSnapshot } from "./runtimeMonitoring";

export type MonitoringRuntimeInput = {
  runtimeId: string;
  runtimeName: string;
  organizationId?: string;
  environment?: string;
  checks: MonitoringCheckResult[];
  metrics?: MonitoringMetric[];
  alertRules?: MonitoringAlertRule[];
};

export type MonitoringRuntimeResult = {
  snapshot: MonitoringSnapshot;
  alerts: MonitoringAlert[];
  dashboard: ReturnType<typeof createMonitoringDashboardModel>;
};

export function runMonitoringRuntime(
  input: MonitoringRuntimeInput,
): MonitoringRuntimeResult {
  const snapshot = createRuntimeMonitoringSnapshot({
    runtimeId: input.runtimeId,
    runtimeName: input.runtimeName,
    organizationId: input.organizationId,
    environment: input.environment,
    checks: input.checks,
    metrics: input.metrics,
  });

  const alerts = evaluateMonitoringAlertRules(
    input.alertRules ?? [],
    snapshot.checks,
    snapshot.metrics,
  );

  const dashboard = createMonitoringDashboardModel(snapshot);

  return {
    snapshot,
    alerts,
    dashboard,
  };
}