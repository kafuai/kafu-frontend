export type AIAgentCollaborationStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type AIAgentCollaborationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type AIAgentTeamRole =
  | "lead"
  | "planner"
  | "executor"
  | "reviewer"
  | "approver"
  | "observer";

export type AIAgentCollaborationDecisionMode =
  | "lead_decides"
  | "majority_vote"
  | "unanimous"
  | "weighted_consensus";

export type AIAgentCollaborationRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AIAgentCollaborationAuditMetadata {
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  correlationId?: string;
  tenantId?: string;
  organizationId?: string;
}

export interface AIAgentCollaborationCapabilityRequirement {
  capabilityId: string;
  required: boolean;
  weight: number;
}

export interface AIAgentCollaborationPolicy {
  requiresHumanApproval: boolean;
  allowAutonomousDelegation: boolean;
  allowParallelExecution: boolean;
  maxAgents: number;
  decisionMode: AIAgentCollaborationDecisionMode;
  riskLevel: AIAgentCollaborationRiskLevel;
}