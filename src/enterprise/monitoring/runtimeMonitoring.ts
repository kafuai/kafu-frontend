import {
  MonitoringCheckResult,
  MonitoringMetric,
  MonitoringSnapshot,
  MonitoringStatus,
  MonitoringTarget,
} from "./monitoringTypes";
import { calculateHealthStatus } from "./healthMonitoring";

export type RuntimeMonitoringInput = {
  runtimeId: string;
  runtimeName: string;
  organizationId?: string;
  environment?: string;
  checks: MonitoringCheckResult[];
  metrics?: MonitoringMetric[];
};

export function createRuntimeMonitoringSnapshot(
  input: RuntimeMonitoringInput,
): MonitoringSnapshot {
  const status: MonitoringStatus = calculateHealthStatus(input.checks);

  return {
    id: `${input.runtimeId}-snapshot-${Date.now()}`,
    status,
    generatedAt: new Date(),
    checks: input.checks,
    metrics: input.metrics ?? [],
  };
}

export function createRuntimeTarget(
  runtimeId: string,
  runtimeName: string,
  organizationId?: string,
  environment?: string,
): MonitoringTarget {
  return {
    id: runtimeId,
    name: runtimeName,
    type: "runtime",
    organizationId,
    environment,
  };
}