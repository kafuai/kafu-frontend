import { AIAgentTeam, getAIAgentTeamLead } from "./aiAgentTeam";

export interface AIAgentTeamCoordinationPlan {
  teamId: string;
  leadAgentId: string;
  participantAgentIds: string[];
  coordinationSteps: string[];
  createdAt: Date;
}

export function createAIAgentTeamCoordinationPlan(
  team: AIAgentTeam,
): AIAgentTeamCoordinationPlan {
  const lead = getAIAgentTeamLead(team);

  if (!lead) {
    throw new Error(`AI agent team lead not found: ${team.id}`);
  }

  return {
    teamId: team.id,
    leadAgentId: lead.agentId,
    participantAgentIds: team.members
      .filter((member) => member.agentId !== lead.agentId)
      .map((member) => member.agentId),
    coordinationSteps: [
      "Share team objective",
      "Distribute responsibilities",
      "Collect agent proposals",
      "Resolve conflicts",
      "Merge final result",
    ],
    createdAt: new Date(),
  };
}