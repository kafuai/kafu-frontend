export type EnterprisePlanningHorizon =
  | "immediate"
  | "short_term"
  | "mid_term"
  | "long_term"
  | "strategic";

export type EnterprisePlanningPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EnterprisePlanningStatus =
  | "draft"
  | "evaluating"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "blocked";

export interface EnterprisePlanningGoal {
  id: string;
  title: string;
  description: string;
  priority: EnterprisePlanningPriority;
  horizon: EnterprisePlanningHorizon;
  expectedOutcome: string;
}

export interface EnterprisePlanningConstraint {
  id: string;
  name: string;
  description: string;
  severity: EnterprisePlanningPriority;
  isBlocking: boolean;
}

export interface EnterprisePlanningResource {
  id: string;
  name: string;
  type: "human" | "financial" | "technical" | "operational" | "knowledge";
  availabilityScore: number;
  required: boolean;
}

export interface EnterprisePlanningRisk {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface EnterprisePlanningStep {
  id: string;
  title: string;
  description: string;
  sequence: number;
  ownerId?: string;
  dependencies: string[];
  requiredResources: string[];
  expectedOutcome: string;
}

export interface EnterpriseAIPlan {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: EnterprisePlanningStatus;
  goals: EnterprisePlanningGoal[];
  constraints: EnterprisePlanningConstraint[];
  resources: EnterprisePlanningResource[];
  risks: EnterprisePlanningRisk[];
  steps: EnterprisePlanningStep[];
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}