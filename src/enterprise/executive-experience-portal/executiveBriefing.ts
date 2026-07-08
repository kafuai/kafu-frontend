import { ExecutiveWorkspaceModel } from "./executiveExperienceTypes";

export class ExecutiveBriefing {
  createBriefing(workspace: ExecutiveWorkspaceModel): string {
    return `Executive ${workspace.executive} has ${workspace.alerts.length} alerts, ${workspace.actions.length} actions, and ${workspace.goals.length} goals.`;
  }
}
