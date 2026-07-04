export type AIGovernanceRiskLevel = "low" | "medium" | "high" | "critical";

export type AIGovernanceStatus =
  | "draft"
  | "active"
  | "under_review"
  | "suspended"
  | "retired";

export type AIUseCaseCategory =
  | "automation"
  | "recommendation"
  | "classification"
  | "prediction"
  | "content_generation"
  | "decision_support"
  | "agentic_execution";

export type AIHumanOversightLevel =
  | "none"
  | "review_required"
  | "approval_required"
  | "continuous_monitoring";

export interface AIGovernancePolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  riskLevel: AIGovernanceRiskLevel;
  status: AIGovernanceStatus;
  allowedUseCases: AIUseCaseCategory[];
  restrictedUseCases: AIUseCaseCategory[];
  humanOversightLevel: AIHumanOversightLevel;
  requiresExplainability: boolean;
  requiresAuditTrail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIUseCaseProfile {
  id: string;
  organizationId: string;
  name: string;
  category: AIUseCaseCategory;
  description: string;
  ownerTeam: string;
  dataSensitivity: "public" | "internal" | "confidential" | "restricted";
  businessCriticality: "low" | "medium" | "high" | "mission_critical";
  automatedDecisionImpact: boolean;
  customerFacing: boolean;
}