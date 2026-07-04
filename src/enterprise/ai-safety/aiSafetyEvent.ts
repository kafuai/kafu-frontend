import { AISafetyDecision, AISafetyRiskLevel, AISafetyStatus } from "./aiSafetyTypes";

export enum AISafetyEventType {
  SAFETY_EVALUATED = "SAFETY_EVALUATED",
  SAFETY_REVIEW_REQUIRED = "SAFETY_REVIEW_REQUIRED",
  SAFETY_BLOCKED = "SAFETY_BLOCKED",
  SAFETY_INCIDENT_CREATED = "SAFETY_INCIDENT_CREATED",
}

export interface AISafetyEvent {
  id: string;
  organizationId: string;
  requestId: string;
  modelId: string;
  type: AISafetyEventType;
  status: AISafetyStatus;
  riskLevel: AISafetyRiskLevel;
  message: string;
  createdAt: Date;
}

export function createAISafetyEvent(input: {
  organizationId: string;
  requestId: string;
  modelId: string;
  decision: AISafetyDecision;
}): AISafetyEvent {
  const type =
    input.decision.status === AISafetyStatus.BLOCKED
      ? AISafetyEventType.SAFETY_BLOCKED
      : input.decision.status === AISafetyStatus.NEEDS_REVIEW
        ? AISafetyEventType.SAFETY_REVIEW_REQUIRED
        : AISafetyEventType.SAFETY_EVALUATED;

  return {
    id: `${input.requestId}-ai-safety-event`,
    organizationId: input.organizationId,
    requestId: input.requestId,
    modelId: input.modelId,
    type,
    status: input.decision.status,
    riskLevel: input.decision.riskLevel,
    message: input.decision.reason,
    createdAt: new Date(),
  };
}