import {
  AIAgentCollaborationAuditMetadata,
  AIAgentCollaborationCapabilityRequirement,
  AIAgentCollaborationPolicy,
  AIAgentCollaborationPriority,
  AIAgentCollaborationStatus,
  AIAgentTeamRole,
} from "./aiAgentCollaborationTypes";

export interface AIAgentTeamMember {
  agentId: string;
  role: AIAgentTeamRole;
  weight: number;
  required: boolean;
  joinedAt: Date;
}

export interface AIAgentTeam {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: AIAgentCollaborationStatus;
  priority: AIAgentCollaborationPriority;
  members: AIAgentTeamMember[];
  requiredCapabilities: AIAgentCollaborationCapabilityRequirement[];
  policy: AIAgentCollaborationPolicy;
  metadata: AIAgentCollaborationAuditMetadata;
}

export interface CreateAIAgentTeamInput {
  id: string;
  name: string;
  description: string;
  objective: string;
  priority?: AIAgentCollaborationPriority;
  members: AIAgentTeamMember[];
  requiredCapabilities?: AIAgentCollaborationCapabilityRequirement[];
  policy: AIAgentCollaborationPolicy;
  metadata: AIAgentCollaborationAuditMetadata;
}

export function getAIAgentTeamLead(
  team: AIAgentTeam,
): AIAgentTeamMember | undefined {
  return team.members.find((member) => member.role === "lead");
}

export function getAIAgentTeamMembersByRole(
  team: AIAgentTeam,
  role: AIAgentTeamRole,
): AIAgentTeamMember[] {
  return team.members.filter((member) => member.role === role);
}

export function hasAIAgentTeamMember(
  team: AIAgentTeam,
  agentId: string,
): boolean {
  return team.members.some((member) => member.agentId === agentId);
}

export function resolveAIAgentTeamProfiles<T extends { id: string }>(
  team: AIAgentTeam,
  agents: T[],
): T[] {
  const agentIds = new Set(team.members.map((member) => member.agentId));

  return agents.filter((agent) => agentIds.has(agent.id));
}

export function assertValidAIAgentTeam(team: AIAgentTeam): void {
  if (!team.id.trim()) {
    throw new Error("AI agent team id is required");
  }

  if (!team.name.trim()) {
    throw new Error(`AI agent team name is required: ${team.id}`);
  }

  if (!team.objective.trim()) {
    throw new Error(`AI agent team objective is required: ${team.id}`);
  }

  if (team.members.length === 0) {
    throw new Error(
      `AI agent team must have at least one member: ${team.id}`,
    );
  }

  if (team.members.length > team.policy.maxAgents) {
    throw new Error(
      `AI agent team exceeds max agents policy: ${team.id}`,
    );
  }

  const leadCount = team.members.filter(
    (member) => member.role === "lead",
  ).length;

  if (leadCount !== 1) {
    throw new Error(
      `AI agent team must have exactly one lead: ${team.id}`,
    );
  }

  const seenAgentIds = new Set<string>();

  for (const member of team.members) {
    if (!member.agentId.trim()) {
      throw new Error(
        `AI agent team member agentId is required: ${team.id}`,
      );
    }

    if (member.weight < 0) {
      throw new Error(
        `AI agent team member weight cannot be negative: ${member.agentId}`,
      );
    }

    if (seenAgentIds.has(member.agentId)) {
      throw new Error(
        `Duplicate AI agent member found: ${member.agentId}`,
      );
    }

    seenAgentIds.add(member.agentId);
  }

  for (const capability of team.requiredCapabilities) {
    if (!capability.capabilityId.trim()) {
      throw new Error(
        `AI agent capability id is required: ${team.id}`,
      );
    }

    if (capability.weight < 0) {
      throw new Error(
        `AI agent capability weight cannot be negative: ${capability.capabilityId}`,
      );
    }
  }
}