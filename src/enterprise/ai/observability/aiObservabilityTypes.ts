export type AIObservabilitySeverity = "info" | "warning" | "critical";

export type AIObservabilitySignalType =
  | "request"
  | "response"
  | "latency"
  | "token_usage"
  | "cost"
  | "error"
  | "quality"
  | "drift"
  | "safety"
  | "governance"
  | "trace";

export type AIObservabilityStatus =
  | "healthy"
  | "degraded"
  | "at_risk"
  | "unhealthy";

export interface AIObservabilityMetadata {
  organizationId: string;
  environment: string;
  serviceName: string;
  modelProvider?: string;
  modelName?: string;
  modelVersion?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
}

export interface AIObservabilitySignal {
  id: string;
  type: AIObservabilitySignalType;
  severity: AIObservabilitySeverity;
  status: AIObservabilityStatus;
  message: string;
  metadata: AIObservabilityMetadata;
  value?: number;
  unit?: string;
  tags: string[];
  createdAt: Date;
}

export interface AIObservabilitySnapshot {
  organizationId: string;
  environment: string;
  serviceName: string;
  status: AIObservabilityStatus;
  totalSignals: number;
  criticalSignals: number;
  warningSignals: number;
  healthySignals: number;
  generatedAt: Date;
}