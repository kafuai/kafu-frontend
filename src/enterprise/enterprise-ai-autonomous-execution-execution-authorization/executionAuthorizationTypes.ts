export type ExecutionAuthorizationStatus =
  | "pending"
  | "authorized"
  | "conditionally_authorized"
  | "denied"
  | "suspended"
  | "expired"
  | "escalated";

export type ExecutionAuthorizationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutionAuthorizationRiskLevel =
  | "minimal"
  | "moderate"
  | "significant"
  | "severe";

export type ExecutionAuthorizationScope =
  | "task"
  | "workflow"
  | "initiative"
  | "program"
  | "portfolio"
  | "enterprise";

export interface ExecutionAuthorizationCondition {
  conditionId: string;
  title: string;
  description?: string | null;
  satisfied: boolean;
  blocking: boolean;
}

export interface ExecutionAuthorizationControl {
  controlId: string;
  title: string;
  category: string;
  required: boolean;
  passed: boolean;
  evidenceIds: string[];
}

export interface ExecutionAuthorizationDependency {
  dependencyId: string;
  title: string;
  resolved: boolean;
  blocking: boolean;
}

export interface ExecutionAuthorizationWindow {
  startsAt: string;
  expiresAt?: string | null;
  timezone?: string | null;
}
