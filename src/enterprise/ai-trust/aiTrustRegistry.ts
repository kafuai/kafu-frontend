import { AITrustProfile } from "./aiTrustProfile";

export interface AITrustRegistry {
  profiles: AITrustProfile[];
}

export function createAITrustRegistry(profiles: AITrustProfile[] = []): AITrustRegistry {
  return { profiles };
}

export function registerAITrustProfile(
  registry: AITrustRegistry,
  profile: AITrustProfile,
): AITrustRegistry {
  const existing = registry.profiles.filter((item) => item.id !== profile.id);

  return {
    profiles: [...existing, profile],
  };
}

export function findAITrustProfileById(
  registry: AITrustRegistry,
  profileId: string,
): AITrustProfile | undefined {
  return registry.profiles.find((profile) => profile.id === profileId);
}

export function listAITrustProfilesByModel(
  registry: AITrustRegistry,
  modelId: string,
): AITrustProfile[] {
  return registry.profiles.filter((profile) => profile.context.modelId === modelId);
}