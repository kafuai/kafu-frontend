import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerApprovals {
  constructor(private readonly tasks: ManagerTask[]) {}

  getPendingApprovals(): ManagerTask[] {
    return this.tasks.filter(task => task.status === "blocked");
  }
}
