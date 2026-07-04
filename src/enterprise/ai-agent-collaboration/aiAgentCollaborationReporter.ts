import { AIAgentCollaborationMetrics } from "./aiAgentCollaborationMetrics";

export interface AIAgentCollaborationReport {
  teamId: string;
  healthScore: number;
  summary: string;
  metrics: AIAgentCollaborationMetrics;
  generatedAt: Date;
}

export function createAIAgentCollaborationReport(
  metrics: AIAgentCollaborationMetrics,
): AIAgentCollaborationReport {
  const conflictPenalty = metrics.conflicts * 10;
  const resolutionBonus = metrics.conflictsResolved * 5;
  const activityBonus =
    metrics.messages +
    metrics.delegations +
    metrics.negotiations +
    metrics.consensusCompleted;

  const healthScore = Math.max(
    0,
    Math.min(100, 70 + activityBonus + resolutionBonus - conflictPenalty),
  );

  return {
    teamId: metrics.teamId,
    healthScore,
    summary:
      healthScore >= 80
        ? "AI agent collaboration is healthy and productive"
        : healthScore >= 50
          ? "AI agent collaboration is active but requires monitoring"
          : "AI agent collaboration requires immediate attention",
    metrics,
    generatedAt: new Date(),
  };
}