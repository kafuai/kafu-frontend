import { AIGovernanceStatus } from "./aiGovernanceTypes";

export interface AIGovernanceLifecycleState {
  entityId: string;
  entityType: "policy" | "model" | "use_case";
  status: AIGovernanceStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export function createAIGovernanceLifecycleState(input: {
  entityId: string;
  entityType: AIGovernanceLifecycleState["entityType"];
  status: AIGovernanceStatus;
  changedBy: string;
  reason?: string;
}): AIGovernanceLifecycleState {
  return {
    entityId: input.entityId,
    entityType: input.entityType,
    status: input.status,
    changedBy: input.changedBy,
    changedAt: new Date(),
    reason: input.reason,
  };
}