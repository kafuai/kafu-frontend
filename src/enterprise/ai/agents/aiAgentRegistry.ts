import { AIAgentProfile } from "./aiAgentTypes";
import { assertValidAIAgentProfile } from "./aiAgentValidator";

export class AIAgentRegistry {
  private readonly agents = new Map<string, AIAgentProfile>();

  register(profile: AIAgentProfile): AIAgentProfile {
    assertValidAIAgentProfile(profile);

    if (this.agents.has(profile.id)) {
      throw new Error(`AI agent already exists: ${profile.id}`);
    }

    this.agents.set(profile.id, profile);
    return profile;
  }

  upsert(profile: AIAgentProfile): AIAgentProfile {
    assertValidAIAgentProfile(profile);
    this.agents.set(profile.id, profile);
    return profile;
  }

  get(agentId: string): AIAgentProfile | undefined {
    return this.agents.get(agentId);
  }

  require(agentId: string): AIAgentProfile {
    const profile = this.get(agentId);

    if (!profile) {
      throw new Error(`AI agent not found: ${agentId}`);
    }

    return profile;
  }

  listByOrganization(organizationId: string): AIAgentProfile[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.organizationId === organizationId,
    );
  }

  listActiveByOrganization(organizationId: string): AIAgentProfile[] {
    return this.listByOrganization(organizationId).filter(
      (agent) => agent.status === "active",
    );
  }

  remove(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  clear(): void {
    this.agents.clear();
  }
}