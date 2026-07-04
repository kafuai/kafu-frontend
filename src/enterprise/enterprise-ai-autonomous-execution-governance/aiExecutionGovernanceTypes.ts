export type AIExecutionGovernanceAuthority =
  | "system"
  | "tenant"
  | "organization"
  | "administrator"
  | "human_reviewer";

export type AIExecutionGovernanceDecision =
  | "approved"
  | "conditionally_approved"
  | "rejected"
  | "requires_review";

export type AIExecutionGovernanceRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AIExecutionGovernancePolicy {
  id: string;
  name: string;
  authority: AIExecutionGovernanceAuthority;
  requiredDecision: AIExecutionGovernanceDecision;
  riskLevel: AIExecutionGovernanceRiskLevel;
  mandatory: boolean;
  createdAt: string;
}

export interface AIExecutionGovernanceContext {
  executionId: string;
  tenantId: string;
  actorId: string;
  capability: string;
  requestedAction: string;
  compliancePassed: boolean;
  riskLevel: AIExecutionGovernanceRiskLevel;
  timestamp: string;
}

export interface AIExecutionGovernanceResult {
  executionId: string;
  decision: AIExecutionGovernanceDecision;
  authority: AIExecutionGovernanceAuthority;
  policyIds: string[];
  reasons: string[];
  governedAt: string;
}