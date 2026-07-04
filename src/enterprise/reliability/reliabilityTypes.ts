export type ReliabilitySeverity = "low" | "medium" | "high" | "critical";

export type ReliabilityStatus =
  | "healthy"
  | "degraded"
  | "unstable"
  | "failed"
  | "recovering";

export type ReliabilityRecoveryAction =
  | "retry"
  | "fallback"
  | "restart"
  | "isolate"
  | "escalate"
  | "ignore";

export type ReliabilityTarget = {
  id: string;
  name: string;
  service: string;
  owner?: string;
  criticality: ReliabilitySeverity;
};

export type ReliabilityFailure = {
  id: string;
  targetId: string;
  message: string;
  severity: ReliabilitySeverity;
  detectedAt: Date;
  metadata?: Record<string, unknown>;
};

export type ReliabilityAssessment = {
  targetId: string;
  status: ReliabilityStatus;
  severity: ReliabilitySeverity;
  failures: ReliabilityFailure[];
  assessedAt: Date;
};

export type ReliabilityPolicy = {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  targetService: string;
  maxFailures: number;
  recoveryActions: ReliabilityRecoveryAction[];
  escalationSeverity: ReliabilitySeverity;
};