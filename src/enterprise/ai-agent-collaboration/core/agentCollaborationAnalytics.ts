import { AIAgentTeam } from "../aiAgentTeam";

export interface AgentCollaborationAnalytics {
  totalTeams: number;
  totalAgents: number;
  averageTeamSize: number;
  generatedAt: Date;
}

export function buildAgentCollaborationAnalytics(
  teams: AIAgentTeam[],
): AgentCollaborationAnalytics {
  const totalTeams = teams.length;

  const totalAgents = teams.reduce(
    (sum, team) => sum + team.members.length,
    0,
  );

  return {
    totalTeams,
    totalAgents,
    averageTeamSize:
      totalTeams === 0 ? 0 : totalAgents / totalTeams,
    generatedAt: new Date(),
  };
}