export type AIExecutionCoordinationStatus =
  | "ready"
  | "waiting"
  | "blocked"
  | "conflicted"
  | "coordinated"
  | "skipped";

export type AIExecutionCoordinationPriority = "low" | "medium" | "high" | "critical";

export type AIExecutionCoordinationDependencyState =
  | "satisfied"
  | "waiting"
  | "blocked"
  | "missing";

export type AIExecutionCoordinationConflictSeverity =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionCoordinationConflictType =
  | "dependency"
  | "resource"
  | "timing"
  | "ownership"
  | "policy"
  | "capacity";

export interface AIExecutionCoordinationAuditMetadata {
  createdBy: string;
  createdAt: Date;
  sourceMilestone?: string;
  correlationId?: string;
}

export interface AIExecutionCoordinationReadiness {
  isReady: boolean;
  score: number;
  reasons: string[];
}