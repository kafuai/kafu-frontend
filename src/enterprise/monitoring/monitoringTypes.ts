export type MonitoringStatus =
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "offline"
  | "unknown";

export type MonitoringSeverity =
  | "info"
  | "warning"
  | "critical";

export type MonitoringTargetType =
  | "service"
  | "runtime"
  | "resource"
  | "job"
  | "queue"
  | "integration"
  | "database"
  | "api"
  | "custom";

export type MonitoringTarget = {
  id: string;
  name: string;
  type: MonitoringTargetType;
  organizationId?: string;
  environment?: string;
  tags?: string[];
};

export type MonitoringCheckResult = {
  id: string;
  target: MonitoringTarget;
  status: MonitoringStatus;
  severity: MonitoringSeverity;
  message: string;
  checkedAt: Date;
  metadata?: Record<string, unknown>;
};

export type MonitoringMetric = {
  id: string;
  targetId: string;
  name: string;
  value: number;
  unit: string;
  recordedAt: Date;
  metadata?: Record<string, unknown>;
};

export type MonitoringSnapshot = {
  id: string;
  status: MonitoringStatus;
  generatedAt: Date;
  checks: MonitoringCheckResult[];
  metrics: MonitoringMetric[];
};