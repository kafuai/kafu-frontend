import { AIAgentTeam } from "../aiAgentTeam";

export type AgentCollaborationStrategyType =
  | "centralized"
  | "distributed"
  | "hierarchical"
  | "consensus";

export interface AgentCollaborationStrategy {
  id: string;
  organizationId: string;
  name: string;
  type: AgentCollaborationStrategyType;
  description: string;
  minimumAgents: number;
  maximumAgents: number;
  active: boolean;
}

export function selectAgentCollaborationStrategy(
  team: AIAgentTeam,
): AgentCollaborationStrategyType {
  const count = team.members.length;

  if (count <= 2) {
    return "centralized";
  }

  if (count <= 5) {
    return "hierarchical";
  }

  if (count <= 10) {
    return "distributed";
  }

  return "consensus";
}