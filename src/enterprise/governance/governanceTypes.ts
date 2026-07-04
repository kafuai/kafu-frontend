export type GovernanceSeverity = "low" | "medium" | "high" | "critical";

export type GovernanceDecisionStatus =
  | "approved"
  | "rejected"
  | "requires_review";

export type GovernanceSubjectType =
  | "automation"
  | "workflow"
  | "execution"
  | "intelligence";

export type GovernanceSubject = {
  id: string;
  type: GovernanceSubjectType;
  organizationId: string;
};

export type GovernanceDecision = {
  subject: GovernanceSubject;
  status: GovernanceDecisionStatus;
  severity: GovernanceSeverity;
  reason: string;
  createdAt: Date;
};