export type ResilienceSeverity = "low" | "medium" | "high" | "critical";

export type ResilienceStatus =
  | "healthy"
  | "degraded"
  | "recovering"
  | "failed";

export type ResiliencePolicyType =
  | "retry"
  | "backoff"
  | "failover"
  | "self-healing"
  | "chaos";

export type BackoffStrategy = "fixed" | "linear" | "exponential";

export type ResiliencePolicy = {
  id: string;
  organizationId: string;
  name: string;
  type: ResiliencePolicyType;
  enabled: boolean;
  severity: ResilienceSeverity;
  maxAttempts?: number;
  timeoutMs?: number;
  backoffStrategy?: BackoffStrategy;
  baseDelayMs?: number;
  maxDelayMs?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ResilienceExecutionContext = {
  organizationId: string;
  operationId: string;
  operationName: string;
  attempt: number;
  metadata?: Record<string, unknown>;
};

export type ResilienceExecutionResult<T = unknown> = {
  success: boolean;
  status: ResilienceStatus;
  attempts: number;
  result?: T;
  error?: Error;
  recovered: boolean;
};