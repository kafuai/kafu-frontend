import { AIAgentCollaborationMetrics } from "./aiAgentCollaborationMetrics";

export interface AIAgentCollaborationAnalytics {
  teamId: string;
  collaborationIntensity: number;
  conflictResolutionRate: number;
  governanceCompletionRate: number;
  generatedAt: Date;
}

export function analyzeAIAgentCollaboration(
  metrics: AIAgentCollaborationMetrics,
): AIAgentCollaborationAnalytics {
  const collaborationActions =
    metrics.messages +
    metrics.delegations +
    metrics.negotiations +
    metrics.consensusCompleted;

  return {
    teamId: metrics.teamId,
    collaborationIntensity: collaborationActions,
    conflictResolutionRate:
      metrics.conflicts === 0
        ? 1
        : metrics.conflictsResolved / metrics.conflicts,
    governanceCompletionRate:
      metrics.reviewsCompleted + metrics.approvalsCompleted,
    generatedAt: new Date(),
  };
}