import { AIAgentProfile } from "./aiAgentTypes";

export interface AIAgentCatalogSearchInput {
  organizationId: string;
  capabilityIds?: string[];
  status?: AIAgentProfile["status"];
  keyword?: string;
}

export function searchAIAgentCatalog(
  agents: readonly AIAgentProfile[],
  input: AIAgentCatalogSearchInput,
): AIAgentProfile[] {
  const keyword = input.keyword?.toLowerCase();

  return agents.filter((agent) => {
    if (agent.organizationId !== input.organizationId) {
      return false;
    }

    if (input.status && agent.status !== input.status) {
      return false;
    }

    if (input.capabilityIds && input.capabilityIds.length > 0) {
      const agentCapabilityIds = agent.capabilities.map(
        (capability) => capability.id,
      );

      const hasAllCapabilities = input.capabilityIds.every((capabilityId) =>
        agentCapabilityIds.includes(capabilityId),
      );

      if (!hasAllCapabilities) {
        return false;
      }
    }

    if (keyword) {
      const searchable = [
        agent.id,
        agent.name,
        agent.description,
        agent.ownerTeam,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    }

    return true;
  });
}