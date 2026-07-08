export type ExecutivePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveDecisionStatus =
  | "draft"
  | "pending"
  | "approved"
  | "executing"
  | "completed";

export interface ExecutiveMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
}

export interface ExecutiveAlert {
  id: string;
  title: string;
  priority: ExecutivePriority;
  createdAt: Date;
}

export interface ExecutiveAction {
  id: string;
  title: string;
  owner: string;
  status: ExecutiveDecisionStatus;
}

export interface ExecutiveGoal {
  id: string;
  title: string;
  progress: number;
}

export interface ExecutiveWorkspaceModel {
  id: string;
  executive: string;
  metrics: ExecutiveMetric[];
  alerts: ExecutiveAlert[];
  actions: ExecutiveAction[];
  goals: ExecutiveGoal[];
}
