import { TeamMember } from "./managerWorkspaceTypes";

export class ManagerCoaching {
  constructor(private readonly team: TeamMember[]) {}

  getCoachingTargets(): TeamMember[] {
    return this.team;
  }
}
