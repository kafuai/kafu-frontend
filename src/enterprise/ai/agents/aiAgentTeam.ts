import { AIAgentProfile } from "./aiAgentTypes";

export type AIAgentTeamStatus = "active" | "inactive" | "suspended";

export interface AIAgentTeam {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: AIAgentTeamStatus;
  leadAgentId: string;
  agentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function createAIAgentTeam(
  id: string,
  organizationId: string,
  name: string,
  description: string,
  leadAgent: AIAgentProfile,
  agents: AIAgentProfile[],
): AIAgentTeam {
  if (leadAgent.organizationId !== organizationId) {
    throw new Error("Lead AI agent must belong to the team organization.");
  }

  for (const agent of agents) {
    if (agent.organizationId !== organizationId) {
      throw new Error("All AI agents must belong to the team organization.");
    }
  }

  const agentIds = Array.from(
    new Set([leadAgent.id, ...agents.map((agent) => agent.id)]),
  );

  return {
    id,
    organizationId,
    name,
    description,
    status: "active",
    leadAgentId: leadAgent.id,
    agentIds,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function addAIAgentToTeam(
  team: AIAgentTeam,
  agent: AIAgentProfile,
): AIAgentTeam {
  if (team.organizationId !== agent.organizationId) {
    throw new Error("AI agent and team organization mismatch.");
  }

  return {
    ...team,
    agentIds: Array.from(new Set([...team.agentIds, agent.id])),
    updatedAt: new Date(),
  };
}

export function removeAIAgentFromTeam(
  team: AIAgentTeam,
  agentId: string,
): AIAgentTeam {
  if (team.leadAgentId === agentId) {
    throw new Error("Lead AI agent cannot be removed from the team.");
  }

  return {
    ...team,
    agentIds: team.agentIds.filter((id) => id !== agentId),
    updatedAt: new Date(),
  };
}