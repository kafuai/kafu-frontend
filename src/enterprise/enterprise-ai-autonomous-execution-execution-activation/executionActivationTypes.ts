export type ExecutionActivationStatus =
  | "pending"
  | "ready"
  | "activated"
  | "conditionally_activated"
  | "blocked"
  | "suspended"
  | "failed";

export type ExecutionActivationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutionActivationMode =
  | "immediate"
  | "scheduled"
  | "phased"
  | "manual"
  | "event_driven";

export type ExecutionActivationScope =
  | "task"
  | "workflow"
  | "initiative"
  | "program"
  | "portfolio"
  | "enterprise";

export interface ExecutionActivationGate {
  gateId: string;
  title: string;
  description?: string | null;
  required: boolean;
  passed: boolean;
}

export interface ExecutionActivationDependency {
  dependencyId: string;
  title: string;
  resolved: boolean;
  blocking: boolean;
}

export interface ExecutionActivationCheckpoint {
  checkpointId: string;
  title: string;
  sequence: number;
  completed: boolean;
  mandatory: boolean;
}

export interface ExecutionActivationWindow {
  startsAt: string;
  endsAt?: string | null;
  timezone?: string | null;
}
