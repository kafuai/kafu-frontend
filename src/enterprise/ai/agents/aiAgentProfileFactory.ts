import {
  AIAgentProfile,
  CreateAIAgentProfileInput,
  UpdateAIAgentProfileInput,
} from "./aiAgentTypes";

export function createAIAgentProfile(
  input: CreateAIAgentProfileInput,
): AIAgentProfile {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    ownerTeam: input.ownerTeam,
    status: "draft",
    autonomyLevel: input.autonomyLevel,
    decisionMode: input.decisionMode,
    riskLevel: input.riskLevel,
    capabilities: input.capabilities ?? [],
    permissions: input.permissions ?? [],
    systemPurpose: input.systemPurpose,
    operatingBoundaries: input.operatingBoundaries ?? [],
    escalationRules: input.escalationRules ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateAIAgentProfile(
  profile: AIAgentProfile,
  input: UpdateAIAgentProfileInput,
): AIAgentProfile {
  return {
    ...profile,
    ...input,
    updatedAt: new Date(),
  };
}

export function activateAIAgentProfile(profile: AIAgentProfile): AIAgentProfile {
  return {
    ...profile,
    status: "active",
    updatedAt: new Date(),
  };
}

export function pauseAIAgentProfile(profile: AIAgentProfile): AIAgentProfile {
  return {
    ...profile,
    status: "paused",
    updatedAt: new Date(),
  };
}

export function retireAIAgentProfile(profile: AIAgentProfile): AIAgentProfile {
  return {
    ...profile,
    status: "retired",
    updatedAt: new Date(),
  };
}