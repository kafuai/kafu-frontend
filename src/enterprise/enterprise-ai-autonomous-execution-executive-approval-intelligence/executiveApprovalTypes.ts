export type ExecutiveApprovalStatus =
  | "pending"
  | "recommended"
  | "conditionally_recommended"
  | "not_recommended"
  | "approved"
  | "rejected"
  | "escalated";

export type ExecutiveApprovalPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveApprovalLevel =
  | "manager"
  | "director"
  | "executive"
  | "committee"
  | "board";

export type ExecutiveApprovalRiskLevel =
  | "minimal"
  | "moderate"
  | "significant"
  | "severe";

export interface ExecutiveApprover {
  approverId: string;
  approverName?: string | null;
  role: string;
  approvalLevel: ExecutiveApprovalLevel;
  mandatory: boolean;
  available: boolean;
}

export interface ExecutiveApprovalCondition {
  conditionId: string;
  title: string;
  description?: string | null;
  satisfied: boolean;
  blocking: boolean;
}

export interface ExecutiveApprovalEvidence {
  evidenceId: string;
  title: string;
  category: string;
  confidenceScore: number;
  verified: boolean;
}

export interface ExecutiveApprovalRoutingStep {
  sequence: number;
  approvalLevel: ExecutiveApprovalLevel;
  approverIds: string[];
  requiredApprovals: number;
  parallel: boolean;
}
