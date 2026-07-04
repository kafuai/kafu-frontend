export type AIAgentStatus =
  | "draft"
  | "active"
  | "paused"
  | "retired"
  | "suspended";

export type AIAgentAutonomyLevel =
  | "assistive"
  | "supervised"
  | "semi_autonomous"
  | "autonomous";

export type AIAgentRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAgentCapabilityType =
  | "reasoning"
  | "planning"
  | "tool_use"
  | "workflow_execution"
  | "data_analysis"
  | "content_generation"
  | "monitoring"
  | "decision_support"
  | "coordination";

export type AIAgentExecutionStatus =
  | "pending"
  | "planning"
  | "running"
  | "waiting_for_input"
  | "completed"
  | "failed"
  | "cancelled";

export type AIAgentDecisionMode =
  | "recommend_only"
  | "human_approval_required"
  | "policy_bound_execution"
  | "fully_delegated";

export interface AIAgentCapability {
  id: string;
  name: string;
  type: AIAgentCapabilityType;
  description: string;
  enabled: boolean;
  requiresApproval: boolean;
  riskLevel: AIAgentRiskLevel;
}

export interface AIAgentPermission {
  id: string;
  resource: string;
  action: string;
  allowed: boolean;
  requiresAudit: boolean;
}

export interface AIAgentProfile {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  ownerTeam: string;
  status: AIAgentStatus;
  autonomyLevel: AIAgentAutonomyLevel;
  decisionMode: AIAgentDecisionMode;
  riskLevel: AIAgentRiskLevel;
  capabilities: AIAgentCapability[];
  permissions: AIAgentPermission[];
  systemPurpose: string;
  operatingBoundaries: string[];
  escalationRules: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAgentProfileInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  ownerTeam: string;
  autonomyLevel: AIAgentAutonomyLevel;
  decisionMode: AIAgentDecisionMode;
  riskLevel: AIAgentRiskLevel;
  capabilities?: AIAgentCapability[];
  permissions?: AIAgentPermission[];
  systemPurpose: string;
  operatingBoundaries?: string[];
  escalationRules?: string[];
}

export interface UpdateAIAgentProfileInput {
  name?: string;
  description?: string;
  ownerTeam?: string;
  status?: AIAgentStatus;
  autonomyLevel?: AIAgentAutonomyLevel;
  decisionMode?: AIAgentDecisionMode;
  riskLevel?: AIAgentRiskLevel;
  capabilities?: AIAgentCapability[];
  permissions?: AIAgentPermission[];
  systemPurpose?: string;
  operatingBoundaries?: string[];
  escalationRules?: string[];
}