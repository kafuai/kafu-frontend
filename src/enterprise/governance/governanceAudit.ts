import { GovernanceDecision } from "./governanceTypes";

export type GovernanceAuditEventType =
  | "governance.evaluated"
  | "governance.approved"
  | "governance.rejected"
  | "governance.review_required";

export type GovernanceAuditEvent = {
  id: string;
  type: GovernanceAuditEventType;
  decision: GovernanceDecision;
  createdAt: Date;
};

export function createGovernanceAuditEvent(
  decision: GovernanceDecision,
): GovernanceAuditEvent {
  return {
    id: `${decision.subject.type}:${decision.subject.id}:${Date.now()}`,
    type:
      decision.status === "approved"
        ? "governance.approved"
        : decision.status === "rejected"
          ? "governance.rejected"
          : "governance.review_required",
    decision,
    createdAt: new Date(),
  };
}