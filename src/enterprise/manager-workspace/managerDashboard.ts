import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerDashboard {
  constructor(private readonly tasks: ManagerTask[]) {}

  getTasks(): ManagerTask[] {
    return this.tasks;
  }
}
