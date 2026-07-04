import {
  MonitoringCheckResult,
  MonitoringMetric,
  MonitoringSnapshot,
} from "./monitoringTypes";
import { MonitoringAlert } from "./monitoringAlertRules";

export type MonitoringEventType =
  | "monitoring.snapshot.created"
  | "monitoring.check.completed"
  | "monitoring.metric.recorded"
  | "monitoring.alert.triggered";

export type MonitoringEvent = {
  id: string;
  type: MonitoringEventType;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

export function createMonitoringSnapshotEvent(
  snapshot: MonitoringSnapshot,
): MonitoringEvent {
  return {
    id: `${snapshot.id}-event`,
    type: "monitoring.snapshot.created",
    occurredAt: new Date(),
    payload: { snapshot },
  };
}

export function createMonitoringCheckEvent(
  check: MonitoringCheckResult,
): MonitoringEvent {
  return {
    id: `${check.id}-event`,
    type: "monitoring.check.completed",
    occurredAt: new Date(),
    payload: { check },
  };
}

export function createMonitoringMetricEvent(
  metric: MonitoringMetric,
): MonitoringEvent {
  return {
    id: `${metric.id}-event`,
    type: "monitoring.metric.recorded",
    occurredAt: new Date(),
    payload: { metric },
  };
}

export function createMonitoringAlertEvent(
  alert: MonitoringAlert,
): MonitoringEvent {
  return {
    id: `${alert.id}-event`,
    type: "monitoring.alert.triggered",
    occurredAt: new Date(),
    payload: { alert },
  };
}