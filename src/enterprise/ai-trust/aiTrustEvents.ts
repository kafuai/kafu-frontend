export type AITrustEventType =
  | "trust_profile_created"
  | "trust_score_calculated"
  | "trust_policy_evaluated"
  | "trust_decision_created"
  | "trust_gap_detected"
  | "trust_remediation_required";

export interface AITrustEvent {
  id: string;
  organizationId: string;
  profileId: string;
  type: AITrustEventType;
  message: string;
  metadata: Record<string, unknown>;
  occurredAt: Date;
}

export function createAITrustEvent(
  id: string,
  organizationId: string,
  profileId: string,
  type: AITrustEventType,
  message: string,
  metadata: Record<string, unknown> = {},
): AITrustEvent {
  return {
    id,
    organizationId,
    profileId,
    type,
    message,
    metadata,
    occurredAt: new Date(),
  };
}