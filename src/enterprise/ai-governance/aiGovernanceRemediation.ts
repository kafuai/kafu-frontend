export type AIGovernanceRemediationPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface AIGovernanceRemediationAction {
  id: string;
  organizationId: string;
  sourceId: string;
  sourceType: "risk" | "policy" | "compliance" | "guardrail" | "audit";
  title: string;
  description: string;
  priority: AIGovernanceRemediationPriority;
  ownerTeam: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export function createAIGovernanceRemediationAction(input: {
  id: string;
  organizationId: string;
  sourceId: string;
  sourceType: AIGovernanceRemediationAction["sourceType"];
  title: string;
  description: string;
  priority: AIGovernanceRemediationPriority;
  ownerTeam: string;
  dueDate?: Date;
}): AIGovernanceRemediationAction {
  return {
    ...input,
    completed: false,
    createdAt: new Date(),
  };
}

export function completeAIGovernanceRemediationAction(
  action: AIGovernanceRemediationAction,
): AIGovernanceRemediationAction {
  return {
    ...action,
    completed: true,
    completedAt: new Date(),
  };
}