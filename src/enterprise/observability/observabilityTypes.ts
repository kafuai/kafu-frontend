export type ObservabilitySeverity =
  | "debug"
  | "info"
  | "warning"
  | "error"
  | "critical";

export type ObservabilitySignalType =
  | "log"
  | "metric"
  | "trace"
  | "health"
  | "diagnostic"
  | "alert"
  | "telemetry";

export type ObservabilityStatus =
  | "healthy"
  | "degraded"
  | "unhealthy";

export type ObservabilityContext = {
  organizationId: string;
  service: string;
  environment: string;
  correlationId?: string;
  traceId?: string;
  userId?: string;
};

export type ObservabilityLogEntry = {
  id: string;
  timestamp: Date;
  severity: ObservabilitySeverity;
  message: string;
  context: ObservabilityContext;
  metadata?: Record<string, unknown>;
};

export type ObservabilityMetric = {
  id: string;
  timestamp: Date;
  name: string;
  value: number;
  unit?: string;
  context: ObservabilityContext;
  tags?: Record<string, string>;
};

export type ObservabilityTraceSpan = {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  startedAt: Date;
  endedAt?: Date;
  context: ObservabilityContext;
  metadata?: Record<string, unknown>;
};

export type ObservabilityHealthCheck = {
  id: string;
  name: string;
  status: ObservabilityStatus;
  checkedAt: Date;
  details?: Record<string, unknown>;
};

export type ObservabilityDiagnosticReport = {
  id: string;
  generatedAt: Date;
  status: ObservabilityStatus;
  summary: string;
  findings: string[];
};

export type ObservabilityAlert = {
  id: string;
  timestamp: Date;
  severity: ObservabilitySeverity;
  title: string;
  message: string;
  context: ObservabilityContext;
  resolved: boolean;
};

export type ObservabilityTelemetryEvent = {
  id: string;
  timestamp: Date;
  type: string;
  context: ObservabilityContext;
  payload?: Record<string, unknown>;
};