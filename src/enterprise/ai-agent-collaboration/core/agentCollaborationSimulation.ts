import { AIAgentTeam } from "../aiAgentTeam";

export interface AgentCollaborationSimulationResult {
  teamId: string;
  predictedSuccessRate: number;
  predictedExecutionTime: number;
  predictedCoordinationScore: number;
  simulatedAt: Date;
}

export function simulateAgentCollaboration(
  team: AIAgentTeam,
): AgentCollaborationSimulationResult {
  const members = team.members.length;

  return {
    teamId: team.id,
    predictedSuccessRate: Math.min(100, 60 + members * 4),
    predictedExecutionTime: Math.max(5, 120 - members * 6),
    predictedCoordinationScore: Math.min(100, 50 + members * 5),
    simulatedAt: new Date(),
  };
}