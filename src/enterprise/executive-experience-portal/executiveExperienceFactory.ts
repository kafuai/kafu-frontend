import { ExecutiveWorkspaceModel } from "./executiveExperienceTypes";
import { ExecutiveWorkspace } from "./executiveWorkspace";
import { ExecutiveDashboard } from "./executiveDashboard";
import { ExecutiveCockpit } from "./executiveCockpit";
import { ExecutiveAlerts } from "./executiveAlerts";
import { ExecutiveActions } from "./executiveActions";
import { ExecutiveGoals } from "./executiveGoals";
import { ExecutiveNotifications } from "./executiveNotifications";

export class ExecutiveExperienceFactory {
  static create(workspace: ExecutiveWorkspaceModel) {
    return {
      workspace: new ExecutiveWorkspace(workspace),
      dashboard: new ExecutiveDashboard(workspace.metrics),
      cockpit: new ExecutiveCockpit(workspace),
      alerts: new ExecutiveAlerts(workspace.alerts),
      actions: new ExecutiveActions(workspace.actions),
      goals: new ExecutiveGoals(workspace.goals),
      notifications: new ExecutiveNotifications(workspace.alerts),
    };
  }
}
