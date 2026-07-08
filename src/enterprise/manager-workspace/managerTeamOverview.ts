import { TeamMember } from "./managerWorkspaceTypes";

export class ManagerTeamOverview {
  constructor(private readonly team: TeamMember[]) {}

  getMembers(): TeamMember[] {
    return this.team;
  }
}
