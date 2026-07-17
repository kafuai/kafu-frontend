export type ExecutionSupervisionStatus =
  | "stable"
  | "attention_required"
  | "intervention_required"
  | "paused"
  | "escalated"
  | "terminated";

export type ExecutionSupervisionSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutionInterventionType =
  | "continue"
  | "adjust"
  | "reassign"
  | "pause"
  | "rollback"
  | "escalate"
  | "terminate";

export type ExecutionSignalType =
  | "performance"
  | "risk"
  | "quality"
  | "dependency"
  | "resource"
  | "compliance"
  | "security"
  | "timeline";

export interface ExecutionSupervisionSignal {
  signalId: string;
  type: ExecutionSignalType;
  title: string;
  description?: string | null;
  severity: ExecutionSupervisionSeverity;
  score: number;
  detectedAt: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface ExecutionSupervisionConstraint {
  constraintId: string;
  title: string;
  description?: string | null;
  blocking: boolean;
  active: boolean;
}

export interface ExecutionSupervisionCheckpoint {
  checkpointId: string;
  title: string;
  expectedProgress: number;
  actualProgress: number;
  completed: boolean;
  overdue: boolean;
}

export interface ExecutionSupervisionPolicy {
  policyId: string;
  title: string;
  mandatory: boolean;
  compliant: boolean;
}

export interface ExecutionSupervisionIntervention {
  interventionType: ExecutionInterventionType;
  reason: string;
  priority: ExecutionSupervisionSeverity;
  requiresExecutiveApproval: boolean;
  recommendedAt: string;
}
