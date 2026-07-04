import {
  AISafetyDecision,
  AISafetyDomain,
  AISafetyRiskLevel,
  AISafetyStatus,
} from "./aiSafetyTypes";

export enum AISafetyIncidentStatus {
  OPEN = "OPEN",
  INVESTIGATING = "INVESTIGATING",
  MITIGATED = "MITIGATED",
  CLOSED = "CLOSED",
}

export interface AISafetyIncident {
  id: string;
  organizationId: string;
  requestId: string;
  modelId: string;
  domains: AISafetyDomain[];
  riskLevel: AISafetyRiskLevel;
  status: AISafetyIncidentStatus;
  summary: string;
  decisionStatus: AISafetyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function createAISafetyIncidentFromDecision(
  organizationId: string,
  requestId: string,
  modelId: string,
  decision: AISafetyDecision,
): AISafetyIncident | null {
  if (decision.status === AISafetyStatus.SAFE) {
    return null;
  }

  const now = new Date();

  return {
    id: `${requestId}-ai-safety-incident`,
    organizationId,
    requestId,
    modelId,
    domains: Array.from(new Set(decision.signals.map((signal) => signal.domain))),
    riskLevel: decision.riskLevel,
    status: AISafetyIncidentStatus.OPEN,
    summary: decision.reason,
    decisionStatus: decision.status,
    createdAt: now,
    updatedAt: now,
  };
}