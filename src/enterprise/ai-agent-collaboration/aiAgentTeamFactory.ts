import {
  AIAgentTeam,
  assertValidAIAgentTeam,
  CreateAIAgentTeamInput,
} from "./aiAgentTeam";

export function createAIAgentTeam(input: CreateAIAgentTeamInput): AIAgentTeam {
  const now = new Date();

  const team: AIAgentTeam = {
    id: input.id,
    name: input.name,
    description: input.description,
    objective: input.objective,
    status: "draft",
    priority: input.priority ?? "normal",
    members: input.members.map((member) => ({
      ...member,
      joinedAt: member.joinedAt ?? now,
    })),
    requiredCapabilities: input.requiredCapabilities ?? [],
    policy: input.policy,
    metadata: {
      ...input.metadata,
      createdAt: input.metadata.createdAt ?? now,
      updatedAt: input.metadata.updatedAt ?? now,
    },
  };

  assertValidAIAgentTeam(team);

  return team;
}

export function activateAIAgentTeam(team: AIAgentTeam): AIAgentTeam {
  const activatedTeam: AIAgentTeam = {
    ...team,
    status: "active",
    metadata: {
      ...team.metadata,
      updatedAt: new Date(),
    },
  };

  assertValidAIAgentTeam(activatedTeam);

  return activatedTeam;
}

export function pauseAIAgentTeam(team: AIAgentTeam): AIAgentTeam {
  return {
    ...team,
    status: "paused",
    metadata: {
      ...team.metadata,
      updatedAt: new Date(),
    },
  };
}

export function completeAIAgentTeam(team: AIAgentTeam): AIAgentTeam {
  return {
    ...team,
    status: "completed",
    metadata: {
      ...team.metadata,
      updatedAt: new Date(),
    },
  };
}

export function failAIAgentTeam(team: AIAgentTeam): AIAgentTeam {
  return {
    ...team,
    status: "failed",
    metadata: {
      ...team.metadata,
      updatedAt: new Date(),
    },
  };
}