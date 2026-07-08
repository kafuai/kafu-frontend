import { ManagerWorkspaceModel } from "./managerWorkspaceTypes";
import { ManagerWorkspace } from "./managerWorkspace";
import { ManagerDashboard } from "./managerDashboard";
import { ManagerTeamOverview } from "./managerTeamOverview";
import { ManagerTasks } from "./managerTasks";
import { ManagerApprovals } from "./managerApprovals";
import { ManagerPerformance } from "./managerPerformance";
import { ManagerCoaching } from "./managerCoaching";
import { ManagerWorkload } from "./managerWorkload";
import { ManagerRisks } from "./managerRisks";
import { ManagerNotifications } from "./managerNotifications";

export class ManagerWorkspaceFactory {
  static create(workspace: ManagerWorkspaceModel) {
    return {
      workspace: new ManagerWorkspace(workspace),
      dashboard: new ManagerDashboard(workspace.tasks),
      teamOverview: new ManagerTeamOverview(workspace.team),
      tasks: new ManagerTasks(workspace.tasks),
      approvals: new ManagerApprovals(workspace.tasks),
      performance: new ManagerPerformance(workspace.tasks),
      coaching: new ManagerCoaching(workspace.team),
      workload: new ManagerWorkload(workspace.tasks),
      risks: new ManagerRisks(workspace.tasks),
      notifications: new ManagerNotifications(workspace.tasks),
    };
  }
}
