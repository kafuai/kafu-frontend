export type AIAccountabilitySeverity = "low" | "medium" | "high" | "critical";

export type AIAccountabilityStatus =
  | "draft"
  | "assigned"
  | "under_review"
  | "accepted"
  | "remediation_required"
  | "closed";

export type AIAccountabilityActorType =
  | "human"
  | "team"
  | "system"
  | "vendor"
  | "committee";

export type AIAccountabilityDecisionType =
  | "recommendation"
  | "approval"
  | "rejection"
  | "classification"
  | "automation"
  | "escalation"
  | "override";

export type AIAccountabilityEvidenceType =
  | "model_output"
  | "policy_reference"
  | "human_review"
  | "audit_log"
  | "impact_assessment"
  | "external_document"
  | "system_trace";

export type AIAccountabilityResponsibilityType =
  | "owner"
  | "approver"
  | "reviewer"
  | "operator"
  | "escalation_contact"
  | "remediation_owner";

export interface AIAccountabilityActor {
  id: string;
  organizationId: string;
  type: AIAccountabilityActorType;
  name: string;
  email?: string;
  team?: string;
  role?: string;
}

export interface AIAccountabilityTimeWindow {
  startsAt: Date;
  endsAt?: Date;
}

export interface AIAccountabilityRiskSignal {
  id: string;
  severity: AIAccountabilitySeverity;
  category: string;
  description: string;
  detectedAt: Date;
}