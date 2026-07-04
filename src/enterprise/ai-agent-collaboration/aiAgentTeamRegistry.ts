import { AIAgentTeam, assertValidAIAgentTeam } from "./aiAgentTeam";

export class AIAgentTeamRegistry {
  private readonly teams = new Map<string, AIAgentTeam>();

  register(team: AIAgentTeam): AIAgentTeam {
    assertValidAIAgentTeam(team);

    if (this.teams.has(team.id)) {
      throw new Error(`AI agent team already exists: ${team.id}`);
    }

    this.teams.set(team.id, team);

    return team;
  }

  upsert(team: AIAgentTeam): AIAgentTeam {
    assertValidAIAgentTeam(team);
    this.teams.set(team.id, team);

    return team;
  }

  get(teamId: string): AIAgentTeam | undefined {
    return this.teams.get(teamId);
  }

  require(teamId: string): AIAgentTeam {
    const team = this.get(teamId);

    if (!team) {
      throw new Error(`AI agent team not found: ${teamId}`);
    }

    return team;
  }

  list(): AIAgentTeam[] {
    return Array.from(this.teams.values());
  }

  listByOrganization(organizationId: string): AIAgentTeam[] {
    return this.list().filter(
      (team) => team.metadata.organizationId === organizationId,
    );
  }

  listByTenant(tenantId: string): AIAgentTeam[] {
    return this.list().filter((team) => team.metadata.tenantId === tenantId);
  }

  delete(teamId: string): boolean {
    return this.teams.delete(teamId);
  }

  clear(): void {
    this.teams.clear();
  }
}