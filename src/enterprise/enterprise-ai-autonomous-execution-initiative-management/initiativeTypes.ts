export type InitiativeLifecycleState =
  | "draft"
  | "proposed"
  | "approved"
  | "ready"
  | "active"
  | "at_risk"
  | "blocked"
  | "completed"
  | "cancelled";

export type InitiativePriorityLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type InitiativeImpactLevel =
  | "limited"
  | "moderate"
  | "significant"
  | "transformational";

export type InitiativeRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface EnterpriseInitiativeOwner {
  ownerId: string;
  ownerName: string;
  role: string;
  accountabilityScope: string;
}

export interface EnterpriseInitiativeDependency {
  dependencyId: string;
  name: string;
  type: "program" | "portfolio" | "team" | "system" | "vendor" | "data" | "policy";
  requiredState: string;
  isBlocking: boolean;
}

export interface EnterpriseInitiativeMetric {
  metricId: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  weight: number;
}

export interface EnterpriseInitiativeRisk {
  riskId: string;
  description: string;
  level: InitiativeRiskLevel;
  mitigation: string;
  ownerId: string;
}

export interface EnterpriseInitiative {
  initiativeId: string;
  name: string;
  description: string;
  strategicObjectiveId: string;
  programId?: string;
  portfolioId?: string;
  owner: EnterpriseInitiativeOwner;
  lifecycleState: InitiativeLifecycleState;
  priority: InitiativePriorityLevel;
  impact: InitiativeImpactLevel;
  dependencies: EnterpriseInitiativeDependency[];
  metrics: EnterpriseInitiativeMetric[];
  risks: EnterpriseInitiativeRisk[];
  createdAt: string;
  updatedAt: string;
}