export type AIExecutionObservabilitySignalType =
  | "execution_metric"
  | "trace_event"
  | "health_signal"
  | "latency_signal"
  | "reliability_signal"
  | "audit_observation";

export type AIExecutionObservabilitySeverity =
  | "info"
  | "notice"
  | "warning"
  | "critical";

export type AIExecutionObservabilitySource =
  | "execution_runtime"
  | "audit_layer"
  | "governance_layer"
  | "compliance_layer"
  | "verification_layer"
  | "external_monitor";

export interface AIExecutionObservabilitySignal {
  id: string;
  type: AIExecutionObservabilitySignalType;
  source: AIExecutionObservabilitySource;
  severity: AIExecutionObservabilitySeverity;
  title: string;
  description: string;
  confidence: number;
  observedAt: string;
  executionId?: string;
  tenantId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AIExecutionObservabilityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  capturedAt: string;
  executionId?: string;
  tenantId?: string;
  tags?: Record<string, string>;
}

export interface AIExecutionObservabilityTrace {
  id: string;
  executionId: string;
  spanName: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  status: "started" | "completed" | "failed";
  attributes?: Record<string, string | number | boolean>;
}