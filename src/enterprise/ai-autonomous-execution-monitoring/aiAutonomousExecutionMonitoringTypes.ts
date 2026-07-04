export type AIExecutionMonitoringSignalType =
  | "progress"
  | "health"
  | "risk"
  | "drift"
  | "sla"
  | "blocker"
  | "coordination";

export type AIExecutionMonitoringSeverity =
  | "info"
  | "warning"
  | "critical";

export type AIExecutionMonitoringStatus =
  | "healthy"
  | "watch"
  | "degraded"
  | "blocked"
  | "failed";

export type AIExecutionMonitoringTrend =
  | "improving"
  | "stable"
  | "declining";

export type AIExecutionMonitoringSlaStatus =
  | "within_sla"
  | "at_risk"
  | "breached";

export interface AIExecutionMonitoringMetric {
  name: string;
  value: number;
  weight?: number;
  target?: number;
  unit?: string;
}

export interface AIExecutionMonitoringWindow {
  startedAt: Date;
  observedAt: Date;
  sourceMilestone?: string;
}

export interface AIExecutionMonitoringContext {
  executionId: string;
  planId?: string;
  coordinationId?: string;
  tenantId?: string;
  createdBy: string;
  window: AIExecutionMonitoringWindow;
}