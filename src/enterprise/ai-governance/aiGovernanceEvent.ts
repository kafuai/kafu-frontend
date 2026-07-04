import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export type AIGovernanceEventSeverity = "info" | "warning" | "critical";

export interface AIGovernanceEvent {
  id: string;
  organizationId: string;
  type: string;
  severity: AIGovernanceEventSeverity;
  riskLevel?: AIGovernanceRiskLevel;
  message: string;
  metadata: Record<string, unknown>;
  occurredAt: Date;
}

export function createAIGovernanceEvent(
  event: Omit<AIGovernanceEvent, "occurredAt">,
): AIGovernanceEvent {
  return {
    ...event,
    occurredAt: new Date(),
  };
}