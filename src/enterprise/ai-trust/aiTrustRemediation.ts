import { AITrustSignal } from "./aiTrustSignal";

export type AITrustRemediationPriority = "low" | "medium" | "high" | "critical";

export interface AITrustRemediationAction {
  id: string;
  profileId: string;
  signalId: string;
  title: string;
  description: string;
  priority: AITrustRemediationPriority;
  ownerTeam: string;
  dueAt?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createAITrustRemediationActions(
  profileId: string,
  failedSignals: AITrustSignal[],
  ownerTeam = "ai-governance",
): AITrustRemediationAction[] {
  return failedSignals.map((signal) => {
    const priority: AITrustRemediationPriority =
      signal.score < 25 ? "critical" : signal.score < 50 ? "high" : "medium";

    return {
      id: `${profileId}:${signal.id}:remediation`,
      profileId,
      signalId: signal.id,
      title: `Remediate ${signal.name}`,
      description: `Improve trust signal '${signal.name}' in category '${signal.category}'.`,
      priority,
      ownerTeam,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
}

export function completeAITrustRemediationAction(
  action: AITrustRemediationAction,
): AITrustRemediationAction {
  return {
    ...action,
    completed: true,
    updatedAt: new Date(),
  };
}