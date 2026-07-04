import { AIAgentCollaborationEvent } from "./aiAgentCollaborationEvents";
import { AIAgentTeam } from "./aiAgentTeam";

export interface AIAgentCollaborationRegistrySnapshot {
  teams: AIAgentTeam[];
  events: AIAgentCollaborationEvent[];
  createdAt: Date;
}

export class AIAgentCollaborationRegistry {
  private readonly teams = new Map<string, AIAgentTeam>();
  private readonly events: AIAgentCollaborationEvent[] = [];

  registerTeam(team: AIAgentTeam): AIAgentTeam {
    if (this.teams.has(team.id)) {
      throw new Error(`AI agent collaboration team already exists: ${team.id}`);
    }

    this.teams.set(team.id, team);
    return team;
  }

  upsertTeam(team: AIAgentTeam): AIAgentTeam {
    this.teams.set(team.id, team);
    return team;
  }

  getTeam(teamId: string): AIAgentTeam | undefined {
    return this.teams.get(teamId);
  }

  requireTeam(teamId: string): AIAgentTeam {
    const team = this.getTeam(teamId);

    if (!team) {
      throw new Error(`AI agent collaboration team not found: ${teamId}`);
    }

    return team;
  }

  listTeams(): AIAgentTeam[] {
    return Array.from(this.teams.values());
  }

  recordEvent(event: AIAgentCollaborationEvent): AIAgentCollaborationEvent {
    this.events.push(event);
    return event;
  }

  listEvents(teamId?: string): AIAgentCollaborationEvent[] {
    return teamId
      ? this.events.filter((event) => event.teamId === teamId)
      : [...this.events];
  }

  snapshot(): AIAgentCollaborationRegistrySnapshot {
    return {
      teams: this.listTeams(),
      events: this.listEvents(),
      createdAt: new Date(),
    };
  }

  clear(): void {
    this.teams.clear();
    this.events.length = 0;
  }
}